import { Request, Response } from "express";
import Participant from "../models/participantSchema";

export const getParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await Participant.find();
    res.status(200).json(participants);
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ message: "Error fetching participants" });
  }
};
