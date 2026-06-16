import { Router } from "express";
import { protect } from "../middlewares/auth";
import { generateQrCodePayment } from "../controllers/paymentController";

const router = Router();

router.get("/qr/:orderId", protect, generateQrCodePayment);

export default router;
