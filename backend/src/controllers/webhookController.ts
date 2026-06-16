import { Request, Response } from "express";

export const handleSepayWebhook = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Mock handle SePay webhook" });
};
