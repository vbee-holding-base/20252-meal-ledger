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
  updateOwnerXid,
} from "../services/authService";
import {
  createCompanyOwner,
  updateCompanyOwnerTransactionAmount,
} from "../services/bankHubService";
import { UnauthorisedError } from "../config/errors";

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
    const ownerId = owner._id.toString();
    const accessToken = generateAccessToken(ownerId);
    const refreshToken = generateRefreshToken(ownerId);

    if (!owner.xid) {
      const createCompany = await createCompanyOwner(ownerId);
      const xid = createCompany?.data?.xid;
      if (xid) {
        await updateOwnerXid(ownerId, xid);
        await updateCompanyOwnerTransactionAmount(xid);
      }
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    redirectToFrontend(res, {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: "900000",
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
  const owner = await getMyInfo(req.user?.id || "");
  res.status(200).json(owner);
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
  if (!token) throw new UnauthorisedError("no refresh token found");
  const accessToken = await regenerateAccessToken(token);
  res.status(200).json({ access_token: accessToken });
};
