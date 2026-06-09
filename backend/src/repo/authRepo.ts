import Owner from "../models/ownerSchema";
import mongoose from "mongoose";
import { NotFoundError } from "../config/errors";

export const findOwnerByEmail = async (email: string) => {
  return await Owner.findOne({ email });
};
export const findOwnerById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
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
    bankAccount: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });
  return await newOwner.save();
};
