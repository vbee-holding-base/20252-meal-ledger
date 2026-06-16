import { Router } from "express";
import { handleSepayWebhook } from "../controllers/webhookController";

const router = Router();

router.post("/sepay", handleSepayWebhook);

export default router;
