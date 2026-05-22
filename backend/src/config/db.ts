import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb+srv://nhatminhnt06_db_user:ceeuSajOxHRYz3Lb@cluster0.bgazxry.mongodb.net/test?appName=Cluster0");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
connectDB();
export default connectDB;
