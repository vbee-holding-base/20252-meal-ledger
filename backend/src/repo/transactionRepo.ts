import mongoose from "mongoose";
import Transaction, { ITransaction } from "../models/transactionSchema";

export const findTransactionBySePayId = async (
  transactionId: string,
  session?: mongoose.ClientSession,
) => {
  return await Transaction.findOne({ transactionId }).session(session || null);
};

export const findRecentCompletedTransactionByParticipant = async (
  participantId: string,
  withinMinutes: number = 10,
) => {
  const timeThreshold = new Date(Date.now() - withinMinutes * 60 * 1000);
  return await Transaction.findOne({
    participantId,
    status: "completed",
    createdAt: { $gte: timeThreshold },
  }).sort({ createdAt: -1 });
};

export const createTransaction = async (
  data: Partial<ITransaction>,
  session?: mongoose.ClientSession,
) => {
  const transaction = new Transaction(data);
  await transaction.save(session ? { session } : {});
  return transaction;
};
