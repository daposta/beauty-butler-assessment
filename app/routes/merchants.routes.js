const isMerchant = require("../middlewares/merchant.middleware");
const auth = require("../middlewares/auth.middleware");
const {
  fetchSchedules,
  createSchedule,
  fetchAppointments,
  fetchMyAppointments,
  completeAppointment,
  cancelAppointment,
} = require("../controllers/merchants.controller");
const {
  validateSchedule,
  validate,
  cancelAppointmentValidation,
  completeAppointmentValidation,
} = require("../validators/merchant.validators");

const merchantRoutes = require("express").Router();

merchantRoutes.get("/schedules", auth, isMerchant, fetchSchedules);
merchantRoutes.get("/appointments", auth, isMerchant, fetchMyAppointments);
merchantRoutes.put(
  "/appointments/cancel/:id",
  auth,
  isMerchant,
  cancelAppointmentValidation,
  validate,
  cancelAppointment
);
merchantRoutes.put(
  "/appointments/complete/:id",
  auth,
  isMerchant,
  completeAppointmentValidation,
  validate,
  completeAppointment
);

merchantRoutes.post(
  "/schedules",
  auth,
  isMerchant,
  validateSchedule,
  validate,
  createSchedule
);

module.exports = merchantRoutes;
