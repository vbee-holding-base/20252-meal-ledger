import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  generateAuthorizeUrl,
  generateAccessToken,
  generateRefreshToken,
  redirectToFrontend,
  getClientTicket,
  findOrCreateOwner,
  getMyInfo,
  regenerateAccessToken,
} from "../services/authService";

// GET /api/auth/google
export const initiateGoogleLogin = (req: Request, res: Response): void => {
  const authorizeUrl = generateAuthorizeUrl();
  res.redirect(302, authorizeUrl);
};

// GET /api/auth/google/callback
export const googleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    redirectToFrontend(res, { error: "Auth denied" });
    return;
  }
  try {
    const ticket = await getClientTicket(code);
    const owner = await findOrCreateOwner(ticket);

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
    redirectToFrontend(res, { error: "Server error" });
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const owner = await getMyInfo(req.user?.id || "");
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json(error);
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
    message: "Logout successful",
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
    regenerateAccessToken(token).then((accessToken) => {
      res.status(200).json({
        access_token: accessToken,
      });
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
