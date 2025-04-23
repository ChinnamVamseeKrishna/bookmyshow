const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const { EmailHelper } = require("../utils/emailHelper");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const YOUR_DOMAIN = "http://localhost:3000";
const makePayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount), // amount in cents
      currency: "usd",
    });
    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    });
  } catch (error) {
    console.log("Payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};

const bookShow = async (req, res) => {
  try {
    const { user, show, seats, transactionId } = req.body;
    const booking = new Booking({
      user,
      show,
      seats,
      transactionId,
    });
    await booking.save();

    const showEntity = await Show.findById(show).populate("movie");
    const updatedBookedSeats = [...showEntity.bookedSeats, ...seats];
    await Show.findByIdAndUpdate(showEntity._id, {
      bookedSeats: updatedBookedSeats,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "Theatre",
        },
      });

    await EmailHelper("ticketTemplate.html", populatedBooking.user.email, {
      name: populatedBooking.user.name,
      movie: populatedBooking.show.movie.name,
      theatre: populatedBooking.show.theatre.name,
      date: populatedBooking.show.date,
      time: populatedBooking.show.time,
      seats: populatedBooking.seats,
      amount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
      transactionid: populatedBooking.transactionId,
    });

    res.status(200).json({
      success: true,
      message: "Booking successful",
      data: booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", success: false });
  }
};

module.exports = {
  makePayment,
  bookShow,
  getAllBookings,
};
