import { Router } from "express";
import Joi from "joi";
import { validate } from "../middlewares/validate.js";
import { Trip } from "../models/Trip.js";

const router = Router();

const listSchema = Joi.object({
  query: Joi.object({
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    date: Joi.string().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
});

router.get("/", validate(listSchema), async (req, res, next) => {
  try {
    const { from, to, date, page, limit } = req.query;
    const filter = { isDeleted: false, availableSeats: { $gt: 0 } };
    if (from) filter.from = new RegExp(`^${from}$`, "i");
    if (to) filter.to = new RegExp(`^${to}$`, "i");
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.dateTime = { $gte: start, $lt: end };
    }
    const docs = await Trip.find(filter)
      .sort({ dateTime: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("from to dateTime price availableSeats");
    res.json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).lean();
    if (!trip)
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

export default router;
