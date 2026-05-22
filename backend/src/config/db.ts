import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not defined in backend/.env");
    process.exit(1);
  }

  try {
    const dnsServers = process.env.DNS_SERVERS?.split(",")
      .map((server) => server.trim())
      .filter(Boolean);
    if (dnsServers?.length) {
      dns.setServers(dnsServers);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
