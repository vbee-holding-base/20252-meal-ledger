import { Router } from "express";
import { parseMealText } from "../controllers/mealParserController";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/parse", protect, parseMealText);

export default router;
