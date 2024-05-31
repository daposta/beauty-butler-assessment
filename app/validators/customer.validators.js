const { body, validationResult } = require("express-validator");
const Appointment = require("../models/appointments.models");
const {
  findSchedule,
  findScheduleWithDate,
} = require("../services/merchant.service");
const { findAppointmentsForCustomer } = require("../services/customer.service");
const { convertTimeToMinutes } = require("../config/utils");

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validateAppointment = [
  body("merchantId", "Merchant ID is required").isMongoId(),
  body("appointmentDate", "Appointment date is required").isISO8601(),

  body("startTime", "Start time is required and must be in HH:mm format")
    .matches(timeFormatRegex)
    .withMessage("Start time must be in HH:mm format (e.g., 14:15)"),

  body("endTime", "End time is required and must be in HH:mm format")
    .matches(timeFormatRegex)
    .withMessage("End time must be in HH:mm format (e.g., 14:15)")
    .custom(async (endTime, { req }) => {
      const { merchantId, appointmentDate, startTime } = req.body;

      const appointmentStart = convertTimeToMinutes(startTime);
      const appointmentEnd = convertTimeToMinutes(endTime);

      if (appointmentStart > appointmentEnd) {
        throw new Error(
          "Appointment start time cannot be greater than end time"
        );
      }

      const schedule = await findScheduleWithDate(merchantId, appointmentDate);

      if (!schedule) {
        throw new Error("Merchant is not available");
      }

      if (
        !schedule ||
        new Date(`1970-01-01T${endTime}`) >
          new Date(`1970-01-01T${schedule.endTime}`)
      ) {
        throw new Error(
          "Appointment end time must be within the merchant's schedule"
        );
      }

      const matchingAppointment = await findAppointmentsForCustomer(
        appointmentDate,
        merchantId,
        startTime,
        endTime,
        req.user._id
      );

      if (matchingAppointment) {
        throw new Error("There is a conflicting appointment");
      }

      return true;
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
  validateAppointment,
  validate,
};
