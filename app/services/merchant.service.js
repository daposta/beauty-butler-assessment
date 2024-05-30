const scheduleModel = require("../models/merchants.models");

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

module.exports = {
  getSchedules,
  saveSchedule,
  findSchedule,
};
