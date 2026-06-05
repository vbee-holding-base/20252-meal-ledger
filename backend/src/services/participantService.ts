import Participant from "../models/participantSchema";

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
  if (existingParticipant) return;
  return await Participant.create({
    ownerId,
    name: participantName,
    totalDebt: 0,
    status: "active",
  });
};

export const updateParticipantForOwner = async (
  ownerId: string,
  participantId: string | string[],
  newName: string,
) => {
  const existingName = await Participant.findOne({
    ownerId,
    _id: { $ne: participantId },
    name: newName,
  });
  if (existingName) return;
  return await Participant.findOneAndUpdate(
    { ownerId, _id: participantId },
    { name: newName },
    { returnDocument: "after" },
  );
};

export const deleteParticipantForOwner = async (
  ownerId: string,
  participantId: string | string[],
) => {
  const participant = await Participant.findOne({
    ownerId,
    _id: participantId,
  });
  if (!participant) return;
  if (participant.totalDebt > 0) return;
  return await Participant.deleteOne({ ownerId, _id: participantId });
};
