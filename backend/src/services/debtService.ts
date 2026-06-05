import mongoose from "mongoose";
import Participant from "../models/participantSchema";
import Meal from "../models/mealSchema";

export const getDetailDebt = async (participantId: string) => {
  const participant = await Participant.findById(participantId);
  if (!participant) {
    throw new Error("Participant not found");
  }
  const participantMeal = await Meal.find({
    participantsInfo: {
      $elemMatch: {
        participantId: new mongoose.Types.ObjectId(participantId),
        status: "unpaid",
      },
    },
  });
  if (!participantMeal) {
    throw new Error("No meals found for this participant");
  }
  const historyDebts = participantMeal
    .map((meal) => {
      const participantInfo = meal.participantsInfo.find(
        (p) => p.participantId.toString() === participantId.toString(),
      );
      if (!participantInfo || participantInfo.status !== "unpaid") {
        return null;
      }
      return {
        restaurantName: meal.restaurantName,
        date: meal.date,
        amount: participantInfo.amount,
      };
    })
    .filter(
      (item): item is { restaurantName: string; date: Date; amount: number } =>
        item !== null,
    );
  return historyDebts;
};
export const checkParticipant = async (participantId: string) => {
  const participant = await Participant.findById(participantId);
  if (!participant) {
    throw new Error("Participant not found");
  }
  return participant;
};
