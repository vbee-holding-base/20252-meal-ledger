import mongoose, { Schema } from "mongoose";

export interface IMeal {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  restaurantName: string;
  date: Date;
  totalAmount: number;
  participantsInfo: {
    participantId: mongoose.Types.ObjectId;
    amount: number;
  }[];
}

const mealSchema = new mongoose.Schema<IMeal>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
    restaurantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    restaurantName: { type: String, required: true },
    date: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    participantsInfo: [
      {
        participantId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Participant",
        },
        amount: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Meal = mongoose.model<IMeal>("Meal", mealSchema);
export default Meal;
