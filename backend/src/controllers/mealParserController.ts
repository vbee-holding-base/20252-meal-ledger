import { Response } from "express";
import Participant from "../models/participantSchema";
import Restaurant from "../models/restaurantSchema";
import { AuthRequest } from "../middlewares/auth";
import { parseMealTextWithGemini } from "../services/aiMealParserService";
import { validateParsedMealDraft } from "../validators/mealParserValidator";

export const parseMealText = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Text is required.",
      });
    }

    const [participants, restaurants] = await Promise.all([
      Participant.find({
        ownerId: req.user.id,
        status: "active",
      }).select("_id name"),

      Restaurant.find({
        ownerId: req.user.id,
      }).select("_id name address"),
    ]);

    const participantContext = participants.map((participant) => ({
      id: participant._id.toString(),
      name: participant.name,
    }));

    const restaurantContext = restaurants.map((restaurant) => ({
      id: restaurant._id.toString(),
      name: restaurant.name,
      address: restaurant.address,
    }));

    const draft = await parseMealTextWithGemini({
      text: text.trim(),
      now: new Date(),
      participants: participantContext,
      restaurants: restaurantContext,
    });

    const validatedResult = validateParsedMealDraft({
      draft,
      participants: participantContext,
      restaurants: restaurantContext,
    });

    return res.status(200).json({
      data: validatedResult.draft,
      warnings: validatedResult.warnings,
      isValid: validatedResult.isValid,
    });
  } catch (error) {
    console.error("Error parsing meal text:", error);

    return res.status(500).json({
      error: "AI_PARSE_ERROR",
      message: "Could not parse meal text.",
    });
  }
};