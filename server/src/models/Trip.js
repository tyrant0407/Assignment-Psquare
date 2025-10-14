import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  arrivalDate: {
    type: Date
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  bookedSeats: [{
    seatNumber: String,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  image: {
    type: String
  },
  amenities: [{
    type: String
  }],
  busType: {
    type: String,
    enum: ['ac', 'non-ac', 'sleeper', 'semi-sleeper'],
    default: 'ac'
  },
  operator: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate available seats before saving
tripSchema.pre('save', function (next) {
  if (this.bookedSeats) {
    this.availableSeats = this.totalSeats - this.bookedSeats.length;
  }
  next();
});

// Index for search functionality
tripSchema.index({ from: 1, to: 1, departureDate: 1 });
tripSchema.index({ price: 1 });
tripSchema.index({ departureDate: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;