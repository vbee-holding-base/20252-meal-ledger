import mongoose, { Schema } from "mongoose";

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  participantId: mongoose.Types.ObjectId;
  amount: number;
  transferDescription: string;
  status: string;
  date: Date;
  transactionId?: string;
  referenceCode?: string;
  gateway?: string;
  accountNumber?: string;
  bankAccountXid?: string;
  transferType?: string;
  content?: string;
  accumulated?: number;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
    participantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Participant",
    },
    amount: { type: Number, required: true },
    transferDescription: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    transactionId: { type: String, unique: true, sparse: true, index: true },
    referenceCode: { type: String },
    gateway: { type: String },
    accountNumber: { type: String },
    bankAccountXid: { type: String },
    transferType: { type: String },
    content: { type: String },
    accumulated: { type: Number },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
);
export default Transaction;
