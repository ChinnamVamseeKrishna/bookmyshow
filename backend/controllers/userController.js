const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const user = new User({ name, email, password, isAdmin });
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "Registration successful", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }
    if (req.body.password !== user.password) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    res.status(200).json({
      message: "Login successful",
      user: user,
      data: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res
      .status(200)
      .json({ data: user, message: "You are authorized", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };
