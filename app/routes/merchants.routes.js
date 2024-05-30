const isMerchant = require("../middlewares/merchant.middleware");
const auth = require("../middlewares/auth.middleware");
const {
  fetchSchedules,
  createSchedule,
  fetchAppointments,
} = require("../controllers/merchants.controller");
const {
  validateSchedule,
  validate,
} = require("../validators/merchant.validators");

const merchantRoutes = require("express").Router();

merchantRoutes.get("/schedules", auth, isMerchant, fetchSchedules);

merchantRoutes.post(
  "/schedules",
  auth,
  isMerchant,
  validateSchedule,
  validate,
  createSchedule
);

// merchantRoutes.post("/appointments", auth, isMerchant, fetchAppointments);

module.exports = merchantRoutes;
