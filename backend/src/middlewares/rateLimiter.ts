import { Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { AuthRequest } from "./auth";

export const rateLimiter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const now = Date.now();
    const windowMs = 60 * 1000;

    // 1. Server Rate Limit (Fixed Window): 5 req / min
    const serverLimit = 5;
    const currentMinute = Math.floor(now / windowMs);
    const serverKey = `rate_limit:server:add_meal:${currentMinute}`;

    const serverMulti = redisClient.multi();
    serverMulti.incr(serverKey);
    serverMulti.expire(serverKey, 60);
    const serverResult = await serverMulti.exec();

    // serverResult[0] is the result of INCR
    const serverRequestsCount = Number(serverResult[0]);

    if (serverRequestsCount > serverLimit) {
      const retryAfter = 60 - Math.floor((now % windowMs) / 1000);
      res.setHeader("X-RateLimit-Limit", serverLimit);
      res.setHeader("X-RateLimit-Remaining", 0);
      res.setHeader("Retry-After", retryAfter);

      // We must return here to prevent further execution
      res.status(429).json({
        message: "Server rate limit exceeded. Please try again later.",
        retryAfter,
      });
      return;
    }

    // 2. Client Rate Limit (Rolling Window): 3 req / min per user
    if (userId) {
      const clientLimit = 3;
      const clientKey = `rate_limit:client:${userId}`;
      const minTimestamp = now - windowMs;

      const clientMulti = redisClient.multi();
      // Remove elements older than 1 minute
      clientMulti.zRemRangeByScore(clientKey, 0, minTimestamp);
      // Add current request
      clientMulti.zAdd(clientKey, {
        score: now,
        value: `${now}-${Math.random()}`,
      });
      // Count total elements in the window
      clientMulti.zCard(clientKey);
      // Fetch the oldest element to calculate exact retryAfter
      clientMulti.zRange(clientKey, 0, 0);
      // Set expiry on the set to clean up inactive users
      clientMulti.expire(clientKey, 60);

      const clientResult = await clientMulti.exec();
      const clientRequestsCount = Number(clientResult[2]); // Result of zCard
      const oldestReqArray = clientResult[3] as unknown as string[]; // Result of zRange

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

        // Ensure retryAfter is at least 1 second
        retryAfter = Math.max(1, retryAfter);

        res.setHeader("X-RateLimit-Limit", clientLimit);
        res.setHeader("X-RateLimit-Remaining", 0);
        res.setHeader("Retry-After", retryAfter);

        res.status(429).json({
          message: "Client rate limit exceeded. Please wait.",
          retryAfter,
        });
        return;
      }

      // If allowed, set the successful headers
      res.setHeader("X-RateLimit-Limit", clientLimit);
      res.setHeader("X-RateLimit-Remaining", remaining);
    }

    next();
  } catch (error) {
    console.error("Rate limiter error", error);
    // Fail open if Redis fails, to prevent bringing down the whole app
    next();
  }
};
