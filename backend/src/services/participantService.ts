import {
  getAllParticipantByOwnerId,
  getAllParticipantByName,
  createParticipant,
  findParticipantByIdAndOwner,
  updateParticipant,
  deleteParticipant,
} from "../repo/participantRepo";
import { ValidationError } from "../config/errors";
import { escapeRegex } from "../validators/participantValidator";

export const readParticipantsByOwner = async (ownerId: string) => {
  return await getAllParticipantByOwnerId(ownerId);
};

export const readAllParticipants = async (participantName: string) => {
  const participantValidName = escapeRegex(participantName);
  return await getAllParticipantByName(participantValidName);
};

export const createParticipantForOwner = async (
  ownerId: string,
  participantName: string,
) => {
  return await createParticipant(ownerId, participantName);
};

export const updateParticipantForOwner = async (
  ownerId: string,
  participantId: string,
  newName: string,
) => {
  return await updateParticipant(ownerId, participantId, { name: newName });
};

export const deleteParticipantForOwner = async (
  ownerId: string,
  participantId: string,
) => {
  const participant = await findParticipantByIdAndOwner(ownerId, participantId);
  if (participant.totalDebt > 0)
    throw new ValidationError("participant with unpaid debt");
  return await deleteParticipant(ownerId, participantId);
};
