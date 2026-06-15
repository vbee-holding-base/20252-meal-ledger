import Owner from "../models/ownerSchema";
import { NotFoundError } from "../config/errors";

export const updateBankAccount = async (
  ownerId: string,
  bankName: string,
  accountNumber: string,
  accountName: string,
) => {
  const owner = await Owner.findByIdAndUpdate(
    ownerId,
    { bankAccount: { bankName, accountNumber, accountName } },
    { returnDocument: "after" },
  );
  if (!owner) throw new NotFoundError("owner not found");
  return owner.bankAccount;
};
