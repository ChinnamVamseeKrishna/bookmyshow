const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/dbconfig");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoute");
const bookingRouter = require("./routes/bookingRoute");
const path = require("path");
const port = process.env.PORT || 8082;
// const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();
// app.enable("trust proxy");
// app.use(helmet.contentSecurityPolicy({
//   directives:{
//     default:["'self'"],
//     scriptSrc:["'self'", "'unsafe-inline'"],
//     styleSrc:["'self'", "https://fonts.googleapis.com"],
//     fontSrc:["'self'", "https://fonts.gstatic.com"],
//     imgSrc:["'self'", "data:"],
//   }
// }))
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://bookmyshow-c0q5.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(/(.*)/, cors());

const clientBuildPath = path.join(__dirname, "../frontend/build");

app.use(express.static(clientBuildPath));

app.use(express.json());
connectDB();

// const limiter = rateLimit({
//   validate: { xForwardedForHeader: false },
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP",
// });

// app.use(limiter);

//Routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/booking", bookingRouter);

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});
