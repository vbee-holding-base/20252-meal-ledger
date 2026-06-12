import { Response, Request } from "express";
import { getDetailDebt, checkParticipant } from "../services/debtService";

// GET /api/v1/debts/:id

export const getDetailDebts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const participantId = req.params.id;
  const participant = await checkParticipant(participantId as string);
  const historyDebts = await getDetailDebt(participantId as string);
  res.status(200).json({
    participant: participant,
    history: historyDebts,
  });
};

// GET /api/v1/debts/public/:id
export const getDetailDebtsPublic = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const participantId = req.params.id;
  const participant = await checkParticipant(participantId as string);
  const historyDebts = await getDetailDebt(participantId as string);
  res.status(200).json({
    participant: participant,
    history: historyDebts,
  });
};
