import { Router } from "express";
import {
  createParticipant,
  deleteParticipant,
  readParticipants,
  updateParticipant,
} from "../controllers/participantController";
import { protect } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createParticipantSchema,
  deleteParticipantSchema,
  updateParticipantSchema,
} from "../validators/participantSchema";
import { createRateLimiter } from "../middlewares/rateLimiter";
const router = Router();

const participantRateLimiter = createRateLimiter({
  clientLimit: 30,
  serverLimit: 100,
  keyPrefix: "participants",
});

router.get("/", protect, readParticipants);
router.post(
  "/",
  protect,
  participantRateLimiter,
  validateRequest(createParticipantSchema),
  createParticipant,
);
router.put(
  "/:participantId",
  protect,
  participantRateLimiter,
  validateRequest(updateParticipantSchema),
  updateParticipant,
);
router.delete(
  "/:participantId",
  protect,
  participantRateLimiter,
  validateRequest(deleteParticipantSchema),
  deleteParticipant,
);

export default router;
