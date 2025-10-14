import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import {
  schemas,
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  searchTrips
} from "../controllers/trip.controller.js";

const router = Router();

// Public routes
router.get("/", getAllTrips);
router.get("/search", searchTrips);
router.get("/:id", getTripById);

// Protected routes (admin only)
router.post("/", requireAuth, requireAdmin, validate(schemas.createTrip), createTrip);
router.put("/:id", requireAuth, requireAdmin, validate(schemas.updateTrip), updateTrip);
router.delete("/:id", requireAuth, requireAdmin, deleteTrip);

export default router;