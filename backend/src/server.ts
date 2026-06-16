import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";

const PORT = process.env.PORT ?? 3001;

connectDB()
  .then(() => {
    connectRedis();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
