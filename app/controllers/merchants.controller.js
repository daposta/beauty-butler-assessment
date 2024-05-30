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

const fetchAppointments = (req, res) => {
  const { schedule } = req.body;
  res.status(201).json(schedule);
};

module.exports = {
  createSchedule,
  fetchSchedules,
  fetchAppointments,
};
