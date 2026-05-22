import { Response } from "express";
import Restaurant from "../models/restaurantSchema";
import { AuthRequest } from "../middlewares/auth";

export const getRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const restaurants = await Restaurant.find({
      ownerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      data: restaurants,
      total: restaurants.length,
    });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({
      message: "Error fetching restaurants",
    });
  }
};

export const addRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, address } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: {
          "error-code": "VALIDATION_ERROR",
          message: "Tên quán không được để trống",
        },
      });
    }

    const existingRestaurant = await Restaurant.findOne({
      ownerId: req.user.id,
      name: name.trim(),
    });

    if (existingRestaurant) {
      return res.status(409).json({
        error: {
          "error-code": "DUPLICATE_RESTAURANT",
          message: "Quán ăn này đã có trong danh sách",
        },
      });
    }

    const restaurant = await Restaurant.create({
      ownerId: req.user.id,
      name: name.trim(),
      address: address?.trim() ?? "",
    });

    res.status(201).json(restaurant);
  } catch (err) {
    console.error("Error creating restaurant:", err);
    res.status(500).json({
      message: "Error creating restaurant",
    });
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const { name, address } = req.body;

    if (!id) {
      return res.status(400).json({
        error: {
          "error-code": "VALIDATION_ERROR",
          message: "Missing restaurant id",
        },
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: {
          "error-code": "VALIDATION_ERROR",
          message: "Tên quán không được để trống",
        },
      });
    }

    const existingRestaurant = await Restaurant.findOne({
      ownerId: req.user.id,
      name: name.trim(),
      _id: { $ne: id },
    });

    if (existingRestaurant) {
      return res.status(409).json({
        error: {
          "error-code": "DUPLICATE_RESTAURANT",
          message: "Quán ăn này đã có trong danh sách",
        },
      });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        _id: id,
        ownerId: req.user.id,
      },
      {
        name: name.trim(),
        address: address?.trim() ?? "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!restaurant) {
      return res.status(404).json({
        error: {
          "error-code": "NOT_FOUND",
          message: "Không tìm thấy quán ăn",
        },
      });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).json({
      message: "Error updating restaurant",
    });
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!id) {
      return res.status(400).json({
        error: {
          "error-code": "VALIDATION_ERROR",
          message: "Missing restaurant id",
        },
      });
    }

    const restaurant = await Restaurant.findOneAndDelete({
      _id: id,
      ownerId: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        error: {
          "error-code": "NOT_FOUND",
          message: "Không tìm thấy quán ăn",
        },
      });
    }

    res.status(200).json({
      message: "Thành công",
    });
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).json({
      message: "Error deleting restaurant",
    });
  }
};