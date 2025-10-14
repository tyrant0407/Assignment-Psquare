import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";
import {
    schemas,
    createBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    getAvailableSeats
} from "../controllers/booking.controller.js";

const router = Router();

// All booking routes require authentication
router.use(requireAuth);

// Booking routes
router.post("/", validate(schemas.createBooking), createBooking);
router.get("/", getUserBookings);
router.get("/:id", getBookingById);
router.put("/:id", validate(schemas.updateBooking), updateBooking);
router.delete("/:id", cancelBooking);

// Seat availability
router.get("/seats/:tripId", getAvailableSeats);

export default router;