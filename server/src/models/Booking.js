import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  selectedSeats: [{
    type: String,
    required: true
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  bookingReference: {
    type: String,
    unique: true
  },
  // Payment details will be collected during payment processing
  paymentDetails: {
    name: {
      type: String
    },
    email: {
      type: String
    },
    phonenumber: {
      type: String
    }
  }
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

// Ensure bookingReference is always present before validation
bookingSchema.pre('validate', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

// Populate trip and user data when querying
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'trip',
    select: 'from to dateTime price totalSeats availableSeats status'
  }).populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;