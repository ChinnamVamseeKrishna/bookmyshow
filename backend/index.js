const express = require("express");
require("dotenv").config();
const connectDB = require("./config/dbconfig");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoute");

const app = express();
app.use(express.json());
connectDB();

//Routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);

app.listen(8082, () => {
  console.log("Server is running on port 8082");
});
