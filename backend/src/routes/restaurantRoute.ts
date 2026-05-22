import { Router } from "express";
import { getRestaurant, addRestaurant, updateRestaurant, deleteRestaurant } from "../controllers/restaurantController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/", protect, getRestaurant);
router.post("/", protect, addRestaurant);
router.put("/:id", protect, updateRestaurant);
router.delete("/:id", protect, deleteRestaurant);

export default router;