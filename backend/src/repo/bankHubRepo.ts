import Owner from "../models/ownerSchema";
import { NotFoundError } from "../config/errors";
import { findOwnerById } from "../repo/authRepo";

export const setOwnerBankAccount = async (
  ownerId: string,
  bankName: string,
  accountNumber: string,
  accountName: string,
) => {
  const owner = await Owner.findByIdAndUpdate(
    ownerId,
    { bankAccounts: [{ bankName, accountNumber, accountName }] },
    { returnDocument: "after" },
  );
  if (!owner) throw new NotFoundError("owner not found");
};

export const setAllOwnerBankAccount = async (
  ownerId: string,
  bankAccounts: Array<{
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>,
) => {
  const owner = await Owner.findByIdAndUpdate(
    ownerId,
    { bankAccounts },
    { returnDocument: "after" },
  );
  if (!owner) throw new NotFoundError("owner not found");
};

export const getOwnerXid = async (ownerId: string) => {
  const owner = await findOwnerById(ownerId);
  if (!owner) throw new NotFoundError("Owner not found");
  return owner.xid;
};
