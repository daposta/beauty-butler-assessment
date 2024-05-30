const { body, validationResult } = require("express-validator");
const Appointment = require("../models/appointments.models");
const { findSchedule } = require("../services/merchant.service");
const { findAppointmentsForCustomer } = require("../services/customer.service");
const { convertTimeToMinutes } = require("../config/utils");

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const validateAppointment = [
  body("merchantId", "Merchant ID is required").isMongoId(),
  body("appointmentDate", "Appointment date is required")
    .isISO8601()
    .custom(async (appointmentDate, { req }) => {
      const { merchantId } = req.body;

      const schedule = await findSchedule(merchantId, appointmentDate);

      const scheduleDate = schedule.scheduleDate.toISOString().substring(0, 10);

      if (!schedule || appointmentDate != scheduleDate) {
        throw new Error("Merchant is not available");
      }
      console.log("done with 1");
      // Return true if validation passes
      return true;
    }),

  body("startTime", "Start time is required and must be in HH:mm format")
    .matches(timeFormatRegex)
    .withMessage("Start time must be in HH:mm format (e.g., 14:15)")
    .custom(async (startTime, { req }) => {
      const { merchantId, appointmentDate } = req.body;
      const schedule = await findSchedule(merchantId, appointmentDate);
      console.log("object");
      console.log(
        new Date(`1970-01-01T${startTime}`),
        new Date(`1970-01-01T${schedule.startTime}`)
      );
      console.log(
        new Date(`1970-01-01T${startTime}`) >
          new Date(`1970-01-01T${schedule.startTime}`)
      );
      console.log(
        new Date(`1970-01-01T${startTime}`) ==
          new Date(`1970-01-01T${schedule.startTime}`)
      );

      console.log(
        new Date(`1970-01-01T${startTime}`) <
          new Date(`1970-01-01T${schedule.startTime}`)
      );

      // Fetch the corresponding schedule for the merchant and appointment date

      // Check if the schedule exists and if the appointment's start time is after the schedule's start time
      if (
        !schedule ||
        new Date(`1970-01-01T${startTime}`) <
          new Date(`1970-01-01T${schedule.startTime}`)
      ) {
        throw new Error(
          "Appointment start time must be within the merchant's schedule"
        );
      }

      console.log("done with 2");
      // Return true if validation passes
      return true;
    }),
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

      // Fetch the corresponding schedule for the merchant and appointment date
      const schedule = await findSchedule(merchantId, appointmentDate);

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
      console.log("duplicates");
      console.log(matchingAppointment);
      if (matchingAppointment) {
        throw new Error("There is a conflicting appointment");
      }

      console.log("done with 3");
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
