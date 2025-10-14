import Joi from 'joi';
import * as paymentService from '../services/payment.service.js';

// Validation schemas
export const schemas = {
    processPayment: Joi.object({
        bookingId: Joi.string().required(),
        paymentMethod: Joi.string().valid('dummy', 'razorpay').default('dummy'),
        // Dummy payment fields
        cardNumber: Joi.string().when('paymentMethod', {
            is: 'dummy',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        cardHolder: Joi.string().when('paymentMethod', {
            is: 'dummy',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        expiryMonth: Joi.string().when('paymentMethod', {
            is: 'dummy',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        expiryYear: Joi.string().when('paymentMethod', {
            is: 'dummy',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        cvv: Joi.string().when('paymentMethod', {
            is: 'dummy',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        // Razorpay fields (for future use)
        razorpayOrderId: Joi.string().optional(),
        razorpayPaymentId: Joi.string().optional(),
        razorpaySignature: Joi.string().optional()
    }),

    refundPayment: Joi.object({
        paymentId: Joi.string().required(),
        refundAmount: Joi.number().positive().optional(),
        reason: Joi.string().required()
    })
};

// Process payment
export const processPayment = async (req, res, next) => {
    try {
        const { bookingId, paymentMethod, ...paymentDetails } = req.body;
        const userId = req.user.id;

        const result = await paymentService.processPayment({
            bookingId,
            paymentMethod,
            userId,
            ...paymentDetails
        });

        res.json({
            success: true,
            message: 'Payment processed successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// Get payment details
export const getPaymentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const payment = await paymentService.getPaymentById(id, userId);

        res.json({
            success: true,
            payment
        });
    } catch (error) {
        next(error);
    }
};

// Get user's payment history
export const getUserPayments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const result = await paymentService.getUserPayments({
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

// Refund payment (dummy implementation)
export const refundPayment = async (req, res, next) => {
    try {
        const { paymentId, refundAmount, reason } = req.body;
        const userId = req.user.id;

        const refund = await paymentService.refundPayment({
            paymentId,
            refundAmount,
            reason,
            userId
        });

        res.json({
            success: true,
            message: 'Refund processed successfully',
            refund
        });
    } catch (error) {
        next(error);
    }
};

// Get payment status
export const getPaymentStatus = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        const result = await paymentService.getPaymentStatus(bookingId, userId);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};