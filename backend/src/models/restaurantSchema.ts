import mongoose, { Schema } from "mongoose";

export interface IRestaurant {
  _id: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  address: string;
}

const restaurantSchema = new mongoose.Schema<IRestaurant>(
  {
    _id: { type: Schema.Types.ObjectId, required: true, unique: true },
    ownerId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
