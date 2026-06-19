import { Router } from "express";
import { protect } from "../middlewares/auth";
import {
  getPaymentInfo,
  checkPaymentStatus,
} from "../controllers/paymentController";

const router = Router();

router.get("/:participantId", getPaymentInfo);
router.get("/:participantId/status", checkPaymentStatus);

export default router;
