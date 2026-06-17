import { Router } from "express";
import { saveMeal } from "../controllers/mealController";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/", protect, saveMeal);

export default router;
