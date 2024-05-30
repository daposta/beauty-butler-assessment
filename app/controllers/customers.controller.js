const { saveAppointment } = require("../services/customer.service");
const { findAllMerchants } = require("../services/merchant.service");

const createAppointment = async (req, res) => {
  try {
    const result = await saveAppointment(req.body, req.user._id);
    res.status(201).json({ data: result });
  } catch (error) {
    console.log(error);
  }
};

const fetchMerchants = async (req, res) => {
  try {
    const result = await findAllMerchants();
    res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createAppointment, fetchMerchants };
