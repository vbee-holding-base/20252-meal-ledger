import mongoose, { Schema } from "mongoose";

export interface IOwner {
  _id: mongoose.Types.ObjectId;
  googleId: string;
  fullName: string;
  email: string;
  avatar: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const ownerSchema = new mongoose.Schema<IOwner>(
  {
    googleId: { type: String, required: true, unique: true },
    fullName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    bankAccount: {
      bankName: { type: String, required: false },
      accountNumber: { type: String, required: false },
      accountName: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  },
);

const Owner = mongoose.model<IOwner>("Owner", ownerSchema);
export default Owner;
