import { Router } from "express";
import { parseMealText, saveMeal } from "../controllers/mealParserController";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/parse", protect, parseMealText);
router.post("/", protect, saveMeal);

export default router;
