import Participant from "../models/participantSchema";
import {
  DuplicateError,
  NotFoundError,
  ValidationError,
} from "../config/errors";

export const readParticipantsByOwner = async (ownerId: string) => {
  return await Participant.find({ ownerId });
};

export const createParticipantForOwner = async (
  ownerId: string,
  participantName: string,
) => {
  const existingParticipant = await Participant.findOne({
    ownerId,
    name: participantName,
  });
  if (existingParticipant)
    throw new DuplicateError("existing participant name");
  return await Participant.create({
    ownerId,
    name: participantName,
    totalDebt: 0,
    status: "active",
  });
};

export const updateParticipantForOwner = async (
  ownerId: string,
  participantId: string,
  newName: string,
) => {
  const existingName = await Participant.findOne({
    ownerId,
    _id: { $ne: participantId },
    name: newName,
  });
  if (existingName)
    throw new DuplicateError("existing name for another participant");
  const updatedParticipant = await Participant.findOneAndUpdate(
    { ownerId, _id: participantId },
    { name: newName },
    { returnDocument: "after" },
  );
  if (!updatedParticipant) throw new NotFoundError("unexisting participant");
  return updatedParticipant;
};

export const deleteParticipantForOwner = async (
  ownerId: string,
  participantId: string,
) => {
  const participant = await Participant.findOne({
    ownerId,
    _id: participantId,
  });
  if (!participant) throw new NotFoundError("unexisting participant");
  if (participant.totalDebt > 0)
    throw new ValidationError("participant with unpaid debt");
  return await Participant.deleteOne({ ownerId, _id: participantId });
};
