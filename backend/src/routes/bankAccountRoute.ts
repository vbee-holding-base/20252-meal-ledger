import { Router } from "express";
import {
  getBankAccount,
  saveBankAccount,
  verifyBankAccount,
} from "../controllers/bankAccountController";
import { protect } from "../middlewares/auth";

const router = Router();
router.get("/", protect, getBankAccount);
router.put("/", protect, saveBankAccount);
router.post("/verify", protect, verifyBankAccount);

export default router;
