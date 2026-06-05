import { Router } from "express";
import { getDetailDebts } from "../controllers/debtController";
import { readParticipants } from "../controllers/participantController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/debts/:id", protect, getDetailDebts);
router.get("/debts", protect, readParticipants);
export default router;
