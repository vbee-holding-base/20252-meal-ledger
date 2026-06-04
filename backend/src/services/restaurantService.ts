import Restaurant from "../models/restaurantSchema";

interface RestaurantInput {
  name: string;
  address?: string;
}

export class RestaurantServiceError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const formatRestaurantInput = ({ name, address }: RestaurantInput) => {
  const formattedName = name?.trim();
  const formattedAddress = address?.trim() ?? "";

  if (!formattedName) {
    throw new RestaurantServiceError(
      400,
      "VALIDATION_ERROR",
      "Tên quán không được để trống",
    );
  }

  return {
    name: formattedName,
    address: formattedAddress,
  };
};

export const getRestaurantsByOwner = async (ownerId: string) => {
  return Restaurant.find({
    ownerId,
  }).sort({ createdAt: -1 });
};

export const createRestaurantForOwner = async (
  ownerId: string,
  input: RestaurantInput,
) => {
  const formattedInput = formatRestaurantInput(input);

  const existingRestaurant = await Restaurant.findOne({
    ownerId,
    name: formattedInput.name,
  });

  if (existingRestaurant) {
    throw new RestaurantServiceError(
      409,
      "DUPLICATE_RESTAURANT",
      "Quán ăn này đã có trong danh sách",
    );
  }

  return Restaurant.create({
    ownerId,
    name: formattedInput.name,
    address: formattedInput.address,
  });
};

export const updateRestaurantForOwner = async (
  ownerId: string,
  restaurantId: string,
  input: RestaurantInput,
) => {
  if (!restaurantId) {
    throw new RestaurantServiceError(
      400,
      "VALIDATION_ERROR",
      "Missing restaurant id",
    );
  }

  const formattedInput = formatRestaurantInput(input);

  const existingRestaurant = await Restaurant.findOne({
    ownerId,
    name: formattedInput.name,
    _id: { $ne: restaurantId },
  });

  if (existingRestaurant) {
    throw new RestaurantServiceError(
      409,
      "DUPLICATE_RESTAURANT",
      "Quán ăn này đã có trong danh sách",
    );
  }

  const restaurant = await Restaurant.findOneAndUpdate(
    {
      _id: restaurantId,
      ownerId,
    },
    {
      name: formattedInput.name,
      address: formattedInput.address,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!restaurant) {
    throw new RestaurantServiceError(
      404,
      "NOT_FOUND",
      "Không tìm thấy quán ăn",
    );
  }

  return restaurant;
};

export const deleteRestaurantForOwner = async (
  ownerId: string,
  restaurantId: string,
) => {
  if (!restaurantId) {
    throw new RestaurantServiceError(
      400,
      "VALIDATION_ERROR",
      "Missing restaurant id",
    );
  }

  const restaurant = await Restaurant.findOneAndDelete({
    _id: restaurantId,
    ownerId,
  });

  if (!restaurant) {
    throw new RestaurantServiceError(
      404,
      "NOT_FOUND",
      "Không tìm thấy quán ăn",
    );
  }

  return restaurant;
};