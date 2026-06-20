import Owner from "../models/ownerSchema";
import { NotFoundError } from "../config/errors";

export const findBankInfoByOwnerId = async (ownerId: string) => {
  const owner = await Owner.findById(ownerId);
  if (!owner) throw new NotFoundError("owner not found");
  return owner.bankAccounts;
};
