const express = require("express");
const authRouter = express.Router();
const auth = require("../middlewares/auth.middleware");
const { register, login, logout } = require("../controllers/auth.controllers");
const {
  loginValidator,
  registerValidator,
  validate,
} = require("../validators/auth.validators");

authRouter.post("/login", loginValidator(), validate, login);

authRouter.post("/register", registerValidator(), validate, register);

authRouter.post("/logout", auth, logout);

module.exports = authRouter;
