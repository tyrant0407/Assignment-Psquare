import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';

export async function createBooking({ tripId, passengers, contactInfo, specialRequests, userId }) {
    // Check if trip exists and is available
    const trip = await Trip.findById(tripId);
    if (!trip) {
        const error = new Error('Trip not found');
        error.status = 404;
        throw error;
    }

    if (trip.status !== 'active') {
        const error = new Error('Trip is not available for booking');
        error.status = 400;
        throw error;
    }

    // Check seat availability
    if (trip.availableSeats < passengers.length) {
        const error = new Error('Not enough seats available');
        error.status = 400;
        throw error;
    }

    // Check if requested seats are already booked
    const requestedSeats = passengers.map(p => p.seatNumber);
    const bookedSeatNumbers = trip.bookedSeats.map(seat => seat.seatNumber);
    const conflictingSeats = requestedSeats.filter(seat => bookedSeatNumbers.includes(seat));

    if (conflictingSeats.length > 0) {
        const error = new Error(`Seats ${conflictingSeats.join(', ')} are already booked`);
        error.status = 400;
        throw error;
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

    return booking;
}

export async function getUserBookings({ userId, page = 1, limit = 10, status }) {
    const filter = { user: userId };
    if (status) {
        filter.status = status;
    }

    const bookings = await Booking.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    return {
        bookings,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalBookings: total
        }
    };
}

export async function getBookingById(id, userId) {
    const booking = await Booking.findOne({ _id: id, user: userId });

    if (!booking) {
        const error = new Error('Booking not found');
        error.status = 404;
        throw error;
    }

    return booking;
}

export async function updateBooking(id, userId, updates) {
    const booking = await Booking.findOne({ _id: id, user: userId });

    if (!booking) {
        const error = new Error('Booking not found');
        error.status = 404;
        throw error;
    }

    // Don't allow status changes if payment is completed
    if (booking.paymentStatus === 'paid' && updates.status === 'cancelled') {
        const error = new Error('Cannot cancel booking after payment is completed');
        error.status = 400;
        throw error;
    }

    Object.assign(booking, updates);
    await booking.save();
    return booking;
}

export async function cancelBooking(id, userId) {
    const booking = await Booking.findOne({ _id: id, user: userId });

    if (!booking) {
        const error = new Error('Booking not found');
        error.status = 404;
        throw error;
    }

    if (booking.status === 'cancelled') {
        const error = new Error('Booking is already cancelled');
        error.status = 400;
        throw error;
    }

    if (booking.paymentStatus === 'paid') {
        const error = new Error('Cannot cancel paid booking. Please request refund.');
        error.status = 400;
        throw error;
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

    return booking;
}

export async function getAvailableSeats(tripId) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
        const error = new Error('Trip not found');
        error.status = 404;
        throw error;
    }

    // Generate all seat numbers (assuming bus layout)
    const totalSeats = [];
    for (let i = 1; i <= trip.totalSeats; i++) {
        totalSeats.push(`S${i.toString().padStart(2, '0')}`);
    }

    const bookedSeatNumbers = trip.bookedSeats.map(seat => seat.seatNumber);
    const availableSeats = totalSeats.filter(seat => !bookedSeatNumbers.includes(seat));

    return {
        availableSeats,
        bookedSeats: bookedSeatNumbers,
        totalSeats: trip.totalSeats,
        availableCount: availableSeats.length
    };
}