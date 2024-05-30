const appointmentModel = require("../models/appointments.models");

const saveAppointment = async (payload, userId) => {
  payload["customerId"] = userId;
  const newAppointment = await appointmentModel.create(payload);
  return newAppointment;
};

const findAppointmentsForCustomer = async (
  appointmentDate,
  merchantId,
  startTime,
  endTime,
  customerId
) => {
  return await appointmentModel.findOne({
    appointmentDate,
    // startTime: { $gte: startTime },
    // endTime: { $lte: endTime },
    merchantId,

    status: "scheduled",
  });
  $or: [
    { startTime: { $gte: startTime } },
    { endTime: { $lte: endTime } },
  ].sort({
    appointmentDate: -1,
    startTime: -1,
  });
};

const findAppointmentsForMerchant = async (merchantId) => {
  const appointments = await appointmentModel
    .find({
      merchantId,
    })
    .populate({
      path: "customerId",
      select: "name ",
    });

  return appointments;
};

const findAppointmentsForMerchantWithDate = async (
  merchantId,
  appointmentDate
) => {
  const appointments = await appointmentModel.find({
    merchantId,
    appointmentDate,
  });

  return appointments;
};
const cancelAppointmentForMerchant = async (appointmentId) => {
  let appointment = await appointmentModel.findById(appointmentId);

  appointment.status = "cancelled";
  appointment = await appointment.save();
  return appointment;
};

const completeAppointmentForMerchant = async (appointmentId) => {
  let appointment = await appointmentModel.findById(appointmentId);
  appointment.status = "completed";
  appointment = await appointment.save();
  return appointment;
};

const findAppointmentById = async (appointmentId) => {
  return await appointmentModel.findById(appointmentId);
};

module.exports = {
  saveAppointment,
  findAppointmentsForCustomer,
  findAppointmentsForMerchant,
  cancelAppointmentForMerchant,
  completeAppointmentForMerchant,
  findAppointmentById,
  findAppointmentsForMerchantWithDate,
};
