import { Router } from "express";
import {
  initiateGoogleLogin,
  googleCallback,
  getMe,
  logout,
} from "../controllers/authController";
import { protect } from "../middlewares/auth";

const router = Router();

// Các route Public
router.get("/google", initiateGoogleLogin);
router.get("/google/callback", googleCallback);

// Các route Private (Bắt buộc phải có token hợp lệ mới được gọi)
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
