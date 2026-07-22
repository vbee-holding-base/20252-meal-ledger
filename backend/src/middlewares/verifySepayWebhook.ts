import { Request, Response, NextFunction } from "express";
import { UnauthorisedError } from "../config/errors";
import { logger } from "../config/logger";

export const verifySepayWebhook = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn("[SePay Webhook] missing Authorization header");
    throw new UnauthorisedError("Missing Authorization header");
  }

  const parts = authHeader.split(" ");
  const prefix = parts[0];
  const apiKey = parts[1];

  if (
    parts.length !== 2 ||
    !prefix ||
    !apiKey ||
    prefix.toLowerCase() !== "apikey"
  ) {
    throw new UnauthorisedError(
      "Invalid Authorization header format. Expected 'Apikey <key>'",
    );
  }
  const expectedApiKey = process.env.SEPAY_NOTIFY_API_KEY;

  if (!expectedApiKey) {
    logger.error(
      "SEPAY_NOTIFY_API_KEY is not defined in environment variables",
    );
    throw new UnauthorisedError("Server configuration error");
  }

  if (apiKey !== expectedApiKey) {
    throw new UnauthorisedError("Invalid API Key");
  }

  next();
};
