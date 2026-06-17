import Meal from "../models/mealSchema";

interface CreateMealData {
  ownerId: string;
  restaurantId: string;
  restaurantName: string;
  date: Date;
  totalAmount: number;
  participantsInfo: { participantId: string; amount: number }[];
}

export const createMeal = async (data: CreateMealData) => {
  return await Meal.create({
    ownerId: data.ownerId,
    restaurantId: data.restaurantId,
    restaurantName: data.restaurantName,
    date: data.date,
    totalAmount: data.totalAmount,
    participantsInfo: data.participantsInfo.map((p) => ({
      participantId: p.participantId,
      amount: p.amount,
      status: "unpaid",
    })),
  });
};
