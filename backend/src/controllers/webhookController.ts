import { Request, Response } from "express";
import { processSepayWebhook } from "../services/webhookService";
import { logger } from "../config/logger";

export const handleSepayWebhook = async (req: Request, res: Response) => {
  try {
    const result = await processSepayWebhook(req.body);
    if (result.success) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, error: result.message });
    }
  } catch (error: any) {
    logger.error(error, "[SePay Webhook Controller] Unexpected error:");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
