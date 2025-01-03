const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat', // Replace 'Seat' with 'Table' if you have a separate Table model
      required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guests: { type: Number, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
