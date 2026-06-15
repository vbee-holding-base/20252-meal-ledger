import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  getBankAccountForOwner,
  saveBankAccountForOwner,
  verifyBankAccountForOwner,
} from "../services/bankAccountService";
import { ValidationError } from "../config/errors";

export const getBankAccount = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) throw new ValidationError("invalid owner id");

  const account = await getBankAccountForOwner(ownerId);
  res.status(200).json(account);
};

export const saveBankAccount = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) throw new ValidationError("invalid owner id");

  const { bankName, accountNumber, accountName } = req.body;
  const account = await saveBankAccountForOwner(
    ownerId,
    bankName,
    accountNumber,
    accountName,
  );
  res.status(200).json(account);
};

export const verifyBankAccount = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) throw new ValidationError("invalid owner id");

  const { bankCode, accountNumber } = req.body;
  const result = await verifyBankAccountForOwner(bankCode, accountNumber);
  res.status(200).json(result);
};
