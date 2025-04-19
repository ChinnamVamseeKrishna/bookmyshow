const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
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

module.exports = {
  makePayment,
  bookShow,
};
