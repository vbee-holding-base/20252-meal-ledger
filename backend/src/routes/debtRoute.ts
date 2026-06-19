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
import { createRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

const debtDetailRateLimiter = createRateLimiter({
  clientLimit: 5,
  serverLimit: 50,
  keyPrefix: "debt_detail",
});

router.get("/public/:id", debtDetailRateLimiter, getDetailDebtsPublic);
router.get("/public", readParticipantsPublic);
router.get("/:id", protect, getDetailDebts);
router.get("/", protect, readParticipants);

export default router;
