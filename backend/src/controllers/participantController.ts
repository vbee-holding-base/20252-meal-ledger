import { Request, Response } from "express";
import Participant from "../models/participantSchema";
import { normaliseName } from "../validators/participantValidator";
import {
  createParticipantForOwner,
  deleteParticipantForOwner,
  readParticipantsByOwner,
  updateParticipantForOwner,
} from "../services/participantService";

export const readParticipants = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId)
      return res
        .status(400)
        .json({ error: "VALIDATION_ERROR", message: "invalid ownerId" });
    const participants = await readParticipantsByOwner(ownerId);
    return res
      .status(200)
      .json({ data: participants, total: participants.length });
  } catch (err) {
    console.error("Error reading participant:", err);
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "participant operation failed" });
  }
};

export const createParticipant = async (req: Request, res: Response) => {
  try {
    const { name, ownerId } = req.body;
    const normalName = normaliseName(name);
    if (!ownerId || !normalName) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "invalid ownerId or name",
      });
    }
    const createdParticipant = await createParticipantForOwner(
      ownerId,
      normalName,
    );
    if (!createdParticipant) return;
    res.status(409).json({
      error: "DUPLICATE_NAME",
      message: "existing participant name",
    });
    res.status(201).json(createdParticipant);
  } catch (err) {
    console.error("Error creating participant:", err);
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "participant operation failed" });
  }
};

export const updateParticipant = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.params;
    const { name, ownerId } = req.body;
    const normalName = normaliseName(name);
    if (!ownerId || !participantId || !normalName)
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "invalid ownerId, participantId, or name",
      });
    const updatedParticipant = await updateParticipantForOwner(
      ownerId,
      participantId,
      normalName,
    );
    if (!updatedParticipant) return;
    res.status(409).json({
      error: "VALIDATION_ERROR",
      message: "existing participant name",
    });
    return res.status(200).json({ updatedParticipant });
  } catch (err) {
    console.error("Error updating participant:", err);
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "participant operation failed" });
  }
};

export const deleteParticipant = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.params;
    const { ownerId } = req.body;
    if (!ownerId || !participantId)
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "invalid ownerId or participantId",
      });
    const deletedParticipant = await deleteParticipantForOwner(
      ownerId,
      participantId,
    );
    if (!deletedParticipant)
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "unexisted participant" });
    return res
      .status(200)
      .json({ message: "successfully deleted participant" });
  } catch (err) {
    console.error("Error deleting participant:", err);
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "participant operation failed" });
  }
};
