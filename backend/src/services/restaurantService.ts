import {
  getRestaurantsByOwnerId,
  findRestaurantByNameAndOwner,
  createRestaurant,
  findOtherRestaurantByName,
  updateRestaurant,
  deleteRestaurant,
} from "../repo/restaurantRepo";

interface RestaurantInput {
  name: string;
  address?: string;
}

import {
  ValidationError,
  NotFoundError,
  DuplicateError,
} from "../config/errors";
const formatRestaurantInput = ({ name, address }: RestaurantInput) => {
  const formattedName = name?.trim();
  const formattedAddress = address?.trim() ?? "";

  if (!formattedName) {
    throw new ValidationError("Tên quán không được để trống");
  }

  return {
    name: formattedName,
    address: formattedAddress,
  };
};

export const getRestaurantsByOwner = async (ownerId: string) => {
  return await getRestaurantsByOwnerId(ownerId);
};

export const createRestaurantForOwner = async (
  ownerId: string,
  input: RestaurantInput,
) => {
  const formattedInput = formatRestaurantInput(input);
  return await createRestaurant(
    ownerId,
    formattedInput.name,
    formattedInput.address,
  );
};

export const updateRestaurantForOwner = async (
  ownerId: string,
  restaurantId: string,
  input: RestaurantInput,
) => {
  if (!restaurantId) {
    throw new ValidationError("Missing restaurant id");
  }

  const formattedInput = formatRestaurantInput(input);

  const restaurant = await updateRestaurant(ownerId, restaurantId, {
    name: formattedInput.name,
    address: formattedInput.address,
  });
  return restaurant;
};

export const deleteRestaurantForOwner = async (
  ownerId: string,
  restaurantId: string,
) => {
  if (!restaurantId) {
    throw new ValidationError("Missing restaurant id");
  }

  const restaurant = await deleteRestaurant(ownerId, restaurantId);
  return restaurant;
};
