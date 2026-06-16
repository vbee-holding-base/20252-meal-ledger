import mongoose, { Schema } from "mongoose";

export interface IOwner {
  _id: mongoose.Types.ObjectId;
  googleId: string;
  fullName: string;
  email: string;
  avatar: string;
  isBankLinked: boolean;
  xid: string;
  bankAccounts?: Array<{
    xid: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>;
}

const ownerSchema = new mongoose.Schema<IOwner>(
  {
    googleId: { type: String, required: true, unique: true },
    fullName: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    isBankLinked: { type: Boolean, required: false, default: false },
    xid: { type: String, required: false },
    bankAccounts: {
      type: [
        {
          xid: { type: String, required: false },
          bankName: { type: String, required: false },
          accountNumber: { type: String, required: false },
          accountName: { type: String, required: false },
        },
      ],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Owner = mongoose.model<IOwner>("Owner", ownerSchema);
export default Owner;
