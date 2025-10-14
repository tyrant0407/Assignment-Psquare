import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['dummy', 'razorpay', 'stripe', 'paypal'],
    default: 'dummy'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  // For future Razorpay integration
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  // Dummy payment fields
  dummyCardNumber: {
    type: String
  },
  dummyCardHolder: {
    type: String
  },
  // Payment metadata
  paymentDate: {
    type: Date
  },
  failureReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate transaction ID before saving
paymentSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

// Ensure transactionId is always present before validation
paymentSchema.pre('validate', function (next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

// Populate booking and user data when querying
paymentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'booking',
    select: 'bookingReference totalAmount status'
  }).populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;