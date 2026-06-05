import { Response, Request } from "express";
import { getDetailDebt, checkParticipant } from "../services/debtService";

// GET /api/debts/:id

export const getDetailDebts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const participantId = req.params.id;
  try {
    const participant = await checkParticipant(participantId as string);
    const historyDebts = await getDetailDebt(participantId as string);
    res.status(200).json({
      participant: participant,
      history: historyDebts,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
