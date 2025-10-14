import Trip from '../models/Trip.js';
import generateSeatMap from '../utils/generateSeatMap.js'

// Helper function to transform MongoDB document to frontend-compatible format
const transformTripForFrontend = (trip) => {
    if (!trip) return null;

    const tripObj = trip.toObject ? trip.toObject() : trip;
    return {
        ...tripObj,
        id: tripObj._id.toString(),
        seatsAvailable: tripObj.availableSeats, // Ensure seatsAvailable is set
    };
};

export async function findAllTripService() {
    const trips = await Trip.find({ isDeleted: false, status: 'active' })
        .sort({ createdAt: -1 });

    if (!trips || trips.length === 0) {
        return []; // Return empty array instead of throwing error
    }

    return trips.map(transformTripForFrontend);
}

export async function searchTripService({ from, to, date, page = 1, limit = 50 }) {
    if (from) from = from.toLowerCase();
    if (to) to = to.toLowerCase();

    const filter = { isDeleted: false, availableSeats: { $gt: 0 } };
    if (from) filter.from = new RegExp(`^${from}`, "i");
    if (to) filter.to = new RegExp(`^${to}`, "i");
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
        .select("title from to dateTime departureDate duration price originalPrice discount availableSeats seatsAvailable image imgUrl rating reviewCount isPopular");

    if (!docs || docs.length === 0) {
        return []; // Return empty array instead of throwing error
    }

    return docs.map(transformTripForFrontend);
}

export async function findbyIdTripService({ id, isDeleted = false }) {
    const trip = await Trip.findOne({
        _id: id,
        isDeleted: isDeleted,
    });

    if (!trip) {
        const err = new Error("No trips found");
        err.status = 404;
        throw err;
    }

    return transformTripForFrontend(trip);
}

export async function createTripService(tripData) {
    const {
        from,
        to,
        dateTime,
        totalSeats,
        price,
        duration,
        userId,
        title,
        departureDate,
        originalPrice,
        discount,
        image,
        imgUrl,
        rating,
        reviewCount,
        isPopular
    } = tripData;

    const normalizedFrom = from.toLowerCase();
    const normalizedTo = to.toLowerCase();

    // Convert duration from minutes to "Xh Ymin" format if it's a number
    let formattedDuration = duration;
    if (typeof duration === 'number') {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        formattedDuration = `${hours}h ${minutes}min`;
    }

    // Prepare trip data
    const tripCreateData = {
        from: normalizedFrom,
        to: normalizedTo,
        dateTime,
        totalSeats,
        price,
        duration: formattedDuration,
        availableSeats: totalSeats,
        seatMap: generateSeatMap(totalSeats),
        createdBy: userId,
    };

    // Add optional fields if provided
    if (title) tripCreateData.title = title;
    if (departureDate) tripCreateData.departureDate = departureDate;
    if (originalPrice !== undefined) tripCreateData.originalPrice = originalPrice;
    if (discount !== undefined) tripCreateData.discount = discount;
    if (image) tripCreateData.image = image;
    if (imgUrl) tripCreateData.imgUrl = imgUrl;
    if (rating !== undefined) tripCreateData.rating = rating;
    if (reviewCount !== undefined) tripCreateData.reviewCount = reviewCount;
    if (isPopular !== undefined) tripCreateData.isPopular = isPopular;

    const trip = await Trip.create(tripCreateData);

    if (!trip) {
        const err = new Error("Failed to create Trip");
        err.status = 500;
        throw err;
    }

    return transformTripForFrontend(trip);
}