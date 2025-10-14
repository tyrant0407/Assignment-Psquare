import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    getAvailableSeats,
    getAllBookings
} from "../controllers/booking.controller.js";

const router = Router();

// All booking routes require authentication
router.use(requireAuth);

// Booking routes
router.post("/", createBooking);
router.get("/", getUserBookings);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", cancelBooking);

// Seat availability
router.get("/seats/:tripId", getAvailableSeats);

// Admin route for getting all bookings (should be moved to admin routes in production)
router.get("/admin/all", getAllBookings);

export default router;