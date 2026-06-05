import mongoose from "mongoose";
import dns from "dns";

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not defined in environment");
    process.exit(1);
  }

  try {
    // Sửa lỗi querySrv ECONNREFUSED của MongoDB Atlas
    dns.setServers(["8.8.8.8", "8.8.4.4"]);

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      family: 4, // Ép dùng IPv4
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
