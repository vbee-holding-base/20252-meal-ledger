import { Request, Response } from "express";
import {
  getOwnerId,
  normaliseName,
  participantIdFromParams,
} from "../validators/participantValidator";
import {
  createParticipantForOwner,
  deleteParticipantForOwner,
  readParticipantsByOwner,
  updateParticipantForOwner,
  readAllParticipants,
} from "../services/participantService";
import { AuthRequest } from "../middlewares/auth";
import { ValidationError } from "../config/errors";

export const readParticipants = async (req: AuthRequest, res: Response) => {
  const ownerId = getOwnerId(req);
  if (!ownerId) throw new ValidationError("invalid ownerId");
  const participants = await readParticipantsByOwner(ownerId);
  res.status(200).json({ data: participants, total: participants.length });
};

export const createParticipant = async (req: AuthRequest, res: Response) => {
  const ownerId = getOwnerId(req);
  const { name } = req.body;
  const normalName = normaliseName(name);
  if (!ownerId || !normalName)
    throw new ValidationError("invalid ownerId or name");
  const createdParticipant = await createParticipantForOwner(
    ownerId,
    normalName,
  );
  res.status(201).json(createdParticipant);
};

export const updateParticipant = async (req: AuthRequest, res: Response) => {
  const ownerId = getOwnerId(req);
  const participantId = participantIdFromParams(req);
  const { name } = req.body;
  const normalName = normaliseName(name);
  if (!ownerId || !participantId || !normalName)
    throw new ValidationError("invalid ownerId, participantId, or name");
  const updatedParticipant = await updateParticipantForOwner(
    ownerId,
    participantId,
    normalName,
  );
  res.status(200).json({ updatedParticipant });
};

export const deleteParticipant = async (req: AuthRequest, res: Response) => {
  const ownerId = getOwnerId(req);
  const participantId = participantIdFromParams(req);
  if (!ownerId || !participantId)
    throw new ValidationError("invalid ownerId or participantId");
  await deleteParticipantForOwner(ownerId, participantId);
  res.status(200).json({ message: "successfully deleted participant" });
};

export const readParticipantsPublic = async (req: Request, res: Response) => {
  const participantName = req.query.q as string;
  if (!participantName || participantName.trim() === "") {
    res.status(200).json([]);
    return;
  }
  const participants = await readAllParticipants(participantName);
  res.status(200).json({ data: participants, total: participants.length });
};
