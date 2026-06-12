import { Router } from "express";
import {
  getDetailDebts,
  getDetailDebtsPublic,
} from "../controllers/debtController";
import {
  readParticipants,
  readParticipantsPublic,
} from "../controllers/participantController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/public/:id", getDetailDebtsPublic);
router.get("/public", readParticipantsPublic);
router.get("/:id", protect, getDetailDebts);
router.get("/", protect, readParticipants);

export default router;
