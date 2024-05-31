const {
  findAppointmentsForMerchant,
  cancelAppointmentForMerchant,
  completeAppointmentForMerchant,
} = require("../services/customer.service");
const { saveSchedule, getSchedules } = require("../services/merchant.service");

const createSchedule = async (req, res) => {
  try {
    const result = await saveSchedule(req.body, req.user._id);
    res.status(201).json({ data: result });
  } catch (error) {
    console.log(error);
  }
};

const fetchSchedules = async (req, res) => {
  try {
    const result = await getSchedules(req.user._id);

    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
  }
};

const fetchMyAppointments = async (req, res) => {
  try {
    const result = await findAppointmentsForMerchant(req.user._id);
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
  }
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
