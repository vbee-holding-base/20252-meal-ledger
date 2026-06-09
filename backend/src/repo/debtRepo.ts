import mongoose from "mongoose";
import Meal from "../models/mealSchema";

export const findUnpaidMealsByParticipant = async (participantId: string) => {
  return await Meal.find({
    participantsInfo: {
      $elemMatch: {
        participantId: new mongoose.Types.ObjectId(participantId),
        status: "unpaid",
      },
    },
  });
};
