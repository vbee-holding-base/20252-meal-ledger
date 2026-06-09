import Restaurant from "../models/restaurantSchema";
import { DuplicateError, NotFoundError } from "../config/errors";

export const getRestaurantsByOwnerId = async (ownerId: string) => {
  return await Restaurant.find({ ownerId }).sort({ createdAt: -1 });
};

export const findRestaurantByNameAndOwner = async (
  ownerId: string,
  name: string,
) => {
  return await Restaurant.findOne({ ownerId, name });
};

export const createRestaurant = async (
  ownerId: string,
  name: string,
  address: string,
) => {
  const existing = await Restaurant.findOne({ ownerId, name });
  if (existing) {
    throw new DuplicateError("Quán ăn này đã có trong danh sách");
  }
  return await Restaurant.create({ ownerId, name, address });
};

export const findOtherRestaurantByName = async (
  ownerId: string,
  restaurantId: string,
  name: string,
) => {
  return await Restaurant.findOne({
    ownerId,
    name,
    _id: { $ne: restaurantId },
  });
};

export const updateRestaurant = async (
  ownerId: string,
  restaurantId: string,
  updateData: any,
) => {
  if (updateData.name) {
    const existing = await Restaurant.findOne({
      ownerId,
      name: updateData.name,
      _id: { $ne: restaurantId },
    });
    if (existing) {
      throw new DuplicateError("Quán ăn này đã có trong danh sách");
    }
  }

  const updated = await Restaurant.findOneAndUpdate(
    { _id: restaurantId, ownerId },
    updateData,
    { new: true, runValidators: true },
  );

  if (!updated) {
    throw new NotFoundError("Không tìm thấy quán ăn");
  }
  return updated;
};

export const deleteRestaurant = async (
  ownerId: string,
  restaurantId: string,
) => {
  const deleted = await Restaurant.findOneAndDelete({
    _id: restaurantId,
    ownerId,
  });
  if (!deleted) {
    throw new NotFoundError("Không tìm thấy quán ăn");
  }
  return deleted;
};
