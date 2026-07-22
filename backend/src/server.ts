import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import { logger } from "./config/logger";

const PORT = process.env.PORT ?? 3001;

connectDB()
  .then(() => {
    connectRedis();
  })
  .then(() => {
    app.listen(PORT, () => logger.info({ port: PORT }, "server running"));
  });
