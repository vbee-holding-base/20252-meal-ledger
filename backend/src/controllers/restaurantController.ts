import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import {
  createRestaurantForOwner,
  deleteRestaurantForOwner,
  getRestaurantsByOwner,
  RestaurantServiceError,
  updateRestaurantForOwner,
} from "../services/restaurantService";

const getRestaurantIdParam = (idParam: unknown) =>
  Array.isArray(idParam) ? idParam[0] : idParam;

const handleRestaurantError = (error: unknown, res: Response) => {
  if (error instanceof RestaurantServiceError) {
    return res.status(error.statusCode).json({
      error: {
        "error-code": error.code,
        message: error.message,
      },
    });
  }

  console.error("Restaurant controller error:", error);

  return res.status(500).json({
    message: "Restaurant operation failed",
  });
};

export const getRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const restaurants = await getRestaurantsByOwner(req.user.id);

    return res.status(200).json({
      data: restaurants,
      total: restaurants.length,
    });
  } catch (error) {
    return handleRestaurantError(error, res);
  }
};

export const addRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const restaurant = await createRestaurantForOwner(req.user.id, {
      name: req.body.name,
      address: req.body.address,
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    return handleRestaurantError(error, res);
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const restaurantId = getRestaurantIdParam(req.params.id);

    const restaurant = await updateRestaurantForOwner(
      req.user.id,
      restaurantId,
      {
        name: req.body.name,
        address: req.body.address,
      },
    );

    return res.status(200).json(restaurant);
  } catch (error) {
    return handleRestaurantError(error, res);
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const restaurantId = getRestaurantIdParam(req.params.id);

    await deleteRestaurantForOwner(req.user.id, restaurantId);

    return res.status(200).json({
      message: "Thành công",
    });
  } catch (error) {
    return handleRestaurantError(error, res);
  }
};