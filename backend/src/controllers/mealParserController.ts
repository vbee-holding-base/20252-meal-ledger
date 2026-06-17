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

    res.status(200).json({
      data: parsed,
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
