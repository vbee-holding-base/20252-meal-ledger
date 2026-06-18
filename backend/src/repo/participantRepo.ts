import mongoose from "mongoose";
import Participant from "../models/participantSchema";
import { DuplicateError, NotFoundError } from "../config/errors";

export const getAllParticipantByOwnerId = async (ownerId: string) => {
  return await Participant.find({ ownerId });
};

export const createParticipant = async (
  ownerId: string,
  participantName: string,
) => {
  const existing = await Participant.findOne({
    ownerId,
    name: participantName,
  });
  if (existing) {
    throw new DuplicateError("existing participant name");
  }
  return Participant.create({
    ownerId: ownerId,
    name: participantName,
    totalDebt: 0,
    status: "active",
  });
};

export const getAllParticipantByName = async (name: string) => {
  return await Participant.find({
    name: {
      $regex: name,
      $options: "i",
    },
  }).limit(10);
};

export const findParticipant = async (
  ownerId: string,
  participantName: string,
) => {
  return await Participant.findOne({ ownerId: ownerId, name: participantName });
};

export const findParticipantById = async (participantId: string) => {
  const participant = await Participant.findById(participantId);
  if (!participant) {
    throw new NotFoundError("Participant not found");
  }
  return participant;
};

export const findParticipantByIdAndOwner = async (
  ownerId: string,
  participantId: string,
  session?: mongoose.ClientSession,
) => {
  const participant = await Participant.findOne({
    ownerId,
    _id: participantId,
  }).session(session || null);
  if (!participant) {
    throw new NotFoundError("unexisting participant");
  }
  return participant;
};

export const findOtherParticipantByName = async (
  ownerId: string,
  participantId: string,
  name: string,
) => {
  return await Participant.findOne({
    ownerId,
    _id: { $ne: participantId },
    name: name,
  });
};

export const updateParticipant = async (
  ownerId: string,
  participantId: string,
  updateData: any,
) => {
  if (updateData.name) {
    const existingName = await Participant.findOne({
      ownerId,
      _id: { $ne: participantId },
      name: updateData.name,
    });
    if (existingName) {
      throw new DuplicateError("existing name for another participant");
    }
  }

  const updated = await Participant.findOneAndUpdate(
    { ownerId, _id: participantId },
    updateData,
    { returnDocument: "after" },
  );
  if (!updated) {
    throw new NotFoundError("unexisting participant");
  }
  return updated;
};

export const deleteParticipant = async (
  ownerId: string,
  participantId: string,
) => {
  const participant = await findParticipantByIdAndOwner(ownerId, participantId);
  return await Participant.deleteOne({ ownerId, _id: participantId });
};
