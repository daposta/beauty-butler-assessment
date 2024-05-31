const scheduleModel = require("../app/models/merchants.models");
const userModel = require("../app/models/users.models");
const {
  getSchedules,
  saveSchedule,
  findSchedule,
  findAllMerchants,
} = require("../app/services/merchant.service");

// Mock the dependencies
jest.mock("../app/models/merchants.models");
jest.mock("../app/models/users.models");

describe("Merchant Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSchedules", () => {
    it("should return schedules for a given merchant ID", async () => {
      const mockSchedules = [{ merchantId: "123", scheduleDate: "2024-06-04" }];
      scheduleModel.find.mockResolvedValue(mockSchedules);

      const schedules = await getSchedules("123");

      expect(scheduleModel.find).toHaveBeenCalledWith({ merchantId: "123" });
      expect(schedules).toBe(mockSchedules);
    });
  });

  describe("saveSchedule", () => {
    it("should save a new schedule and return it", async () => {
      const payload = {
        scheduleDate: "2024-06-04",
        startTime: "09:00",
        endTime: "17:00",
      };
      const mockSchedule = { ...payload, merchantId: "123" };
      scheduleModel.create.mockResolvedValue(mockSchedule);

      const newSchedule = await saveSchedule(payload, "123");

      expect(scheduleModel.create).toHaveBeenCalledWith({
        ...payload,
        merchantId: "123",
      });
      expect(newSchedule).toBe(mockSchedule);
    });
  });

  describe("findSchedule", () => {
    it("should find a schedule for a given merchant ID and date", async () => {
      const mockSchedule = { merchantId: "123", scheduleDate: "2024-06-04" };
      scheduleModel.findOne.mockResolvedValue(mockSchedule);

      const schedule = await findSchedule("123", "2024-06-04");

      expect(scheduleModel.findOne).toHaveBeenCalledWith({
        merchantId: "123",
        scheduleDate: "2024-06-04",
      });
      expect(schedule).toBe(mockSchedule);
    });
  });

  describe("findAllMerchants", () => {
    it("should return all merchants excluding sensitive fields", async () => {
      const mockMerchants = [
        { name: "Merchant 1", _id: "1" },
        { name: "Merchant 2", _id: "2" },
      ];

      // Correctly mock the find and select methods
      const selectMock = jest.fn().mockResolvedValue(mockMerchants);
      userModel.find.mockImplementation(() => ({ select: selectMock }));

      const merchants = await findAllMerchants();

      expect(userModel.find).toHaveBeenCalledWith({ role: "merchant" });
      expect(selectMock).toHaveBeenCalledWith(
        "-password -isActive -email -role -createdAt -updatedAt -__v"
      );
      expect(merchants).toBe(mockMerchants);
    });
  });
});
