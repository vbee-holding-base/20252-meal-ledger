import mongoose from "mongoose";
import dns from "dns";
import { logger } from "./logger";

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    logger.error("MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    // Sửa lỗi querySrv ECONNREFUSED của MongoDB Atlas
    dns.setServers(["8.8.8.8", "8.8.4.4"]);

    logger.info("connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      family: 4, // Ép dùng IPv4
    });
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error({ error }, "Error connecting to MongoDB:");
    process.exit(1);
  }
};

export default connectDB;
