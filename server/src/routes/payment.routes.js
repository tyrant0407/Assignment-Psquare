import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.js";
import {
    schemas,
    processPayment,
    getPaymentById,
    getUserPayments,
    refundPayment,
    getPaymentStatus
} from "../controllers/payment.controller.js";

const router = Router();

// All payment routes require authentication
router.use(requireAuth);

// Payment routes
router.post("/process", validate(schemas.processPayment), processPayment);
router.get("/", getUserPayments);
router.get("/:id", getPaymentById);
router.post("/refund", validate(schemas.refundPayment), refundPayment);

// Payment status for booking
router.get("/status/:bookingId", getPaymentStatus);

export default router;