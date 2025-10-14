import Joi from 'joi';
import Trip from '../models/Trip.js';
import { createError } from '../utils/error.js';

// Validation schemas
export const schemas = {
    createTrip: Joi.object({
        title: Joi.string().required().trim(),
        from: Joi.string().required().trim(),
        to: Joi.string().required().trim(),
        departureDate: Joi.date().required(),
        arrivalDate: Joi.date().optional(),
        duration: Joi.string().required(),
        price: Joi.number().positive().required(),
        originalPrice: Joi.number().positive().optional(),
        totalSeats: Joi.number().integer().min(1).required(),
        description: Joi.string().max(1000).optional(),
        image: Joi.string().uri().optional(),
        amenities: Joi.array().items(Joi.string()).optional(),
        busType: Joi.string().valid('ac', 'non-ac', 'sleeper', 'semi-sleeper').optional(),
        operator: Joi.object({
            name: Joi.string().required(),
            contact: Joi.string().optional(),
            rating: Joi.number().min(0).max(5).optional()
        }).required()
    }),

    updateTrip: Joi.object({
        title: Joi.string().trim().optional(),
        from: Joi.string().trim().optional(),
        to: Joi.string().trim().optional(),
        departureDate: Joi.date().optional(),
        arrivalDate: Joi.date().optional(),
        duration: Joi.string().optional(),
        price: Joi.number().positive().optional(),
        originalPrice: Joi.number().positive().optional(),
        totalSeats: Joi.number().integer().min(1).optional(),
        description: Joi.string().max(1000).optional(),
        image: Joi.string().uri().optional(),
        amenities: Joi.array().items(Joi.string()).optional(),
        busType: Joi.string().valid('ac', 'non-ac', 'sleeper', 'semi-sleeper').optional(),
        operator: Joi.object({
            name: Joi.string().optional(),
            contact: Joi.string().optional(),
            rating: Joi.number().min(0).max(5).optional()
        }).optional(),
        status: Joi.string().valid('active', 'cancelled', 'completed').optional()
    })
};

// Get all trips
export const getAllTrips = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status = 'active' } = req.query;

        const trips = await Trip.find({ status })
            .sort({ departureDate: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Trip.countDocuments({ status });

        res.json({
            success: true,
            trips,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTrips: total
            }
        });
    } catch (error) {
        next(error);
    }
};

// Search trips
export const searchTrips = async (req, res, next) => {
    try {
        const { from, to, date, page = 1, limit = 10 } = req.query;

        const filter = { status: 'active' };

        if (from) {
            filter.from = new RegExp(from, 'i');
        }

        if (to) {
            filter.to = new RegExp(to, 'i');
        }

        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            filter.departureDate = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        const trips = await Trip.find(filter)
            .sort({ departureDate: 1, price: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Trip.countDocuments(filter);

        res.json({
            success: true,
            trips,
            searchCriteria: { from, to, date },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTrips: total
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get trip by ID
export const getTripById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const trip = await Trip.findById(id);

        if (!trip) {
            return next(createError(404, 'Trip not found'));
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        next(error);
    }
};

// Create trip (admin only)
export const createTrip = async (req, res, next) => {
    try {
        const tripData = req.body;
        tripData.availableSeats = tripData.totalSeats;

        const trip = new Trip(tripData);
        await trip.save();

        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            trip
        });
    } catch (error) {
        next(error);
    }
};

// Update trip (admin only)
export const updateTrip = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const trip = await Trip.findById(id);

        if (!trip) {
            return next(createError(404, 'Trip not found'));
        }

        // If totalSeats is being updated, recalculate availableSeats
        if (updates.totalSeats) {
            updates.availableSeats = updates.totalSeats - trip.bookedSeats.length;
        }

        Object.assign(trip, updates);
        await trip.save();

        res.json({
            success: true,
            message: 'Trip updated successfully',
            trip
        });
    } catch (error) {
        next(error);
    }
};

// Delete trip (admin only)
export const deleteTrip = async (req, res, next) => {
    try {
        const { id } = req.params;

        const trip = await Trip.findById(id);

        if (!trip) {
            return next(createError(404, 'Trip not found'));
        }

        // Check if trip has bookings
        if (trip.bookedSeats.length > 0) {
            return next(createError(400, 'Cannot delete trip with existing bookings'));
        }

        await Trip.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};