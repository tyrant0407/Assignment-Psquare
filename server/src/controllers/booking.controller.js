import Joi from 'joi';
import * as bookingService from '../services/booking.service.js';

// Validation schemas
export const schemas = {
    createBooking: Joi.object({
        tripId: Joi.string().required(),
        passengers: Joi.array().items(
            Joi.object({
                name: Joi.string().required().trim(),
                age: Joi.number().integer().min(1).max(120).required(),
                gender: Joi.string().valid('male', 'female', 'other').required(),
                seatNumber: Joi.string().required()
            })
        ).min(1).required(),
        contactInfo: Joi.object({
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        }).required(),
        specialRequests: Joi.string().max(500).optional()
    }),

    updateBooking: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional(),
        specialRequests: Joi.string().max(500).optional()
    })
};

// Create a new booking
export const createBooking = async (req, res, next) => {
    try {
        const { tripId, passengers, contactInfo, specialRequests } = req.body;
        const userId = req.user.id;

        const booking = await bookingService.createBooking({
            tripId,
            passengers,
            contactInfo,
            specialRequests,
            userId
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
};

// Get user's bookings
export const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const result = await bookingService.getUserBookings({
            userId,
            page,
            limit,
            status
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingService.getBookingById(id, userId);

        res.json({
            success: true,
            booking
        });
    } catch (error) {
        next(error);
    }
};

// Update booking
export const updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updates = req.body;

        const booking = await bookingService.updateBooking(id, userId, updates);

        res.json({
            success: true,
            message: 'Booking updated successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
};

// Cancel booking
export const cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingService.cancelBooking(id, userId);

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
};

// Get available seats for a trip
export const getAvailableSeats = async (req, res, next) => {
    try {
        const { tripId } = req.params;

        const result = await bookingService.getAvailableSeats(tripId);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};