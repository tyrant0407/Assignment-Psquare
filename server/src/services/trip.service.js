import Trip from '../models/Trip.js';

export async function getAllTrips({ page = 1, limit = 10, status = 'active' }) {
    const trips = await Trip.find({ status })
        .sort({ departureDate: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Trip.countDocuments({ status });

    return {
        trips,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalTrips: total
        }
    };
}

export async function searchTrips({ from, to, date, page = 1, limit = 10 }) {
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

    return {
        trips,
        searchCriteria: { from, to, date },
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalTrips: total
        }
    };
}

export async function getTripById(id) {
    const trip = await Trip.findById(id);
    if (!trip) {
        const error = new Error('Trip not found');
        error.status = 404;
        throw error;
    }
    return trip;
}

export async function createTrip(tripData) {
    tripData.availableSeats = tripData.totalSeats;
    const trip = new Trip(tripData);
    await trip.save();
    return trip;
}

export async function updateTrip(id, updates) {
    const trip = await Trip.findById(id);

    if (!trip) {
        const error = new Error('Trip not found');
        error.status = 404;
        throw error;
    }

    // If totalSeats is being updated, recalculate availableSeats
    if (updates.totalSeats) {
        updates.availableSeats = updates.totalSeats - trip.bookedSeats.length;
    }

    Object.assign(trip, updates);
    await trip.save();
    return trip;
}

export async function deleteTrip(id) {
    const trip = await Trip.findById(id);

    if (!trip) {
        const error = new Error('Trip not found');
        error.status = 404;
        throw error;
    }

    // Check if trip has bookings
    if (trip.bookedSeats.length > 0) {
        const error = new Error('Cannot delete trip with existing bookings');
        error.status = 400;
        throw error;
    }

    await Trip.findByIdAndDelete(id);
    return { message: 'Trip deleted successfully' };
}