import mongoose from "mongoose";
import Meal from "../models/mealSchema";

export const findUnpaidMealsByParticipant = async (
  participantId: string,
  session?: mongoose.ClientSession,
) => {
  return await Meal.find({
    participantsInfo: {
      $elemMatch: {
        participantId: new mongoose.Types.ObjectId(participantId),
        status: { $in: ["unpaid", "uncomplete"] },
      },
    },
  })
    .sort({ date: 1 })
    .session(session || null);
};

export const findAllMealsByParticipant = async (
  participantId: string,
  session?: mongoose.ClientSession,
) => {
  return await Meal.find({
    participantsInfo: {
      $elemMatch: {
        participantId: new mongoose.Types.ObjectId(participantId),
      },
    },
  })
    .sort({ date: -1 })
    .session(session || null);
};
