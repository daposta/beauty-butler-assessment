const express = require("express");
const authRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  registerUser,
  loginUserWithPassword,
  logout,
} = require("../controllers/auth.controllers");
const {
  loginValidator,
  registerValidator,
  validate,
} = require("../validators/auth.validators");

authRouter.post("/login", loginValidator(), validate, loginUserWithPassword);

authRouter.post("/register", registerValidator(), validate, registerUser);

authRouter.post("/logout", auth, logout);

module.exports = authRouter;
