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

const router = Router();

router.get("/", protect, readParticipants);
router.post(
  "/",
  protect,
  validateRequest(createParticipantSchema),
  createParticipant,
);
router.put(
  "/:participantId",
  protect,
  validateRequest(updateParticipantSchema),
  updateParticipant,
);
router.delete(
  "/:participantId",
  protect,
  validateRequest(deleteParticipantSchema),
  deleteParticipant,
);

export default router;
