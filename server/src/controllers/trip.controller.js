import Joi from 'joi';
import * as tripService from '../services/trip.service.js';

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
        const result = await tripService.getAllTrips({ page, limit, status });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Search trips
export const searchTrips = async (req, res, next) => {
    try {
        const { from, to, date, page = 1, limit = 10 } = req.query;
        const result = await tripService.searchTrips({ from, to, date, page, limit });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get trip by ID
export const getTripById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const trip = await tripService.getTripById(id);

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
        const trip = await tripService.createTrip(req.body);

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
        const trip = await tripService.updateTrip(id, req.body);

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
        await tripService.deleteTrip(id);

        res.json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};