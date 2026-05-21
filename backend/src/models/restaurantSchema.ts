import mongoose, { Schema } from "mongoose";

export interface IRestaurant {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  address: string;
}

const restaurantSchema = new mongoose.Schema<IRestaurant>(
  {
    ownerId: { type: Schema.Types.ObjectId, required: true, ref: "Owner" },
    name: { type: String, required: true },
    address: { type: String, required: false, default: "" },
  },
  {
    timestamps: true,
  },
);

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
