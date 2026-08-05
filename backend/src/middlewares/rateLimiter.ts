import { Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { AuthRequest } from "./auth";
import { logger } from "../config/logger";

export interface RateLimiterOptions {
  clientLimit: number;
  serverLimit: number;
  keyPrefix: string; // phân biệt endpoint
}

interface TokenBucketResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])

local bucket = redis.call("HMGET", key, "tokens", "updatedAt")
local tokens = tonumber(bucket[1])
local updatedAt = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  updatedAt = now
end

local elapsed = math.max(0, now - updatedAt)
local refill = elapsed * refillRate
tokens = math.min(capacity, tokens + refill)

local allowed = 0
local retryAfter = 0

if tokens >= 1 then
  tokens = tokens - 1
  allowed = 1
else
  retryAfter = math.ceil((1 - tokens) / refillRate)
end

redis.call("HSET", key, "tokens", tokens, "updatedAt", now)
redis.call("EXPIRE", key, ttl)

return { allowed, math.floor(tokens), retryAfter }
`;

const consumeToken = async (
  key: string,
  capacity: number,
): Promise<TokenBucketResult> => {
  const windowSeconds = 60; // used for setting how much tokens can be refilled per second
  const refillRate = capacity / windowSeconds;
  const now = Date.now() / 1000;
  const ttl = windowSeconds * 2;

  const result = (await redisClient.eval(TOKEN_BUCKET_SCRIPT, {
    keys: [key],
    arguments: [String(capacity), String(refillRate), String(now), String(ttl)],
  })) as number[];

  return {
    allowed: result[0] === 1,
    remaining: result[1] ?? 0,
    retryAfter: Math.max(1, result[2] ?? 1),
  };
};

export const createRateLimiter = (options: RateLimiterOptions) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const identifier = req.user?.id || req.ip || "unknown";

      const serverKey = `rate_limit:server:${options.keyPrefix}`;
      const serverBucket = await consumeToken(serverKey, options.serverLimit);

      if (!serverBucket.allowed) {
        res.setHeader("X-RateLimit-Limit", String(options.serverLimit));
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("Retry-After", String(serverBucket.retryAfter));

        res.status(429).json({
          message: "Server rate limit exceeded. Please try again later.",
          retryAfter: serverBucket.retryAfter,
        });
        return;
      }

      const clientKey = `rate_limit:client:${options.keyPrefix}:${identifier}`;
      const clientBucket = await consumeToken(clientKey, options.clientLimit);

      if (!clientBucket.allowed) {
        res.setHeader("X-RateLimit-Limit", String(options.clientLimit));
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("Retry-After", String(clientBucket.retryAfter));

        res.status(429).json({
          message: "Client rate limit exceeded. Please wait.",
          retryAfter: clientBucket.retryAfter,
        });
        return;
      }

      res.setHeader("X-RateLimit-Limit", String(options.clientLimit));
      res.setHeader("X-RateLimit-Remaining", String(clientBucket.remaining));

      next();
    } catch (error) {
      logger.error(error, "Rate limiter error");
      next();
    }
  };
};
