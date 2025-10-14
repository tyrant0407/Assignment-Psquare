import { Router } from "express";
import { getAllTrips, searchTrips ,getTripById } from "../controllers/trip.controller.js";

const router = Router();


// Public routes
router.get("/", getAllTrips);
router.get("/search", searchTrips);
router.get("/:id", getTripById);


export default router;
