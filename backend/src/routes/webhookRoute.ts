import { Router } from "express";
import { handleSepayWebhook } from "../controllers/webhookController";
import { verifySepayWebhook } from "../middlewares/verifySepayWebhook";

const router = Router();

router.post("/notify", verifySepayWebhook, handleSepayWebhook);

export default router;
