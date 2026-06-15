import mongoose from "mongoose";
import Owner from "../models/ownerSchema";
import { updateBankAccount } from "../repo/bankAccountRepo";
import { lookupBankAccount } from "./sepayService";
import { NotFoundError, ValidationError } from "../config/errors";

export const getBankAccountForOwner = async (ownerId: string) => {
  if (!mongoose.Types.ObjectId.isValid(ownerId))
    throw new NotFoundError("owner not found");
  const owner = await Owner.findById(ownerId);
  if (!owner) throw new NotFoundError("owner not found");
  return owner.bankAccount;
};

export const saveBankAccountForOwner = async (
  ownerId: string,
  bankName: string,
  accountNumber: string,
  accountName: string,
) => {
  if (!bankName || !accountNumber || !accountName)
    throw new ValidationError("please fill in all bank account fields");
  return await updateBankAccount(ownerId, bankName, accountNumber, accountName);
};

export const verifyBankAccountForOwner = async (
  bankCode: string,
  accountNumber: string,
) => {
  if (!bankCode || !accountNumber)
    throw new ValidationError(
      "please select a bank and enter an account number",
    );
  return await lookupBankAccount(bankCode, accountNumber);
};
