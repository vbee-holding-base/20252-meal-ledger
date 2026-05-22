import { Router } from "express";
import {
  createParticipant,
  deleteParticipant,
  readParticipants,
  updateParticipant,
} from "../controllers/participantController";

const router = Router();
router.get("/", readParticipants);
router.post("/", createParticipant);
router.put("/:participantId", updateParticipant);
router.delete("/:participantId", deleteParticipant);

export default router;
