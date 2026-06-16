import { createClient, RedisClientOptions } from "redis";

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
  console.log("Redis connected successfully");
});

redisClient.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

const quitRedis = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    console.error("Failed to close Redis connection:", error);
  }
};

export { redisClient, connectRedis, quitRedis };
