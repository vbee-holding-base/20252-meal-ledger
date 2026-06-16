import Owner from "../models/ownerSchema";
import mongoose from "mongoose";
import { NotFoundError, ValidationError } from "../config/errors";

export const findOwnerByEmail = async (email: string) => {
  return await Owner.findOne({ email });
};
export const findOwnerById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new NotFoundError("Owner not found");
  const owner = await Owner.findById(id);
  if (!owner) throw new NotFoundError("Owner not found");
  return owner;
};
export const createOwner = async (
  googleId: string,
  fullName: string,
  email: string,
  avatar: string,
) => {
  const newOwner = new Owner({
    _id: new mongoose.Types.ObjectId(),
    googleId: googleId,
    fullName: fullName,
    email: email,
    avatar: avatar,
    bankAccounts: [],
  });
  return await newOwner.save();
};

export const getOwnerNameById = async (id: string): Promise<string> => {
  const owner = await findOwnerById(id);
  return owner.fullName;
};

export const setOwnerXid = async (id: string, xid: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ValidationError("OwnerId Unvalid");

  const owner = await Owner.findByIdAndUpdate(
    id,
    { xid: xid },
    { returnDocument: "after" },
  );

  if (!owner) throw new NotFoundError("Owner not found");
};

export const setBankAccount = async (
  id: string,
  bankName: string,
  accountNumber: string,
  accountName: string,
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ValidationError("OwnerId Unvalid");

  const owner = await Owner.findByIdAndUpdate(
    id,
    {
      isBankLinked: true,
      bankAccounts: [
        {
          bankName: bankName,
          accountNumber: accountNumber,
          accountName: accountName,
        },
      ],
    },
    { returnDocument: "after" },
  );
  if (!owner) throw new NotFoundError("Owner not found");
};
