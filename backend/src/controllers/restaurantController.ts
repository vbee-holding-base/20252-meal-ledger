import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  createRestaurantForOwner,
  deleteRestaurantForOwner,
  getRestaurantsByOwner,
  updateRestaurantForOwner,
} from "../services/restaurantService";
import { UnauthorisedError } from "../config/errors";

const getRestaurantIdParam = (idParam: unknown) =>
  Array.isArray(idParam) ? idParam[0] : idParam;

export const getRestaurant = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new UnauthorisedError("Not authorized");
  }

  const restaurants = await getRestaurantsByOwner(req.user.id);

  res.status(200).json({
    data: restaurants,
    total: restaurants.length,
  });
};

export const addRestaurant = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new UnauthorisedError("Not authorized");
  }

  const restaurant = await createRestaurantForOwner(req.user.id, {
    name: req.body.name,
    address: req.body.address,
  });

  res.status(201).json(restaurant);
};

export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new UnauthorisedError("Not authorized");
  }

  const restaurantId = getRestaurantIdParam(req.params.id);

  const restaurant = await updateRestaurantForOwner(req.user.id, restaurantId, {
    name: req.body.name,
    address: req.body.address,
  });

  res.status(200).json(restaurant);
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new UnauthorisedError("Not authorized");
  }

  const restaurantId = getRestaurantIdParam(req.params.id);

  await deleteRestaurantForOwner(req.user.id, restaurantId);

  res.status(200).json({
    message: "Thành công",
  });
};
