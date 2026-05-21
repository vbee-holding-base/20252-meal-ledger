import mongoose, { Schema } from "mongoose";

export interface IParticipant {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  totalDebt: number;
  status: string;
}

const participantSchema = new mongoose.Schema<IParticipant>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
    name: { type: String, required: true },
    totalDebt: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, default: "active" },
  },
  {
    timestamps: true,
  },
);

const Participant = mongoose.model<IParticipant>(
  "Participant",
  participantSchema,
);
export default Participant;
