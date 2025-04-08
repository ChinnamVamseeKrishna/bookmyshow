const mongoose = require("mongoose");

const dbURL = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;
