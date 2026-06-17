import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { getAllParticipantByOwnerId } from "../repo/participantRepo";
import { getRestaurantsByOwnerId } from "../repo/restaurantRepo";
import {
  ValidationError,
  ServerError,
  UnauthorisedError,
} from "../config/errors";
import { createMealParserProvider } from "../ai/factories/aiProviderFactory";
import { MealParserService } from "../services/aiMealParserService";
import { finalValidatedResult } from "../validators/mealParserValidator";
import { createMeal } from "../repo/mealRepo";

interface SaveMealParticipant {
  participant_id: string;
  amount: number;
}

export const parseMealText = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new UnauthorisedError("Not authorized");
  }

  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new ValidationError("Text is required.");
  }

  const [participants, restaurants] = await Promise.all([
    getAllParticipantByOwnerId(req.user.id),
    getRestaurantsByOwnerId(req.user.id),
  ]);

  const activeParticipants = participants.filter((p) => p.status === "active");

  const participantContext = activeParticipants.map((participant) => ({
    id: participant._id.toString(),
    name: participant.name,
  }));

  const restaurantContext = restaurants.map((restaurant) => ({
    id: restaurant._id.toString(),
    name: restaurant.name,
    address: restaurant.address,
  }));

  const provider = createMealParserProvider();
  const mealParserService = new MealParserService(provider);

  try {
    const parsed = await mealParserService.parse({
      text: text.trim(),
      now: new Date(),
      participants: participantContext,
      restaurants: restaurantContext,
    });

    const validated = finalValidatedResult({
      parsed,
      participants: participantContext,
      restaurants: restaurantContext,
    });

    res.status(200).json({
      data: validated,
      context: {
        participants: participantContext,
        restaurants: restaurantContext,
      },
    });
  } catch (error) {
    console.error("Error parsing meal text:", error);
    throw new ServerError("Could not parse meal text.");
  }
};

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

  const meal = await createMeal({
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
