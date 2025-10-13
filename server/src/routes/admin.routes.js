import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { Trip } from "../models/Trip.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

const createSchema = Joi.object({
  body: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    dateTime: Joi.date().iso().required(),
    totalSeats: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
  }),
});

function generateSeatMap(total) {
  const seats = [];
  for (let i = 1; i <= total; i++) {
    seats.push({ seatNo: String(i), isBooked: false });
  }
  return seats;
}

router.post(
  "/trips",
  requireAuth,
  requireRole(ROLES.ADMIN),
  validate(createSchema),
  async (req, res, next) => {
    try {
      const { from, to, dateTime, totalSeats, price } = req.body;
      const trip = await Trip.create({
        from,
        to,
        dateTime,
        totalSeats,
        price,
        availableSeats: totalSeats,
        seatMap: generateSeatMap(totalSeats),
        createdBy: req.user.id,
      });
      res.status(201).json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/trips",
  requireAuth,
  requireRole(ROLES.ADMIN),
  async (req, res, next) => {
    try {
      const trips = await Trip.find({}).sort({ createdAt: -1 });
      res.json({ success: true, data: trips });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/trips/:id",
  requireAuth,
  requireRole(ROLES.ADMIN),
  async (req, res, next) => {
    try {
      const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!trip)
        return res
          .status(404)
          .json({ success: false, message: "Trip not found" });
      res.json({ success: true, data: trip });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/trips/:id",
  requireAuth,
  requireRole(ROLES.ADMIN),
  async (req, res, next) => {
    try {
      const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );
      if (!trip)
        return res
          .status(404)
          .json({ success: false, message: "Trip not found" });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
