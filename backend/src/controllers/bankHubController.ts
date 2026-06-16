import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  generateBankConnectLink,
  generateBankUnconnectLink,
  updateBankAccount,
} from "../services/bankHubService";
import { ValidationError } from "../config/errors";
import { findOwnerById } from "../repo/authRepo";

export const getBankAccount = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  if (!ownerId) throw new ValidationError("OwnerID is required");

  const owner = await findOwnerById(ownerId);
  res.status(200).json(owner.bankAccounts ?? []);
};

export const generateLink = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;
  const purpose = req.body.purpose;
  const bankAccountXid = req.body.bankAccountXid ?? "";

  if (!ownerId) {
    throw new ValidationError("OwnerID is required");
  }

  if (!purpose) {
    throw new ValidationError("Purpose is required");
  }

  if (purpose === "UNLINK_BANK_ACCOUNT" && !bankAccountXid) {
    throw new ValidationError("BankAccountXid is required");
  }

  const origin =
    req.get("origin") || process.env.FRONTEND_URL || "http://localhost:5173";

  const localIndicators = ["localhost", "127.0.0.1", "192.168", "10."];
  const isLocal = localIndicators.some((indicator) =>
    origin.includes(indicator),
  );

  const redirectUri = isLocal ? null : `${origin}/more/bank-account`;

  let result: any;
  if (purpose === "LINK_BANK_ACCOUNT") {
    result = await generateBankConnectLink(ownerId, purpose, redirectUri);
  } else if (purpose === "UNLINK_BANK_ACCOUNT") {
    result = await generateBankUnconnectLink(
      ownerId,
      purpose,
      redirectUri,
      bankAccountXid,
    );
  } else {
    throw new ValidationError("Invalid purpose");
  }

  res.status(200).json({
    hosted_link_url: result.hosted_link_url,
    expires_at: result.expires_at,
  });
};

export const setBankAccount = async (req: AuthRequest, res: Response) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    throw new ValidationError("OwnerID is required");
  }

  await updateBankAccount(ownerId);

  res.status(200).json({ message: "Add Bank Account Successfully" });
};
