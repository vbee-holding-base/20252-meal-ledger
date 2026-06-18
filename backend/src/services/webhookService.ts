import {
  findTransactionBySePayId,
  createTransaction,
} from "../repo/transactionRepo";
import { findParticipantByIdAndOwner } from "../repo/participantRepo";
import { findUnpaidMealsByParticipant } from "../repo/debtRepo";
import { parsePaymentCode } from "../utils/paymentCode";
import { findOwnerById } from "../repo/authRepo";
import { ValidationError } from "../config/errors";
import mongoose from "mongoose";

interface SePayWebhookPayload {
  gateway: string;
  transaction_date: string;
  account_number: string;
  bank_account_xid: string;
  va: string | null;
  payment_code: string | null;
  content: string;
  transfer_type: "credit" | "debit";
  amount: number;
  reference_code: string;
  accumulated: number;
  transaction_id: string;
}

export const processSepayWebhook = async (payload: SePayWebhookPayload) => {
  const {
    transaction_id: transactionId,
    content,
    amount,
    transfer_type: transferType,
    transaction_date: transactionDateStr,
    reference_code: referenceCode,
    gateway,
    account_number: accountNumber,
    bank_account_xid: bankAccountXid,
    accumulated,
  } = payload;

  console.log(`Processing transaction: ${transactionId}, amount: ${amount}`);

  const existingTx = await findTransactionBySePayId(transactionId);
  if (existingTx) {
    console.log(`Transaction ${transactionId} has already been processed.`);
    return {
      success: true,
      duplicate: true,
      message: "Transaction already processed",
    };
  }

  if (transferType !== "credit") {
    console.log(
      `Transaction ${transactionId} is not a credit transaction. Ignored.`,
    );
    return {
      success: true,
      ignored: true,
      message: "Non-credit transaction ignored",
    };
  }

  const ids = parsePaymentCode(content);
  if (!ids) {
    console.warn(
      `Content "${content}" does not match payment code pattern. Ignored.`,
    );
    return {
      success: false,
      message: "Invalid payment code format in content",
    };
  }

  const { ownerId, participantId } = ids;

  try {
    const owner = await findOwnerById(ownerId);
    if (!owner) {
      throw new ValidationError("Owner not found from decoded payment code");
    }

    const participant = await findParticipantByIdAndOwner(
      ownerId,
      participantId,
    );
    if (!participant) {
      throw new ValidationError(
        "Participant not found from decoded payment code",
      );
    }

    const unpaidMeals = await findUnpaidMealsByParticipant(participantId);
    let remainingPayment = amount;

    for (const meal of unpaidMeals) {
      if (remainingPayment <= 0) break;

      const pInfo = meal.participantsInfo.find(
        (p) => p.participantId.toString() === participantId,
      );

      if (
        pInfo &&
        (pInfo.status === "unpaid" || pInfo.status === "uncomplete")
      ) {
        if (remainingPayment >= pInfo.amount) {
          pInfo.status = "paid";
          remainingPayment -= pInfo.amount;
          await meal.save();
          console.log(
            `Marked meal ${meal._id} as paid for participant ${participant.name}`,
          );
        } else {
          pInfo.status = "uncomplete";
          pInfo.amount -= remainingPayment;
          remainingPayment = 0;
          await meal.save();
          console.log(
            `Marked meal ${meal._id} as uncomplete for participant ${participant.name}`,
          );
        }
      }
    }

    participant.totalDebt = Math.max(0, participant.totalDebt - amount);
    await participant.save();
    console.log(
      `Decreased totalDebt for ${participant.name} to ${participant.totalDebt}`,
    );

    const parsedDate = new Date(transactionDateStr.replace(" ", "T"));

    const newTx = await createTransaction({
      ownerId: new mongoose.Types.ObjectId(ownerId),
      participantId: new mongoose.Types.ObjectId(participantId),
      amount,
      transferDescription: content,
      status: "completed",
      date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
      transactionId,
      referenceCode,
      gateway,
      accountNumber,
      bankAccountXid,
      transferType,
      content,
      accumulated,
    });

    console.log(
      `Successfully logged transaction ${newTx._id} for transaction ID: ${transactionId}`,
    );
    return { success: true, transaction: newTx };
  } catch (error: any) {
    console.error(
      `Error processing transaction ${transactionId}:`,
      error.message,
    );
    return { success: false, message: error.message };
  }
};
