import { Router } from "express";
import { parseMealText } from "../controllers/mealParserController";
import { protect } from "../middlewares/auth";
import { createRateLimiter } from "../middlewares/rateLimiter";
import { validateRequest } from "../middlewares/validateRequest";
import { parseMealTextRequestSchema } from "../validators/parserSchema";
const router = Router();

const addMealRateLimiter = createRateLimiter({
  clientLimit: 2,
  serverLimit: 5,
  keyPrefix: "add_meal",
});

router.post(
  "/parse",
  protect,
  addMealRateLimiter,
  validateRequest(parseMealTextRequestSchema),
  parseMealText,
);

export default router;
