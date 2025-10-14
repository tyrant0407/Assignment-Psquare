import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import { schemas as tripSchemas } from "../controllers/trip.controller.js";
import {
  schemas,
  getDashboardStats,
  getAllUsers,
  getAllBookings,
  getAllPayments,
  getAllTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  updateUserRole,
  deleteUser
} from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(ROLES.ADMIN));

// Dashboard
router.get("/dashboard", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/role", validate(schemas.updateUserRole), updateUserRole);
router.delete("/users/:id", deleteUser);

// Booking management
router.get("/bookings", getAllBookings);

// Payment management
router.get("/payments", getAllPayments);

// Trip management
router.get("/trips", getAllTrips);
router.post("/trips", validate(tripSchemas.createTrip), createTrip);
router.put("/trips/:id", validate(tripSchemas.updateTrip), updateTrip);
router.delete("/trips/:id", deleteTrip);

export default router;