const bookingRouter = require("express").Router();
const {
  makePayment,
  bookShow,
  getAllBookings,
} = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");

bookingRouter.post("/make-payment", authMiddleware, makePayment);
bookingRouter.post("/book-show", authMiddleware, bookShow);
bookingRouter.get("/get-all-bookings", authMiddleware, getAllBookings);

module.exports = bookingRouter;
