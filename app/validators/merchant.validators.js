const { body, param, validationResult } = require("express-validator");
const { findSchedule } = require("../services/merchant.service");
const { findAppointmentById } = require("../services/customer.service");

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validateSchedule = [
  body("scheduleDate", "Schedule date is required")
    .isISO8601()
    .custom(async (value, { req }) => {
      console.log(req.body);
      const { startTime, endTime } = req.body;
      const existingSchedule = await findSchedule(
        req.user._id,
        value,
        startTime,
        endTime
      );

      if (existingSchedule) {
        throw new Error(
          "A schedule already exists for the given date and time"
        );
      }
    }),

  body("startTime", "Start time is required and must be in HH:mm format")
    .matches(timeFormatRegex)
    .withMessage("Start time must be in HH:mm format (e.g., 14:15)"),
  body("endTime", "End time is required and must be in HH:mm format")
    .matches(timeFormatRegex)
    .withMessage("End time must be in HH:mm format (e.g., 14:15)"),
];

const cancelAppointmentValidation = [
  param("id", "Invalid appointment ID")
    .isMongoId()
    .custom(async (value, { req }) => {
      const appointment = await findAppointmentById(value);
      //you can only modify apppoitment in 'scheduled' state
      if (appointment.status != "scheduled") {
        throw new Error("Appointment has already been treated");
      }

      //you cannot modify an appointment that is not yours
      if (appointment.merchantId.toString() != req.user._id.toString()) {
        throw new Error("You cannot modify  appointment");
      }
    }),
];

const completeAppointmentValidation = [
  param("id", "Invalid appointment ID")
    .isMongoId()
    .custom(async (value, { req }) => {
      const appointment = await findAppointmentById(value);
      //you can only modify apppoitment in 'scheduled' state
      if (appointment.status != "scheduled") {
        throw new Error("Appointment has already been treated");
      }

      //you cannot modify an appointment that is not yours
      if (appointment.merchantId.toString() != req.user._id.toString()) {
        throw new Error("You cannot modify  appointment");
      }
    }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSchedule,
  validate,
  cancelAppointmentValidation,
  completeAppointmentValidation,
};
