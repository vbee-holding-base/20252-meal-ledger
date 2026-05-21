import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Owner from "../models/ownerSchema";
import { AuthRequest } from "../middlewares/auth";

// Khởi tạo client lazy để đảm bảo process.env đã được load bởi dotenv trong server.ts
let client: OAuth2Client;
const getClient = () => {
  if (!client) {
    client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID as string,
      process.env.GOOGLE_CLIENT_SECRET as string,
      process.env.GOOGLE_CALLBACK_URL as string,
    );
  }
  return client;
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
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
    prompt: "consent", // Ép hiện màn hình chọn tài khoản
  });

  res.redirect(302, authorizeUrl);
};

/**
 * @desc    Google callback, trả về JWT
 * @route   GET /api/auth/google/callback
 * @operationId googleCallback
 */
export const googleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).json({
      error: {
        "error-code": "AUTH_DENIED",
        message: "Đăng nhập thất bại (Không tìm thấy code)",
      },
    });
    return;
  }

  try {
    // 1. Đổi code lấy tokens từ Google
    const { tokens } = await getClient().getToken(code);

    // 2. Lấy thông tin user từ id_token của Google
    const ticket = (await getClient().verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    })) as any;

    const payload = ticket.getPayload() as any;
    if (!payload || !payload.email) throw new Error("Token payload invalid");

    // 3. Tìm hoặc tạo owner
    let owner = await Owner.findOne({ email: payload.email });
    if (!owner) {
      owner = await Owner.create({
        _id: new mongoose.Types.ObjectId(),
        googleId: payload.sub,
        fullName: payload.name ?? payload.given_name ?? "",
        email: payload.email,
        avatar: payload.picture ?? "",
        bankAccount: {
          bankName: "",
          accountNumber: "",
          accountName: "",
        },
      } as any);
    }

    // 4. Trả về JSON theo đúng spec
    res.status(200).json({
      access_token: generateToken(owner._id.toString()),
      token_type: "Bearer",
      expires_in: 604800,
      owner: {
        id: owner._id.toString(),
        email: owner.email,
        name: owner.fullName,
        avatar_url: owner.avatar,
        created_at: (owner as any).createdAt,
      },
    });
  } catch (error) {
    console.error("Google Callback Error:", error);
    res.status(500).json({
      error: {
        "error-code": "SERVER_CRASH",
        message: "Lỗi từ server khi xác thực với Google",
      },
    });
  }
};

/**
 * @desc    Lấy thông tin owner đang đăng nhập
 * @route   GET /api/auth/me
 * @operationId getMe
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const owner = await Owner.findById(req.user?.id);

    if (!owner) {
      res.status(401).json({ message: "Unauthorized - Owner không tồn tại" });
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
        message: "Lỗi server",
      },
    });
  }
};

/**
 * @desc    Đăng xuất
 * @route   POST /api/auth/logout
 * @operationId logout
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // Với JWT (stateless), việc logout thực chất là xóa token ở client (localStorage/cookie).
  // Ở backend, ta chỉ cần trả về thông báo thành công.
  res.status(200).json({
    message: "Thành công",
  });
};
