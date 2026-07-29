import { Router } from "express";
import {
  getRestaurant,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController";
import { protect } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createRestaurantSchema,
  deleteRestaurantSchema,
  updateRestaurantSchema,
} from "../validators/restaurantSchema";

const router = Router();

router.get("/", protect, getRestaurant);
router.post(
  "/",
  protect,
  validateRequest(createRestaurantSchema),
  addRestaurant,
);
router.put(
  "/:id",
  protect,
  validateRequest(updateRestaurantSchema),
  updateRestaurant,
);
router.delete(
  "/:id",
  protect,
  validateRequest(deleteRestaurantSchema),
  deleteRestaurant,
);

export default router;
