// backend/models/Seat.js
const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  booked: { type: Boolean, default: false },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }],
});

module.exports = mongoose.model('Seat', seatSchema);
