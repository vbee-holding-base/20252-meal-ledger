import Participant from "../models/participantSchema";
import { createMeal } from "../repo/mealRepo";

interface CreateMealWithDebtData {
  ownerId: string;
  restaurantId: string;
  restaurantName: string;
  date: Date;
  totalAmount: number;
  participantsInfo: { participantId: string; amount: number }[];
}

export const createMealWithDebt = async (data: CreateMealWithDebtData) => {
  const meal = await createMeal(data);

  await Promise.all(
    data.participantsInfo.map((p) =>
      Participant.findByIdAndUpdate(p.participantId, {
        $inc: { totalDebt: p.amount },
      }),
    ),
  );

  return meal;
};
