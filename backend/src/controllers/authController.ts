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

const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, getRequiredEnv("JWT_SECRET"), {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, getRequiredEnv("JWT_REFRESH_SECRET"), {
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

// GET /api/auth/google

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

// GET /api/auth/google/callback

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

    const accessToken = generateAccessToken(owner._id.toString());
    const refreshToken = generateRefreshToken(owner._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    redirectToFrontend(res, {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: "900",
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

// GET /api/auth/me
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

// POST /api/auth/logout
export const logout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    message: "Thanh cong",
  });
};

// POST /api/auth/refresh
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401).json({ message: "No refresh token found" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      getRequiredEnv("JWT_REFRESH_SECRET"),
    ) as any;
    const accessToken = generateAccessToken(decoded.id);

    res.status(200).json({ access_token: accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
