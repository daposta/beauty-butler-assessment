const scheduleModel = require("../models/merchants.models");
const userModel = require("../models/users.models");
const {
  getSchedules,
  saveSchedule,
  findSchedule,
  findAllMerchants,
} = require("../services/merchant.service");

// Mock the dependencies
jest.mock("../models/merchants.models");
jest.mock("../models/users.models");

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
        { name: "Merchant1", email: "merchant1@example.com", role: "merchant" },
        { name: "Merchant2", email: "merchant2@example.com", role: "merchant" },
      ];

      // Setup the mock chain
      const findMock = {
        select: jest.fn().mockResolvedValue(mockMerchants),
      };
      userModel.find.mockReturnValue(findMock);

      const merchants = await findAllMerchants();

      expect(userModel.find).toHaveBeenCalledWith({ role: "merchant" });
      expect(findMock.select).toHaveBeenCalledWith(
        "-password -isActive -email -role -createdAt -updatedAt -__v"
      );
      expect(merchants).toBe(mockMerchants);
    });
  });
});
