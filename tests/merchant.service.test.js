const scheduleModel = require("../app/models/merchants.models");
const { User } = require("../app/models/users.models");
const {
  getSchedules,
  saveSchedule,
  findSchedule,
  findAllMerchants,
  findScheduleWithDate,
} = require("../app/services/merchant.service");

jest.mock("../app/models/merchants.models");
jest.mock("../app/models/users.models");

describe("Merchant Service", () => {
  describe("getSchedules", () => {
    it("should return schedules for a given merchant", async () => {
      const userId = "merchantId";
      const mockSchedules = [{}, {}];
      scheduleModel.find.mockResolvedValue(mockSchedules);

      const result = await getSchedules(userId);

      expect(scheduleModel.find).toHaveBeenCalledWith({ merchantId: userId });
      expect(result).toEqual(mockSchedules);
    });
  });

  describe("saveSchedule", () => {
    it("should save a new schedule for a merchant", async () => {
      const userId = "merchantId";
      const payload = {
        scheduleDate: "2024-06-04",
        startTime: "9:00",
        endTime: "10:00",
      };
      const newSchedule = { ...payload, merchantId: userId };
      scheduleModel.create.mockResolvedValue(newSchedule);

      const result = await saveSchedule(payload, userId);

      expect(scheduleModel.create).toHaveBeenCalledWith(newSchedule);
      expect(result).toEqual(newSchedule);
    });
  });

  describe("findSchedule", () => {
    it("should find a schedule for a merchant with specific details", async () => {
      const merchantId = "merchantId";
      const scheduleDate = "2024-06-04";
      const startTime = "9:00";
      const endTime = "10:00";
      const mockSchedule = { merchantId, scheduleDate, startTime, endTime };
      scheduleModel.findOne.mockResolvedValue(mockSchedule);

      const result = await findSchedule(
        merchantId,
        scheduleDate,
        startTime,
        endTime
      );

      expect(scheduleModel.findOne).toHaveBeenCalledWith({
        merchantId,
        scheduleDate,
        startTime,
        endTime,
      });
      expect(result).toEqual(mockSchedule);
    });
  });

  describe("findScheduleWithDate", () => {
    it("should find a schedule for a merchant with a specific date", async () => {
      const merchantId = "merchantId";
      const scheduleDate = "2024-06-04";
      const mockSchedule = { merchantId, scheduleDate };
      scheduleModel.findOne.mockResolvedValue(mockSchedule);

      const result = await findScheduleWithDate(merchantId, scheduleDate);

      expect(scheduleModel.findOne).toHaveBeenCalledWith({
        merchantId,
        scheduleDate,
      });
      expect(result).toEqual(mockSchedule);
    });
  });
});
