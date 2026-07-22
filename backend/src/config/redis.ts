import { createClient, RedisClientOptions } from "redis";
import { logger } from "./logger";

const redisUrl: string = process.env.REDIS_URL || "redis://localhost:6379";

const isTLS: boolean = redisUrl.startsWith("rediss://");

const clientOptions: RedisClientOptions = {
  url: redisUrl,
};

if (isTLS) {
  clientOptions.socket = {
    tls: true,
    rejectUnauthorized: false,
  };
}

const redisClient = createClient(clientOptions);

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("error", (err: Error) => {
  //logger.error({ err }, "Redis connection error:");
});

const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    //logger.error({ error }, "Failed to connect to Redis:");
  }
};

const quitRedis = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    //logger.error({ error }, "Failed to close Redis connection:");
  }
};

export { redisClient, connectRedis, quitRedis };
