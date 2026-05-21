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
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true },
    bankAccount: {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      accountName: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

const Owner = mongoose.model<IOwner>("Owner", ownerSchema);
export default Owner;
