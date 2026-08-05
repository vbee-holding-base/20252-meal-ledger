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
import { createRateLimiter } from "../middlewares/rateLimiter";
const router = Router();
const restaurantRateLimiter = createRateLimiter({
  clientLimit: 30,
  serverLimit: 100,
  keyPrefix: "restaurants",
});
router.get("/", protect, restaurantRateLimiter, getRestaurant);
router.post(
  "/",
  protect,
  restaurantRateLimiter,
  validateRequest(createRestaurantSchema),
  addRestaurant,
);
router.put(
  "/:id",
  protect,
  restaurantRateLimiter,
  validateRequest(updateRestaurantSchema),
  updateRestaurant,
);
router.delete(
  "/:id",
  protect,
  restaurantRateLimiter,
  validateRequest(deleteRestaurantSchema),
  deleteRestaurant,
);

export default router;
