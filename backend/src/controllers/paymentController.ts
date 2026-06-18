import { Request, Response } from "express";
import { ValidationError, ExternalError } from "../config/errors";
import {
  getPaymentInfoService,
  checkPaymentStatusService,
} from "../services/paymentService";

export const getPaymentInfo = async (req: Request, res: Response) => {
  const { participantId } = req.params as { participantId?: string };
  if (!participantId) {
    throw new ValidationError("participantId is required");
  }
  const paymentInfo = await getPaymentInfoService(participantId);
  if (!paymentInfo)
    throw new ExternalError("Error retrieving payment information");
  res.status(200).json(paymentInfo);
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  const { participantId } = req.params as { participantId?: string };
  if (!participantId) {
    throw new ValidationError("participantId is required");
  }
  const status = await checkPaymentStatusService(participantId);
  res.status(200).json(status);
};
