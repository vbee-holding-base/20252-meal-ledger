import { Request, Response } from "express";
import Participant from "../models/participantSchema";
import mongoose from "mongoose";

const MOCK_OWNER_ID = new mongoose.Types.ObjectId("owner_abc123");

export const readParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await Participant.find();
    res.status(200).json({ data: participants, total: participants.length });
  } catch (err) {
    console.error("Error reading participant:", err);
    res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "Truy vấn không thành công" });
  }
};

export const createParticipant = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Tên không được để trống",
      });
      return;
    }

    const formattedName = name.trim();
    const isExist = await Participant.findOne({ name: formattedName });
    if (isExist) {
      res.status(409).json({
        error: "DUPLICATE_NAME",
        message: "Tên này đã tồn tại, vui lòng chọn biệt danh khác",
      });
      return;
    }

    const newParticipant = new Participant({
      _id: new mongoose.Types.ObjectId(),
      ownerId: MOCK_OWNER_ID,
      name: formattedName,
      totalDebt: 0,
      status: "active",
    });
    await newParticipant.save();
    res.status(201).json(newParticipant);
  } catch (err) {
    console.error("Error creating participant:", err);
    res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "Truy vấn không thành công" });
  }
};
