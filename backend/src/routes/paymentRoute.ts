import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  getPaymentInfo,
  checkPaymentStatus,
} from "../controllers/paymentController";

const router = Router();

router.get("/:participantId", protect, getPaymentInfo);
router.get("/:participantId/status", protect, checkPaymentStatus);

export default router;
