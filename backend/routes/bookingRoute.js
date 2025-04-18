const bookingRouter = require("express").Router();
const { makePayment, bookShow } = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");

bookingRouter.post("/make-payment", authMiddleware, makePayment);
bookingRouter.post("/book-show", authMiddleware, bookShow);

module.exports = bookingRouter;
