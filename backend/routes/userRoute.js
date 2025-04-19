const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-current-user", auth, getCurrentUser);
userRouter.patch("/forgot-password", forgotPassword);
userRouter.patch("/reset-password/:email", resetPassword);

module.exports = userRouter;
