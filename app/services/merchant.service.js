const scheduleModel = require("../models/merchants.models");
const { User } = require("../models/users.models");
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

const findSchedule = async (merchantId, scheduleDate, startTime, endTime) => {
  return await scheduleModel.findOne({
    merchantId,
    scheduleDate,
    startTime,
    endTime,
  });
};

const findScheduleWithDate = async (merchantId, scheduleDate) => {
  return await scheduleModel
    .findOne({
      merchantId,
      scheduleDate,
    })
    .sort({ updatedAt: -1 });
};

const findAllMerchants = async () => {
  return await User.find({ role: "merchant" }).select(
    "-password -isActive -email -role -createdAt -updatedAt -__v"
  );
};

module.exports = {
  getSchedules,
  saveSchedule,
  findSchedule,
  findAllMerchants,
  findScheduleWithDate,
};
