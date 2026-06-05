import { Router } from "express";
import { getDetailDebts } from "../controllers/debtController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/debts/:id", protect, getDetailDebts);

export default router;
