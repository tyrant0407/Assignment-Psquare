import Joi from 'joi';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Trip from '../models/Trip.js';
import { createError } from '../utils/error.js';

// Validation schemas
export const schemas = {
    processPayment: Joi.object({
        bookingId: Joi.string().required(),
        // Required payment details
        name: Joi.string().required().trim(),
        email: Joi.string().email().required(),
        phonenumber: Joi.string().required(),
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

// Dummy payment processor
const processDummyPayment = async (paymentData) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
        throw new Error('Payment failed: Insufficient funds or invalid card details');
    }

    return {
        success: true,
        transactionId: 'DUMMY_' + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase(),
        message: 'Payment processed successfully'
    };
};

// Future Razorpay integration placeholder
const processRazorpayPayment = async (paymentData) => {
    // TODO: Implement Razorpay integration
    // This function will be replaced when integrating with Razorpay
    throw new Error('Razorpay integration not implemented yet');
};

// Process payment
export const processPayment = async (req, res, next) => {
    try {
        const { bookingId, name, email, phonenumber, paymentMethod, ...paymentDetails } = req.body;
        const userId = req.user.id;

        // Find and validate booking
        const booking = await Booking.findOne({ _id: bookingId, user: userId });
        if (!booking) {
            return next(createError(404, 'Booking not found'));
        }

        if (booking.paymentStatus === 'paid') {
            return next(createError(400, 'Payment already completed for this booking'));
        }

        if (booking.status === 'cancelled') {
            return next(createError(400, 'Cannot process payment for cancelled booking'));
        }

        // Generate transaction ID
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();

        // Create payment record
        const payment = new Payment({
            booking: bookingId,
            user: userId,
            amount: booking.totalAmount,
            paymentMethod,
            status: 'processing',
            transactionId
        });

        if (paymentMethod === 'dummy') {
            payment.dummyCardNumber = paymentDetails.cardNumber?.slice(-4); // Store only last 4 digits
            payment.dummyCardHolder = paymentDetails.cardHolder;
        }

        await payment.save();

        try {
            let paymentResult;

            // Process payment based on method
            if (paymentMethod === 'dummy') {
                paymentResult = await processDummyPayment(paymentDetails);
            } else if (paymentMethod === 'razorpay') {
                paymentResult = await processRazorpayPayment(paymentDetails);
            } else {
                throw new Error('Unsupported payment method');
            }

            // Update payment status on success
            payment.status = 'completed';
            payment.paymentDate = new Date();
            if (paymentResult.transactionId) {
                payment.transactionId = paymentResult.transactionId;
            }
            await payment.save();

            // Update booking status and payment details
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            booking.paymentId = payment._id;
            booking.paymentDetails = {
                name,
                email,
                phonenumber
            };
            await booking.save();

            res.json({
                success: true,
                message: 'Payment processed successfully',
                payment: {
                    id: payment._id,
                    transactionId: payment.transactionId,
                    amount: payment.amount,
                    status: payment.status,
                    paymentDate: payment.paymentDate
                },
                booking: {
                    id: booking._id,
                    bookingReference: booking.bookingReference,
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    selectedSeats: booking.selectedSeats,
                    paymentDetails: booking.paymentDetails
                }
            });

        } catch (paymentError) {
            // Update payment status on failure
            payment.status = 'failed';
            payment.failureReason = paymentError.message;
            await payment.save();

            return next(createError(400, `Payment failed: ${paymentError.message}`));
        }

    } catch (error) {
        next(error);
    }
};

// Get payment details
export const getPaymentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const payment = await Payment.findOne({ _id: id, user: userId });

        if (!payment) {
            return next(createError(404, 'Payment not found'));
        }

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

        const filter = { user: userId };
        if (status) {
            filter.status = status;
        }

        const payments = await Payment.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Payment.countDocuments(filter);

        res.json({
            success: true,
            payments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPayments: total
            }
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

        const payment = await Payment.findOne({ _id: paymentId, user: userId });

        if (!payment) {
            return next(createError(404, 'Payment not found'));
        }

        if (payment.status !== 'completed') {
            return next(createError(400, 'Can only refund completed payments'));
        }

        const refundAmountFinal = refundAmount || payment.amount;

        if (refundAmountFinal > payment.amount) {
            return next(createError(400, 'Refund amount cannot exceed payment amount'));
        }

        // Process dummy refund
        payment.status = 'refunded';
        payment.refundAmount = refundAmountFinal;
        payment.refundDate = new Date();
        await payment.save();

        // Update booking status and free up seats
        const booking = await Booking.findById(payment.booking).populate('trip');
        if (booking) {
            booking.paymentStatus = 'refunded';
            booking.status = 'cancelled';
            await booking.save();

            // Free up the seats in the trip
            if (booking.trip) {
                const trip = booking.trip;

                booking.selectedSeats.forEach(seatNumber => {
                    const seatIndex = trip.seatMap.findIndex(seat => seat.seatNo === seatNumber);
                    if (seatIndex !== -1) {
                        trip.seatMap[seatIndex].isBooked = false;
                    }
                });

                trip.availableSeats += booking.selectedSeats.length;
                await trip.save();
            }
        }

        res.json({
            success: true,
            message: 'Refund processed successfully',
            refund: {
                paymentId: payment._id,
                refundAmount: refundAmountFinal,
                refundDate: payment.refundDate,
                reason
            }
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

        const booking = await Booking.findOne({ _id: bookingId, user: userId });
        if (!booking) {
            return next(createError(404, 'Booking not found'));
        }

        let payment = null;
        if (booking.paymentId) {
            payment = await Payment.findById(booking.paymentId);
        }

        res.json({
            success: true,
            paymentStatus: booking.paymentStatus,
            bookingStatus: booking.status,
            payment: payment ? {
                id: payment._id,
                amount: payment.amount,
                status: payment.status,
                paymentMethod: payment.paymentMethod,
                transactionId: payment.transactionId,
                paymentDate: payment.paymentDate
            } : null
        });
    } catch (error) {
        next(error);
    }
};