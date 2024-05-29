const express = require("express");
const authRouter = express.Router();
const { register, login, logout } = require("../controllers/auth.controllers");
const {
  loginValidator,
  registerValidator,
  validate,
} = require("../validators/auth.validators");
const validatorMiddleware = require("../middlewares/validators.middleware");

console.log("inside auth");
authRouter.post("/login", loginValidator(), validate, login);

authRouter.post("/register", registerValidator(), validate, register);

authRouter.post("/logout", logout);

module.exports = authRouter;
