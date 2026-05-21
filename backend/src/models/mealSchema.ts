import mongoose, { Schema } from "mongoose";

export interface IMeal {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  restaurantName: string;
  date: Date;
  totalAmount: number;
  participantsInfo: [
    {
      participantId: mongoose.Types.ObjectId;
      amount: number;
    },
  ];
}

const mealSchema = new mongoose.Schema<IMeal>(
  {
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    ownerId: { type: Schema.Types.ObjectId, required: true },
    restaurantId: { type: Schema.Types.ObjectId, required: true },
    restaurantName: { type: String, required: true },
    date: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    participantsInfo: [
      {
        participantId: { type: Schema.Types.ObjectId, required: true },
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
