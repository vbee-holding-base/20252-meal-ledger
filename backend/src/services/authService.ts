import { LoginTicket, OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Owner from "../models/ownerSchema";
import { AuthRequest } from "../middlewares/auth";
import { Request, Response } from "express";

let client: OAuth2Client;

const getClient = () => {
  if (!client) {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_CALLBACK_URL
    ) {
      throw new Error("Google OAuth environment variables are not defined");
    }
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
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id: string) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment");
  }

  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};

export const redirectToFrontend = (
  res: Response,
  params: Record<string, string>,
): void => {
  const query = new URLSearchParams(params).toString();
  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in environment");
  }
  res.redirect(302, `${process.env.FRONTEND_URL}/auth/callback#${query}`);
};

export const getClientTicket = async (code: string): Promise<LoginTicket> => {
  const tokens = await getClient().getToken(code);
  if (!tokens.tokens.id_token) {
    throw new Error("ID token not found in Google response");
  }
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    throw new Error("Google client ID is not defined in environment");
  }
  const ticket = await getClient().verifyIdToken({
    idToken: tokens.tokens.id_token,
    audience: googleClientId,
  });
  return ticket;
};

export const findOrCreateOwner = async (ticket: LoginTicket) => {
  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid Google ID token payload");
  }

  const googleID = payload.sub;
  const email = payload.email;
  const name = payload.name ?? "";
  const avatar = payload.picture ?? "";

  let owner = await Owner.findOne({ email });
  if (!owner) {
    owner = await Owner.create({
      _id: new mongoose.Types.ObjectId(),
      googleId: googleID,
      fullName: name,
      email: email,
      avatar: avatar,
      bankAccount: {
        bankName: "",
        accountNumber: "",
        accountName: "",
      },
    });
  }
  return owner;
};

export const getMyInfo = async (_id: string) => {
  const owner = await Owner.findById(_id);
  if (!owner) {
    throw new Error("Owner not found");
    return;
  }
  return {
    _id: owner._id.toString(),
    email: owner.email,
    name: owner.fullName,
    avatarUrl: owner.avatar,
    createdAt: (owner as any).createdAt,
  };
};

export const regenerateAccessToken = async (token: string) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment");
  }
  try {
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
    )) as any;
    const accessToken = await generateAccessToken(decoded.id);
    return accessToken;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
