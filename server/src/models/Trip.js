import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNo: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true }, // Auto-generated from "from → to" if not provided
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    departureDate: { type: String }, // Format: YYYY-MM-DD, derived from dateTime if not provided
    duration: { type: String, required: true, match: /^\d+h\s\d+min$/ },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 }, // Original price before discount
    discount: { type: Number, min: 0, max: 100, default: 0 }, // Discount percentage
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    seatsAvailable: { type: Number, min: 0 }, // Alias for availableSeats for frontend compatibility
    seatMap: { type: [seatSchema], default: [] },
    image: { type: String }, // Image URL
    imgUrl: { type: String }, // Keep existing field for backward compatibility
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isPopular: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Pre-save middleware to auto-generate fields
tripSchema.pre('save', function (next) {
  // Auto-generate title if not provided
  if (!this.title) {
    this.title = `${this.from} → ${this.to}`;
  }

  // Auto-generate departureDate if not provided
  if (!this.departureDate && this.dateTime) {
    this.departureDate = this.dateTime.toISOString().split('T')[0];
  }

  // Sync seatsAvailable with availableSeats
  if (this.availableSeats !== undefined) {
    this.seatsAvailable = this.availableSeats;
  }

  // Calculate discount if originalPrice is provided
  if (this.originalPrice && this.price && !this.discount) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  // Set originalPrice to price if not provided and no discount
  if (!this.originalPrice && this.price) {
    this.originalPrice = this.price;
  }

  next();
});

tripSchema.index({ from: 1, to: 1, dateTime: 1 });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip