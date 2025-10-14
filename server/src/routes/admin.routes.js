import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import { createTrip, deleteTrip, getAllTrips, updateTrip } from "../controllers/trip.controller.js";

const router = Router();

const createTripSchema = Joi.object({
  // Required fields
  from: Joi.string().required(),
  to: Joi.string().required(),
  dateTime: Joi.date().iso().required(),
  totalSeats: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  duration: Joi.alternatives().try(
    Joi.number().integer().min(1), // Duration in minutes
    Joi.string().pattern(/^\d+h\s\d+min$/) // Duration in "Xh Ymin" format
  ).required(),

  // Optional fields
  title: Joi.string().optional(),
  departureDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
  originalPrice: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  image: Joi.string().uri().optional(),
  imgUrl: Joi.string().uri().optional(), // Keep for backward compatibility
  rating: Joi.number().min(0).max(5).optional(),
  reviewCount: Joi.number().integer().min(0).optional(),
  isPopular: Joi.boolean().optional()
});


router.post(
  "/trips",
  requireAuth,
  requireRole(ROLES.ADMIN),
  validate(createTripSchema),
  createTrip
);

router.get(
  "/trips",
  requireAuth,
  requireRole(ROLES.ADMIN),
  getAllTrips
);

router.patch(
  "/trips/:id",
  requireAuth,
  requireRole(ROLES.ADMIN),
  updateTrip
);

router.delete(
  "/trips/:id",
  requireAuth,
  requireRole(ROLES.ADMIN),
  deleteTrip
);

export default router;
