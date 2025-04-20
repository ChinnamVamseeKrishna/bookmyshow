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

const app = express();
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
