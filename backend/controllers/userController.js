const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { EmailHelper } = require("../utils/emailHelper");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  const user = new User({ name, email, password, isAdmin });
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "Registration successful", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// async function hashPassword(password) {
//   const salt = await bcrypt.genSalt(10);
//   console.log(salt);

//   const hashedPassword = await bcrypt.hash(password, salt);
//   return hashedPassword;
// }

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }
    // if (req.body.password !== user.password) {
    //   return res.status(400).json({ message: "Incorrect password" });
    // }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
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

const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const forgotPassword = async (req, res) => {
  // ask for email
  // check email in db
  // if email present generate otp, save otp in db, and send otp to email
  try {
    if (req.body.email === undefined) {
      return res.status(400).json({
        success: false,
        message: "Email required!",
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await EmailHelper("otp.html", user.email, { name: user?.name, otp: otp });
    return res.status(200).json({
      success: true,
      message: "Otp sent to your email",
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetDetails = req.body;
    if (!resetDetails.password || !resetDetails.otp) {
      return res.status(400).json({
        success: false,
        message: "Password and otp are required",
      });
    }
    const user = await User.findOne({ email: req.params.email });
    if (user === null) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Otp expired",
      });
    }
    if (user.otp !== resetDetails.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp",
      });
    }
    user.password = resetDetails.password;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Reset Successful",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  resetPassword,
  forgotPassword,
  registerUser,
  loginUser,
  getCurrentUser,
};
