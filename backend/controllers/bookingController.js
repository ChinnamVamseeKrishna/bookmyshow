const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const YOUR_DOMAIN = "http://localhost:3000";
const makePayment = async (req, res) => {
  const { amount, show, seats, user } = req.body;
  console.log("here");

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: parseInt(amount),
            product_data: {
              name: "Movie Tickets",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      ui_mode: "custom",
      return_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        amount,
        showId: show?._id,
        seats: seats?.join(";"),
        userId: user?._id,
      },
    });
    return res.status(200).json({
      clientSecret: session.client_secret,
      transactionId: session.id,
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
    const booking = new Booking(req.body);
    await booking.save();

    const show = await Show.findById(req.body.show).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, {
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
