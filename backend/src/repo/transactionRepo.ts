import Transaction, { ITransaction } from "../models/transactionSchema";

export const findTransactionBySePayId = async (transactionId: string) => {
  return await Transaction.findOne({ transactionId });
};

export const createTransaction = async (data: Partial<ITransaction>) => {
  return await Transaction.create(data);
};
