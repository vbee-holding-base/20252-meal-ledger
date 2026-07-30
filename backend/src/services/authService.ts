import { LoginTicket, OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import {
  findOwnerByEmail,
  findOwnerById,
  createOwner,
  setOwnerXid,
} from "../repo/authRepo";
import { Response } from "express";
import {
  ExternalError,
  ServerError,
  UnauthorisedError,
  ValidationError,
} from "../config/errors";
import { redisClient } from "../config/redis";

let client: OAuth2Client;

const getClient = () => {
  if (!client) {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_CALLBACK_URL
    )
      throw new ServerError(
        "Google OAuth environment variables are not defined",
      );
    client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_CALLBACK_URL!,
    );
  }
  return client;
};

export const generateAuthorizeUrl = () => {
  return getClient().generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });
};

export const generateAccessToken = (id: string) => {
  if (!process.env.JWT_SECRET)
    throw new ServerError("JWT_SECRET is not defined in environment");

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = async (id: string): Promise<string> => {
  if (!process.env.JWT_REFRESH_SECRET)
    throw new ServerError("JWT_REFRESH_SECRET is not defined in environment");

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  try {
    if (redisClient.isOpen) {
      await redisClient.set(`refresh_token:${id}`, refreshToken, {
        EX: 7 * 24 * 60 * 60,
      });
    }
  } catch (error) {
    console.error("Failed to store refresh token in Redis:", error);
  }

  return refreshToken;
};

export const redirectToFrontend = (
  res: Response,
  params: Record<string, string>,
): void => {
  const query = new URLSearchParams(params).toString();
  if (!process.env.FRONTEND_URL)
    throw new ServerError("FRONTEND_URL is not defined in environment");
  res.redirect(302, `${process.env.FRONTEND_URL}/auth/callback#${query}`);
};

export const getClientTicket = async (code: string): Promise<LoginTicket> => {
  const tokens = await getClient().getToken(code);
  if (!tokens.tokens.id_token)
    throw new ExternalError("ID token not found in Google response");
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId)
    throw new ServerError("Google client ID is not defined in environment");
  return await getClient().verifyIdToken({
    idToken: tokens.tokens.id_token,
    audience: googleClientId,
  });
};

export const findOrCreateOwner = async (ticket: LoginTicket) => {
  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email)
    throw new ValidationError("invalid Google ID token payload");

  const googleID = payload.sub;
  const email = payload.email;
  const name = payload.name ?? "";
  const avatar = payload.picture ?? "";

  let owner = await findOwnerByEmail(email);
  if (!owner) {
    owner = await createOwner(googleID, name, email, avatar);
  }
  return owner;
};

export const getMyInfo = async (_id: string) => {
  const owner = await findOwnerById(_id);
  return {
    _id: owner._id.toString(),
    email: owner.email,
    name: owner.fullName,
    avatarUrl: owner.avatar,
    createdAt: (owner as any).createdAt,
  };
};

export const regenerateAccessToken = async (token: string) => {
  if (!process.env.JWT_REFRESH_SECRET)
    throw new ServerError("JWT_REFRESH_SECRET is not defined in environment");
  try {
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
    )) as any;

    if (redisClient.isOpen) {
      const storedToken = await redisClient.get(`refresh_token:${decoded.id}`);
      if (!storedToken || storedToken !== token) {
        throw new UnauthorisedError("invalid refresh token");
      }
    }

    return await generateAccessToken(decoded.id);
  } catch (error) {
    if (error instanceof UnauthorisedError || error instanceof ServerError) {
      throw error;
    }
    throw new UnauthorisedError("invalid refresh token");
  }
};

export const revokeRefreshToken = async (
  userId?: string,
  token?: string,
): Promise<void> => {
  try {
    let id = userId;
    if (!id && token && process.env.JWT_REFRESH_SECRET) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_REFRESH_SECRET,
        ) as any;
        id = decoded.id;
      } catch {
        // ignore invalid token error on decode
      }
    }
    if (id && redisClient.isOpen) {
      await redisClient.del(`refresh_token:${id}`);
    }
  } catch (error) {
    console.error("Failed to revoke refresh token from Redis:", error);
  }
};

export const updateOwnerXid = async (_id: string, xid: string) => {
  return await setOwnerXid(_id, xid);
};
