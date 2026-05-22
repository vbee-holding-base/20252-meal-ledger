import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Owner from "../models/ownerSchema";
import { AuthRequest } from "../middlewares/auth";

let client: OAuth2Client;

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in environment`);
  }
  return value;
};

const getClient = () => {
  if (!client) {
    client = new OAuth2Client(
      getRequiredEnv("GOOGLE_CLIENT_ID"),
      getRequiredEnv("GOOGLE_CLIENT_SECRET"),
      getRequiredEnv("GOOGLE_CALLBACK_URL"),
    );
  }
  return client;
};

const getFrontendUrl = () =>
  process.env.FRONTEND_URL ?? "http://localhost:5173";

const generateToken = (id: string) => {
  return jwt.sign({ id }, getRequiredEnv("JWT_SECRET"), {
    expiresIn: "7d",
  });
};

const redirectToFrontend = (
  res: Response,
  params: Record<string, string>,
): void => {
  const query = new URLSearchParams(params).toString();
  res.redirect(302, `${getFrontendUrl()}/auth/callback#${query}`);
};

/**
 * @desc    Redirect sang Google OAuth
 * @route   GET /api/auth/google
 * @operationId initiateGoogleLogin
 */
export const initiateGoogleLogin = (req: Request, res: Response): void => {
  const authorizeUrl = getClient().generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });

  res.redirect(302, authorizeUrl);
};

/**
 * @desc    Google callback, tra ve JWT cho frontend
 * @route   GET /api/auth/google/callback
 * @operationId googleCallback
 */
export const googleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    redirectToFrontend(res, { error: "AUTH_DENIED" });
    return;
  }

  try {
    const { tokens } = await getClient().getToken(code);
    if (!tokens.id_token) {
      throw new Error("Google did not return an id_token");
    }

    const ticket = await getClient().verifyIdToken({
      idToken: tokens.id_token,
      audience: getRequiredEnv("GOOGLE_CLIENT_ID"),
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Token payload invalid");
    }

    const fullName = payload.name ?? payload.given_name ?? payload.email;
    const avatar = payload.picture ?? "";

    let owner = await Owner.findOne({ email: payload.email });
    if (owner) {
      owner.googleId = payload.sub;
      owner.fullName = owner.fullName || fullName;
      owner.avatar = owner.avatar || avatar;
      await owner.save();
    } else {
      owner = await Owner.create({
        _id: new mongoose.Types.ObjectId(),
        googleId: payload.sub,
        fullName,
        email: payload.email,
        avatar,
        bankAccount: {
          bankName: "",
          accountNumber: "",
          accountName: "",
        },
      });
    }

    redirectToFrontend(res, {
      access_token: generateToken(owner._id.toString()),
      token_type: "Bearer",
      expires_in: "604800",
      owner: JSON.stringify({
        id: owner._id.toString(),
        email: owner.email,
        name: owner.fullName,
        avatar_url: owner.avatar,
        created_at: (owner as any).createdAt,
      }),
    });
  } catch (error) {
    console.error("Google Callback Error:", error);
    redirectToFrontend(res, { error: "SERVER_CRASH" });
  }
};

/**
 * @desc    Lay thong tin owner dang dang nhap
 * @route   GET /api/auth/me
 * @operationId getMe
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const owner = await Owner.findById(req.user?.id);

    if (!owner) {
      res.status(401).json({ message: "Unauthorized - Owner khong ton tai" });
      return;
    }

    res.status(200).json({
      id: owner._id.toString(),
      email: owner.email,
      name: owner.fullName,
      avatar_url: owner.avatar,
      created_at: (owner as any).createdAt,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        "error-code": "SERVER_CRASH",
        message: "Loi server",
      },
    });
  }
};

/**
 * @desc    Dang xuat
 * @route   POST /api/auth/logout
 * @operationId logout
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  res.status(200).json({
    message: "Thanh cong",
  });
};
