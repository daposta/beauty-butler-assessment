const { register, login, logout } = require("../controllers/auth.controllers");
const {
  fetchMerchants,
  createAppointment,
} = require("../controllers/customers.controller");
const auth = require("../middlewares/auth.middleware");
const isCustomer = require("../middlewares/customer.middleware");
const {
  validateAppointment,
  validate,
} = require("../validators/customer.validators");

const customerRoutes = require("express").Router();

customerRoutes.get("/merchants", auth, isCustomer, fetchMerchants);

customerRoutes.post(
  "/appointments",
  auth,
  isCustomer,
  validateAppointment,
  validate,
  createAppointment
);

// routes.post("/logout", logout);

module.exports = customerRoutes;
