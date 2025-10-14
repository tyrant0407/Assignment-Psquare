import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { User } from '../models/User.js';

export async function getDashboardStats() {
    const [totalTrips, totalBookings, totalUsers, totalRevenue] = await Promise.all([
        Trip.countDocuments({ status: 'active' }),
        Booking.countDocuments(),
        User.countDocuments(),
        Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
    ]);

    return {
        totalTrips,
        totalBookings,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0
    };
}

export async function getAllUsers({ page = 1, limit = 10, role }) {
    const filter = {};
    if (role) {
        filter.role = role;
    }

    const users = await User.find(filter)
        .select('-passwordHash -tokenVersion')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    return {
        users,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        }
    };
}

export async function getAllBookings({ page = 1, limit = 10, status }) {
    const filter = {};
    if (status) {
        filter.status = status;
    }

    const bookings = await Booking.find(filter)
        .populate('user', 'name email')
        .populate('trip', 'title from to departureDate')
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

export async function getAllPayments({ page = 1, limit = 10, status }) {
    const filter = {};
    if (status) {
        filter.status = status;
    }

    const payments = await Payment.find(filter)
        .populate('user', 'name email')
        .populate('booking', 'bookingReference')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    return {
        payments,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalPayments: total
        }
    };
}

export async function updateUserRole(userId, newRole) {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    user.role = newRole;
    await user.save();

    return user;
}

export async function deleteUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }

    // Check if user has active bookings
    const activeBookings = await Booking.countDocuments({
        user: userId,
        status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
        const error = new Error('Cannot delete user with active bookings');
        error.status = 400;
        throw error;
    }

    await User.findByIdAndDelete(userId);
    return { message: 'User deleted successfully' };
}