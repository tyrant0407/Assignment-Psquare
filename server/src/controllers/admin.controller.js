import Joi from 'joi';
import * as adminService from '../services/admin.service.js';
import * as tripService from '../services/trip.service.js';

// Validation schemas
export const schemas = {
    updateUserRole: Joi.object({
        userId: Joi.string().required(),
        role: Joi.string().valid('user', 'admin').required()
    })
};

// Get dashboard statistics
export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStats();

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        next(error);
    }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role } = req.query;
        const result = await adminService.getAllUsers({ page, limit, role });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookings
export const getAllBookings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const result = await adminService.getAllBookings({ page, limit, status });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get all payments
export const getAllPayments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const result = await adminService.getAllPayments({ page, limit, status });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get all trips (admin view)
export const getAllTrips = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const result = await tripService.getAllTrips({ page, limit, status });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Create trip
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

// Update trip
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

// Delete trip
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

// Update user role
export const updateUserRole = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const user = await adminService.updateUserRole(userId, role);

        res.json({
            success: true,
            message: 'User role updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await adminService.deleteUser(id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};