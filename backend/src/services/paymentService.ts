import { findParticipantById } from "../repo/participantRepo";
import { findBankInfoByOwnerId } from "../repo/paymentRepo";
import { generatePaymentCode } from "../utils/paymentCode";
import { findRecentCompletedTransactionByParticipant } from "../repo/transactionRepo";

export const getPaymentInfoService = async (participantId: string) => {
  const participantInfo = await findParticipantById(participantId);
  const ownerId = participantInfo.ownerId?.toString();
  const ownerBankInfo = await findBankInfoByOwnerId(ownerId as string);
  const bankAccount = ownerBankInfo?.[0] ?? null;
  let paymentCode: string | null = null;
  try {
    if (ownerId) {
      paymentCode = generatePaymentCode(ownerId, participantId);
    }
  } catch (err) {
    paymentCode = null;
  }

  return {
    ownerId: ownerId,
    participantId: participantId,
    bankAccount: bankAccount,
    amount: participantInfo.totalDebt,
    paymentCode,
  };
};

export const checkPaymentStatusService = async (participantId: string) => {
  const transaction =
    await findRecentCompletedTransactionByParticipant(participantId);
  return {
    isPaid: !!transaction,
    transaction: transaction
      ? {
          _id: transaction._id,
          amount: transaction.amount,
          date: transaction.date,
          status: transaction.status,
        }
      : null,
  };
};
