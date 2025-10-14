import Joi from 'joi';
import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';
import Payment from '../models/Payment.js';
import { createError } from '../utils/error.js';

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

        // Check if trip exists and is available
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return next(createError(404, 'Trip not found'));
        }

        if (trip.status !== 'active') {
            return next(createError(400, 'Trip is not available for booking'));
        }

        // Check seat availability
        if (trip.availableSeats < passengers.length) {
            return next(createError(400, 'Not enough seats available'));
        }

        // Check if requested seats are already booked
        const requestedSeats = passengers.map(p => p.seatNumber);
        const bookedSeatNumbers = trip.bookedSeats.map(seat => seat.seatNumber);
        const conflictingSeats = requestedSeats.filter(seat => bookedSeatNumbers.includes(seat));

        if (conflictingSeats.length > 0) {
            return next(createError(400, `Seats ${conflictingSeats.join(', ')} are already booked`));
        }

        // Calculate total amount
        const totalAmount = trip.price * passengers.length;

        // Create booking
        const booking = new Booking({
            user: userId,
            trip: tripId,
            passengers,
            totalAmount,
            contactInfo,
            specialRequests
        });

        await booking.save();

        // Update trip with booked seats
        trip.bookedSeats.push(...passengers.map(p => ({
            seatNumber: p.seatNumber,
            bookingId: booking._id
        })));

        await trip.save();

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

        const filter = { user: userId };
        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            bookings,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalBookings: total
            }
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

        const booking = await Booking.findOne({ _id: id, user: userId });

        if (!booking) {
            return next(createError(404, 'Booking not found'));
        }

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

        const booking = await Booking.findOne({ _id: id, user: userId });

        if (!booking) {
            return next(createError(404, 'Booking not found'));
        }

        // Don't allow status changes if payment is completed
        if (booking.paymentStatus === 'paid' && updates.status === 'cancelled') {
            return next(createError(400, 'Cannot cancel booking after payment is completed'));
        }

        Object.assign(booking, updates);
        await booking.save();

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

        const booking = await Booking.findOne({ _id: id, user: userId });

        if (!booking) {
            return next(createError(404, 'Booking not found'));
        }

        if (booking.status === 'cancelled') {
            return next(createError(400, 'Booking is already cancelled'));
        }

        if (booking.paymentStatus === 'paid') {
            return next(createError(400, 'Cannot cancel paid booking. Please request refund.'));
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Free up the seats in trip
        const trip = await Trip.findById(booking.trip);
        if (trip) {
            const passengerSeats = booking.passengers.map(p => p.seatNumber);
            trip.bookedSeats = trip.bookedSeats.filter(
                seat => !passengerSeats.includes(seat.seatNumber)
            );
            await trip.save();
        }

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

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return next(createError(404, 'Trip not found'));
        }

        // Generate all seat numbers (assuming bus layout)
        const totalSeats = [];
        for (let i = 1; i <= trip.totalSeats; i++) {
            totalSeats.push(`S${i.toString().padStart(2, '0')}`);
        }

        const bookedSeatNumbers = trip.bookedSeats.map(seat => seat.seatNumber);
        const availableSeats = totalSeats.filter(seat => !bookedSeatNumbers.includes(seat));

        res.json({
            success: true,
            availableSeats,
            bookedSeats: bookedSeatNumbers,
            totalSeats: trip.totalSeats,
            availableCount: availableSeats.length
        });
    } catch (error) {
        next(error);
    }
};