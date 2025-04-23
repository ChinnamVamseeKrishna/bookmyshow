const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ message: "Invalid or expired token", error: error?.message });
  }
};

module.exports = auth;
