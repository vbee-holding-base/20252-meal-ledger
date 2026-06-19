import { Router } from "express";
import { parseMealText } from "../controllers/mealParserController";
import { protect } from "../middlewares/auth";
import { createRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

const addMealRateLimiter = createRateLimiter({
  clientLimit: 3,
  serverLimit: 5,
  keyPrefix: "add_meal",
});

router.post("/parse", protect, addMealRateLimiter, parseMealText);

export default router;
