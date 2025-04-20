const express = require("express");
require("dotenv").config();
const connectDB = require("./config/dbconfig");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoute");
const bookingRouter = require("./routes/bookingRoute");
const path = require("path");

const app = express();
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

app.listen(8082, () => {
  console.log("Server is running on port 8082");
});
