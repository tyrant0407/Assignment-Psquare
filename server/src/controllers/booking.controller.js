import Joi from 'joi';
import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';
import { createError } from '../utils/error.js';

// Validation schemas
export const schemas = {
    createBooking: Joi.object({
        tripId: Joi.string().required(),
        selectedSeats: Joi.array().items(Joi.string()).min(1).required()
    }),

    updateBooking: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional(),
        specialRequests: Joi.string().max(500).optional()
    })
};

// Create a new booking
export const createBooking = async (req, res, next) => {
    try {
        const { tripId, selectedSeats } = req.body;
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
        if (trip.availableSeats < selectedSeats.length) {
            return next(createError(400, 'Not enough seats available'));
        }

        // Check if requested seats are valid and available
        const validSeats = trip.seatMap.map(seat => seat.seatNo);
        const bookedSeats = trip.seatMap.filter(seat => seat.isBooked).map(seat => seat.seatNo);

        // Check if all requested seats exist
        const invalidSeats = selectedSeats.filter(seat => !validSeats.includes(seat));
        if (invalidSeats.length > 0) {
            return next(createError(400, `Invalid seat numbers: ${invalidSeats.join(', ')}`));
        }

        // Check if any requested seats are already booked
        const conflictingSeats = selectedSeats.filter(seat => bookedSeats.includes(seat));
        if (conflictingSeats.length > 0) {
            return next(createError(400, `Seats ${conflictingSeats.join(', ')} are already booked`));
        }

        // Check for duplicate seat selections in the same booking
        const duplicateSeats = selectedSeats.filter((seat, index) => selectedSeats.indexOf(seat) !== index);
        if (duplicateSeats.length > 0) {
            return next(createError(400, `Duplicate seat selections: ${duplicateSeats.join(', ')}`));
        }

        // Calculate total amount
        const totalAmount = trip.price * selectedSeats.length;

        // Generate booking reference
        const bookingReference = 'BK' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();

        // Create booking with selected seats
        const booking = new Booking({
            user: userId,
            trip: tripId,
            selectedSeats,
            totalAmount,
            bookingReference
        });

        await booking.save();

        // Update trip seat map and available seats
        selectedSeats.forEach(seatNumber => {
            const seatIndex = trip.seatMap.findIndex(seat => seat.seatNo === seatNumber);
            if (seatIndex !== -1) {
                trip.seatMap[seatIndex].isBooked = true;
            }
        });

        trip.availableSeats -= selectedSeats.length;
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
            booking.selectedSeats.forEach(seatNumber => {
                const seatIndex = trip.seatMap.findIndex(seat => seat.seatNo === seatNumber);
                if (seatIndex !== -1) {
                    trip.seatMap[seatIndex].isBooked = false;
                }
            });
            trip.availableSeats += booking.selectedSeats.length;
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

        if (trip.status !== 'active') {
            return next(createError(400, 'Trip is not available'));
        }

        // Get seat information from trip's seatMap
        const availableSeats = trip.seatMap.filter(seat => !seat.isBooked).map(seat => seat.seatNo);
        const bookedSeats = trip.seatMap.filter(seat => seat.isBooked).map(seat => seat.seatNo);

        res.json({
            success: true,
            availableSeats,
            bookedSeats,
            totalSeats: trip.totalSeats,
            availableCount: availableSeats.length,
            seatMap: trip.seatMap
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, tripId } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (tripId) {
            filter.trip = tripId;
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
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalBookings: total
            }
        });
    } catch (error) {
        next(error);
    }
};