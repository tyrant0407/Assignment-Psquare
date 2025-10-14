import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
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
router.post("/", requireAuth, requireRole(ROLES.ADMIN), validate(schemas.createTrip), createTrip);
router.put("/:id", requireAuth, requireRole(ROLES.ADMIN), validate(schemas.updateTrip), updateTrip);
router.delete("/:id", requireAuth, requireRole(ROLES.ADMIN), deleteTrip);

export default router;