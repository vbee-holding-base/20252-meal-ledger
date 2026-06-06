import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ServerError, UnauthorisedError } from "../config/errors";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(new UnauthorisedError("not authorised, no token"));

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment");
    return next(new ServerError("server configuration error"));
  }

  try {
    const decoded = (jwt.verify as any)(token, secret);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      req.user = { id: (decoded as { id: string }).id };
      return next();
    }
    return next(new UnauthorisedError("not authorised, invalid token"));
  } catch (error) {
    return next(new UnauthorisedError("not authorised, failed token"));
  }
};
