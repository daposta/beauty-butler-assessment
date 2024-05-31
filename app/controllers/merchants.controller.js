const {
  findAppointmentsForMerchant,
  cancelAppointmentForMerchant,
  completeAppointmentForMerchant,
} = require("../services/customer.service");
const {
  saveSchedule,
  getSchedules,
  findAllAppointments,
} = require("../services/merchant.service");

const createSchedule = async (req, res) => {
  const result = await saveSchedule(req.body, req.user._id);
  res.status(201).json({ data: result });
};

const fetchSchedules = async (req, res) => {
  const result = await getSchedules(req.user._id);

  res.status(200).json({ data: result });
};

const fetchMyAppointments = async (req, res) => {
  const result = await findAppointmentsForMerchant(req.user._id);
  res.status(200).json({ data: result });
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const result = await cancelAppointmentForMerchant(id);
  res.status(200).json({ data: result });
};

const completeAppointment = async (req, res) => {
  const { id } = req.params;
  const result = await completeAppointmentForMerchant(id);
  res.status(200).json({ data: result });
};

module.exports = {
  createSchedule,
  fetchSchedules,
  fetchMyAppointments,
  cancelAppointment,
  completeAppointment,
};
