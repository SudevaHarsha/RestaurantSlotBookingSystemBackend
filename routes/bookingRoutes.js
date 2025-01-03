// backend/routes/bookingRoutes.js
const express = require('express');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const router = express.Router();

// Get all seats and their bookings
router.get('/seats', async (req, res) => {
  try {
    // Find all seats and populate their associated bookings
    const seats = await Seat.find().populate("bookings"); // 'bookings' refers to the ObjectId in the seat schema

    // Send the response with the populated data
    res.status(200).json(seats);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error fetching seats with bookings', error: error.message });
  }
});

router.post('/seats', async (req, res) => {
  const { name, booked, bookings } = req.body;

  try {
    // Validate input data
    if (!name) {
      return res.status(400).json({ msg: "Seat name is required" });
    }

    // Create a new seat instance
    const newSeat = new Seat({
      name,
      booked: booked || false, // Set default value if not provided
      bookings: []  // Set default empty array if not provided
    });

    // Save the seat to the database
    const savedSeat = await newSeat.save();

    // Send back the saved seat data in the response
    res.json(savedSeat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new booking
router.post('/create', async (req, res) => {
  const { table, date, startTime, endTime, guests, name, contact } = req.body;

  try {
    // Check if the seat is available
    const seat = await Seat.findById(table);

    if (!seat) {
      return res.status(400).json({ msg: 'Seat not found' });
    }

    const isBooked = seat.bookings.some(booking => booking.date === date && booking.startTime === startTime && booking.endTime === endTime);

    if (isBooked) {
      return res.status(400).json({ msg: 'Seat is already booked for this time' });
    }

    // Create a new booking
    const newBooking = new Booking({ table, date, startTime, endTime, guests, name, contact });
    await newBooking.save();

    // Update the seat availability
    seat.bookings.push(newBooking);
    await seat.save();

    res.status(201).json(newBooking);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
