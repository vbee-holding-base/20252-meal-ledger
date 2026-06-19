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

const participantSearchRateLimiter = createRateLimiter({
  clientLimit: 3,
  serverLimit: 30, // Higher server limit for read
  keyPrefix: "search_participant",
});

router.get("/", protect, participantSearchRateLimiter, readParticipants);
router.post("/", protect, createParticipant);
router.put("/:participantId", protect, updateParticipant);
router.delete("/:participantId", protect, deleteParticipant);

export default router;
