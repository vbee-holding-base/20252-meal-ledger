import { Router } from "express";
import {
  getBankAccount,
  generateLink,
  setBankAccount,
} from "../controllers/bankHubController";
import { protect } from "../middlewares/auth";

const router = Router();
router.post("/generate-link", protect, generateLink);
router.get("/bank-account", protect, getBankAccount);
router.post("/bank-account", protect, setBankAccount);

export default router;
