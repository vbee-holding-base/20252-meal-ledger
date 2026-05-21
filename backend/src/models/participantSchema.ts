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
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    ownerId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    totalDebt: { type: Number, required: true },
    status: { type: String, required: true },
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
