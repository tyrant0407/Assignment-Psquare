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
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    seatMap: { type: [seatSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

tripSchema.index({ from: 1, to: 1, dateTime: 1 });

export const Trip = mongoose.model("Trip", tripSchema);
