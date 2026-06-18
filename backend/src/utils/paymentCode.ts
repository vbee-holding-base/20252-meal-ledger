import mongoose from "mongoose";

export const encodeId = (id: string): string => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId format to encode");
  }
  return BigInt("0x" + id).toString(36);
};

const parseBase36 = (str: string): bigint => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = 0n;
  for (const char of str.toLowerCase()) {
    const value = alphabet.indexOf(char);
    if (value === -1) throw new Error("Invalid base36 character");
    result = result * 36n + BigInt(value);
  }
  return result;
};

export const decodeId = (code: string): string => {
  try {
    const hex = parseBase36(code).toString(16);
    const padded = hex.padStart(24, "0");
    return mongoose.Types.ObjectId.isValid(padded) ? padded : "";
  } catch (error) {
    return "";
  }
};

export const generatePaymentCode = (
  ownerId: string,
  participantId: string,
): string => {
  return `ML_${encodeId(ownerId)}_${encodeId(participantId)}`;
};

export const parsePaymentCode = (
  content: string,
): { ownerId: string; participantId: string } | null => {
  if (!content) return null;
  const match = content.match(/ML_([0-9a-z]+)_([0-9a-z]+)/i);
  if (!match || !match[1] || !match[2]) return null;

  const ownerId = decodeId(match[1]);
  const participantId = decodeId(match[2]);

  if (!ownerId || !participantId) return null;

  return { ownerId, participantId };
};
