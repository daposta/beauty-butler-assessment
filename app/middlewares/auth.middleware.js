// middleware/auth.js
const jwt = require("jsonwebtoken");
const { Blacklist } = require("../models/users.models");
const { findUserById } = require("../services/users.service");

const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await findUserById(decoded._id);
    if (!req.user) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
module.exports = auth;
