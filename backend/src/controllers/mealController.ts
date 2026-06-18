import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { ValidationError, UnauthorisedError } from "../config/errors";
import { createMealWithDebt } from "../services/mealService";

interface SaveMealParticipant {
  participant_id: string;
  amount: number;
}

export const saveMeal = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new UnauthorisedError("Not authorized");
  }

  const {
    restaurant_id,
    restaurant_name,
    meal_time,
    total_amount,
    participants,
  } = req.body;

  if (
    !restaurant_name ||
    !meal_time ||
    !total_amount ||
    !participants?.length
  ) {
    throw new ValidationError(
      "Missing required fields: restaurant_name, meal_time, total_amount, participants",
    );
  }

  if (!restaurant_id) {
    throw new ValidationError(
      "restaurant_id is required. Please create the restaurant first.",
    );
  }

  if (
    participants.some(
      (p: SaveMealParticipant) => !p.participant_id || !p.amount,
    )
  ) {
    throw new ValidationError(
      "Each participant must have participant_id and amount",
    );
  }

  const meal = await createMealWithDebt({
    ownerId: req.user.id,
    restaurantId: restaurant_id,
    restaurantName: restaurant_name,
    date: new Date(meal_time),
    totalAmount: total_amount,
    participantsInfo: participants.map((p: SaveMealParticipant) => ({
      participantId: p.participant_id,
      amount: p.amount,
    })),
  });

  res.status(201).json({ data: meal });
};
