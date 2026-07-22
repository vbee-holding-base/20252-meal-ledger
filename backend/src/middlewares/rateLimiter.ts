import { Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { AuthRequest } from "./auth";
import { logger } from "../config/logger";

export interface RateLimiterOptions {
  clientLimit: number;
  serverLimit: number;
  keyPrefix: string;
}

export const createRateLimiter = (options: RateLimiterOptions) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Use user ID if authenticated, fallback to IP address for public endpoints
      const identifier = req.user?.id || req.ip || "unknown";
      const now = Date.now();
      const windowMs = 60 * 1000;

      // 1. Server Rate Limit (Fixed Window)
      const serverLimit = options.serverLimit;
      const currentMinute = Math.floor(now / windowMs);
      const serverKey = `rate_limit:server:${options.keyPrefix}:${currentMinute}`;

      const serverMulti = redisClient.multi();
      serverMulti.incr(serverKey);
      serverMulti.expire(serverKey, 60);
      const serverResult = await serverMulti.exec();

      const serverRequestsCount = Number(serverResult[0]);

      if (serverRequestsCount > serverLimit) {
        const retryAfter = 60 - Math.floor((now % windowMs) / 1000);
        res.setHeader("X-RateLimit-Limit", String(serverLimit));
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("Retry-After", String(retryAfter));

        res.status(429).json({
          message: "Server rate limit exceeded. Please try again later.",
          retryAfter,
        });
        return;
      }

      // 2. Client Rate Limit (Rolling Window)
      if (identifier) {
        const clientLimit = options.clientLimit;
        const clientKey = `rate_limit:client:${options.keyPrefix}:${identifier}`;
        const minTimestamp = now - windowMs;

        const clientMulti = redisClient.multi();
        clientMulti.zRemRangeByScore(clientKey, 0, minTimestamp);
        // Pass array of objects for better compatibility
        clientMulti.zAdd(clientKey, [
          {
            score: now,
            value: `${now}-${Math.random()}`,
          },
        ]);
        clientMulti.zCard(clientKey);
        clientMulti.zRange(clientKey, 0, 0);
        clientMulti.expire(clientKey, 60);

        const clientResult = await clientMulti.exec();
        const clientRequestsCount = Number(clientResult[2]);
        const oldestReqArray = clientResult[3] as unknown as string[];

        const remaining = Math.max(0, clientLimit - clientRequestsCount);

        if (clientRequestsCount > clientLimit) {
          let retryAfter = 60;
          if (oldestReqArray && oldestReqArray.length > 0) {
            const firstReq = oldestReqArray[0];
            if (firstReq) {
              const oldestTime = parseFloat(firstReq.split("-")[0] || "0");
              retryAfter = Math.ceil((oldestTime + windowMs - now) / 1000);
            }
          }

          retryAfter = Math.max(1, retryAfter);

          res.setHeader("X-RateLimit-Limit", String(clientLimit));
          res.setHeader("X-RateLimit-Remaining", "0");
          res.setHeader("Retry-After", String(retryAfter));

          res.status(429).json({
            message: "Client rate limit exceeded. Please wait.",
            retryAfter,
          });
          return;
        }

        res.setHeader("X-RateLimit-Limit", String(clientLimit));
        res.setHeader("X-RateLimit-Remaining", String(remaining));
      }

      next();
    } catch (error) {
      logger.error(error, "Rate limiter error");
      next();
    }
  };
};
