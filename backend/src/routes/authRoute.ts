import { Router } from "express";
import {
  initiateGoogleLogin,
  googleCallback,
  getMe,
  logout,
  refreshToken,
} from "../controllers/authController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/google", initiateGoogleLogin);
router.get("/google/callback", googleCallback);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/refresh", refreshToken);

export default router;
