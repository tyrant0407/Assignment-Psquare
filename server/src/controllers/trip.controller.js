import Trip from '../models/Trip.js';
import { createTripService, findAllTripService, findbyIdTripService, searchTripService } from '../services/trip.service.js';


// Get all trips
export const getAllTrips = async (req, res, next) => {
    try {
        const trips = await findAllTripService();
        res.json({ success: true, data: trips });
    } catch (err) {
        next(err);
    }
}
// Search trips
export const searchTrips = async (req, res, next) => {
    try {
        const { from, to, date, page, limit } = req.query;

        const docs = await searchTripService({ from, to, date, page, limit })

        res.json({ success: true, data: docs });
    } catch (err) {
        next(err);
    }
}
// Get trip by ID
export const getTripById = async (req, res, next) => {
    try {
        const trip = await findbyIdTripService({
            id: req.params.id,
            isDeleted: false,
        })
        if (!trip)
            return res
                .status(404)
                .json({ success: false, message: "Trip not found" });
        res.json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
};

// Create trip (admin only)
export const createTrip = async (req, res, next) => {
    try {
        const {
            from,
            to,
            dateTime,
            totalSeats,
            price,
            duration,
            title,
            departureDate,
            originalPrice,
            discount,
            image,
            imgUrl,
            rating,
            reviewCount,
            isPopular
        } = req.body;

        const userId = req.user.id;

        const tripData = {
            from,
            to,
            dateTime,
            totalSeats,
            price,
            duration,
            userId,
            ...(title && { title }),
            ...(departureDate && { departureDate }),
            ...(originalPrice && { originalPrice }),
            ...(discount !== undefined && { discount }),
            ...(image && { image }),
            ...(imgUrl && { imgUrl }),
            ...(rating !== undefined && { rating }),
            ...(reviewCount !== undefined && { reviewCount }),
            ...(isPopular !== undefined && { isPopular })
        };

        const trip = await createTripService(tripData);
        res.status(201).json({ success: true, data: trip });
    } catch (err) {
        next(err);
    }
}
// Update trip (admin only)
export const updateTrip = async (req, res, next) => {
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
};

// Delete trip (admin only)
export const deleteTrip = async (req, res, next) => {
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
};