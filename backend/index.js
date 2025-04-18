const express = require("express");
require("dotenv").config();
const connectDB = require("./config/dbconfig");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoute");
const bookingRouter = require("./routes/bookingRoute");
const bodyParser = require("body-parser");
const bookingModel = require("./models/bookingModel");
const showModel = require("./models/showModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_fa3aee7fcfa7241055bd54a9f249d2a351f6c0498e91e5e23dcc016430243c5d"
      );
    } catch (err) {
      console.log(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata.userId;
      const showId = session.metadata.showId;
      const seats = session.metadata.seats.split(";");

      try {
        const booking = new bookingModel({
          user: userId,
          show: showId,
          seats: seats,
          transactionId: session.id,
        });
        await booking.save();

        const show = await showModel.findById(showId).populate("movie");
        const updatedBookedSeats = [...show.bookedSeats, ...seats];
        await showModel.findByIdAndUpdate(showId, {
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
    }
    console.log("Webhook received");
  }
);

app.use(express.json());
connectDB();

//Routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/booking", bookingRouter);

app.listen(8082, () => {
  console.log("Server is running on port 8082");
});
