import {
  findTransactionBySePayId,
  createTransaction,
} from "../repo/transactionRepo";
import { findParticipantByIdAndOwner } from "../repo/participantRepo";
import { findUnpaidMealsByParticipant } from "../repo/debtRepo";
import { parsePaymentCode } from "../utils/paymentCode";
import { findOwnerById } from "../repo/authRepo";
import { ValidationError, NotFoundError } from "../config/errors";
import mongoose from "mongoose";
import { logger } from "../config/logger";

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

  logger.info(`Processing transaction: ${transactionId}, amount: ${amount}`);

  const session = await mongoose.startSession();
  try {
    let result: any = null;

    await session.withTransaction(async () => {
      const existingTx = await findTransactionBySePayId(transactionId, session);
      if (existingTx) {
        logger.info(`Transaction ${transactionId} has already been processed.`);
        result = {
          success: true,
          duplicate: true,
          message: "Transaction already processed",
        };
        return;
      }

      if (transferType !== "credit") {
        logger.info(
          `Transaction ${transactionId} is not a credit transaction. Ignored.`,
        );
        result = {
          success: true,
          ignored: true,
          message: "Non-credit transaction ignored",
        };
        return;
      }

      const ids = parsePaymentCode(content);
      if (!ids) {
        logger.warn(
          `Content "${content}" does not match payment code pattern. Ignored.`,
        );
        result = {
          success: false,
          isValidationError: true,
          message: "Invalid payment code format in content",
        };
        return;
      }

      const { ownerId, participantId } = ids;

      const owner = await findOwnerById(ownerId);
      if (!owner) {
        throw new ValidationError("Owner not found from decoded payment code");
      }

      const participant = await findParticipantByIdAndOwner(
        ownerId,
        participantId,
        session,
      );

      const unpaidMeals = await findUnpaidMealsByParticipant(
        participantId,
        session,
      );
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
            await meal.save({ session });
            logger.info(
              `Marked meal ${meal._id} as paid for participant ${participant.name}`,
            );
          } else {
            pInfo.status = "uncomplete";
            pInfo.amount -= remainingPayment;
            remainingPayment = 0;
            await meal.save({ session });
            logger.info(
              `Marked meal ${meal._id} as uncomplete for participant ${participant.name}`,
            );
          }
        }
      }

      participant.totalDebt = Math.max(0, participant.totalDebt - amount);
      await participant.save({ session });
      logger.info(
        `Decreased totalDebt for ${participant.name} to ${participant.totalDebt}`,
      );

      const parsedDate = new Date(transactionDateStr.replace(" ", "T"));

      const newTx = await createTransaction(
        {
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
        },
        session,
      );

      logger.info(
        `Successfully logged transaction ${newTx._id} for transaction ID: ${transactionId}`,
      );
      result = { success: true, transaction: newTx };
    });

    return result;
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      logger.warn(
        `Validation failed for transaction ${transactionId}: ${error.message}`,
      );
      return {
        success: false,
        isValidationError: true,
        message: error.message,
      };
    }
    logger.error(
      `Unexpected error processing transaction ${transactionId}:`,
      error,
    );
    throw error;
  } finally {
    session.endSession();
  }
};
