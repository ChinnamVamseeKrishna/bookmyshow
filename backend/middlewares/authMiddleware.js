const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error?.message });
  }
};

module.exports = auth;
