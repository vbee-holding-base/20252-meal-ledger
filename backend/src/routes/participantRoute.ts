import { Router } from "express";
import {
  createParticipant,
  deleteParticipant,
  readParticipants,
  updateParticipant,
} from "../controllers/participantController";
import { protect } from "../middlewares/auth";
import { createRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.get("/", protect, readParticipants);
router.post("/", protect, createParticipant);
router.put("/:participantId", protect, updateParticipant);
router.delete("/:participantId", protect, deleteParticipant);

export default router;
