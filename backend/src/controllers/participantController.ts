import { Request, Response } from "express";
import Participant from "../models/participantSchema";

const sanitiseString = (name: unknown) => {
  if (!name || typeof name !== "string") return null;
  const trimmed = name.trim();
  if (trimmed === "") return null;
  return trimmed;
};

export const readParticipants = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId) {
      res
        .status(400)
        .json({ error: "VALIDATION_ERROR", message: "Không hợp lệ" });
      return;
    }
    const participants = await Participant.find({ ownerId: ownerId });
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
    const { name, ownerId } = req.body;
    const formattedName = sanitiseString(name);
    if (formattedName === null || !ownerId) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Tên không hợp lệ",
      });
      return;
    }

    const existingParticipant = await Participant.findOne({
      ownerId: ownerId,
      name: formattedName,
    });
    if (existingParticipant) {
      res.status(409).json({
        error: "DUPLICATE_NAME",
        message: "Tên này đã tồn tại, vui lòng chọn biệt danh khác",
      });
      return;
    }

    const newParticipant = new Participant({
      ownerId: ownerId,
      name: formattedName,
      totalDebt: 0,
      status: "active",
    });
    await newParticipant.save();
    res.status(201).json(newParticipant);
  } catch (err) {
    console.error("Error creating participants:", err);
    res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "Truy vấn không thành công" });
  }
};

export const updateParticipant = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.params;
    const { name, ownerId } = req.body;
    const formattedName = sanitiseString(name);
    if (formattedName === null || !participantId || !ownerId) {
      console.log(name);
      res
        .status(400)
        .json({ error: "VALIDATION_ERROR", message: "Không hợp lệ" });
      return;
    }

    const existedName = await Participant.findOne({
      ownerId: ownerId,
      _id: { $ne: participantId },
      name: formattedName,
    });
    if (existedName) {
      res
        .status(409)
        .json({ error: "VALIDATION_ERROR", message: "Tên đã tồn tại" });
      return;
    }

    const updatedParticipant = await Participant.findOneAndUpdate(
      { ownerId: ownerId, _id: participantId },
      { name: formattedName },
      { returnDocument: "after" },
    );
    if (!updatedParticipant) {
      res.status(404).json({ error: "NOT_FOUND", message: "Không tìm thấy" });
      return;
    }

    res.status(200).json({ updatedParticipant });
  } catch (err) {
    console.error("Error updating participant:", err);
    res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "Truy vấn không thành công" });
  }
};

export const deleteParticipant = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.params;
    const { ownerId } = req.body;
    if (!participantId || !ownerId) {
      res
        .status(400)
        .json({ error: "VALIDATION_ERROR", message: "Không hợp lệ" });
      return;
    }
    const existingParticipant = await Participant.findOne({
      ownerId: ownerId,
      _id: participantId,
    });
    if (!existingParticipant) {
      res.status(404).json({ error: "NOT_FOUND", message: "Không tìm thấy" });
      return;
    }

    if (existingParticipant.totalDebt > 0) {
      res.status(409).json({
        error: "HAS_OUTSTANDING_DEBT",
        message: "Không thể xóa người này vì vẫn còn công nợ chưa thanh toán",
      });
      return;
    }

    await Participant.deleteOne({ _id: participantId, ownerId: ownerId });
    res.status(200).json({ message: "Thành công" });
  } catch (err) {
    console.error("Error deleting participant:", err);
    res
      .status(500)
      .json({ error: "SERVER_ERROR", message: "Truy vấn không thành công" });
  }
};
