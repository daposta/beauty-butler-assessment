const scheduleModel = require("../models/merchants.models");
const userModel = require("../models/users.models");
const { findAppointmentsForMerchant } = require("./customer.service");

const getSchedules = async (userId) => {
  const data = await scheduleModel.find({ merchantId: userId });

  return data;
};

const saveSchedule = async (payload, userId) => {
  payload["merchantId"] = userId;
  const newSchedule = await scheduleModel.create(payload);
  return newSchedule;
};

const findSchedule = async (merchantId, scheduleDate) => {
  return await scheduleModel.findOne({
    merchantId,
    scheduleDate,
  });
};

const findAllMerchants = async () => {
  return await userModel
    .find({ role: "merchant" })
    .select("-password -isActive -email -role -createdAt -updatedAt -__v");
};

module.exports = {
  getSchedules,
  saveSchedule,
  findSchedule,
  findAllMerchants,
};
