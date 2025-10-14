import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

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
        transactionId: 'DUMMY_' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase(),
        message: 'Payment processed successfully'
    };
};

// Future Razorpay integration placeholder
const processRazorpayPayment = async (paymentData) => {
    // TODO: Implement Razorpay integration
    // This function will be replaced when integrating with Razorpay
    throw new Error('Razorpay integration not implemented yet');
};

export async function processPayment({ bookingId, paymentMethod, userId, ...paymentDetails }) {
    // Find and validate booking
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
        const error = new Error('Booking not found');
        error.status = 404;
        throw error;
    }

    if (booking.paymentStatus === 'paid') {
        const error = new Error('Payment already completed for this booking');
        error.status = 400;
        throw error;
    }

    if (booking.status === 'cancelled') {
        const error = new Error('Cannot process payment for cancelled booking');
        error.status = 400;
        throw error;
    }

    // Create payment record
    const payment = new Payment({
        booking: bookingId,
        user: userId,
        amount: booking.totalAmount,
        paymentMethod,
        status: 'processing'
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

        // Update booking status
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        booking.paymentId = payment._id;
        await booking.save();

        return {
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
                paymentStatus: booking.paymentStatus
            }
        };

    } catch (paymentError) {
        // Update payment status on failure
        payment.status = 'failed';
        payment.failureReason = paymentError.message;
        await payment.save();

        const error = new Error(`Payment failed: ${paymentError.message}`);
        error.status = 400;
        throw error;
    }
}

export async function getPaymentById(id, userId) {
    const payment = await Payment.findOne({ _id: id, user: userId });

    if (!payment) {
        const error = new Error('Payment not found');
        error.status = 404;
        throw error;
    }

    return payment;
}

export async function getUserPayments({ userId, page = 1, limit = 10, status }) {
    const filter = { user: userId };
    if (status) {
        filter.status = status;
    }

    const payments = await Payment.find(filter)
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

export async function refundPayment({ paymentId, refundAmount, reason, userId }) {
    const payment = await Payment.findOne({ _id: paymentId, user: userId });

    if (!payment) {
        const error = new Error('Payment not found');
        error.status = 404;
        throw error;
    }

    if (payment.status !== 'completed') {
        const error = new Error('Can only refund completed payments');
        error.status = 400;
        throw error;
    }

    const refundAmountFinal = refundAmount || payment.amount;

    if (refundAmountFinal > payment.amount) {
        const error = new Error('Refund amount cannot exceed payment amount');
        error.status = 400;
        throw error;
    }

    // Process dummy refund
    payment.status = 'refunded';
    payment.refundAmount = refundAmountFinal;
    payment.refundDate = new Date();
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
        booking.paymentStatus = 'refunded';
        booking.status = 'cancelled';
        await booking.save();
    }

    return {
        paymentId: payment._id,
        refundAmount: refundAmountFinal,
        refundDate: payment.refundDate,
        reason
    };
}

export async function getPaymentStatus(bookingId, userId) {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
        const error = new Error('Booking not found');
        error.status = 404;
        throw error;
    }

    let payment = null;
    if (booking.paymentId) {
        payment = await Payment.findById(booking.paymentId);
    }

    return {
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
    };
}