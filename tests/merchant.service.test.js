const scheduleModel = require("../app/models/merchants.models");
const userModel = require("../app/models/users.models");
const {
  getSchedules,
  saveSchedule,
  findSchedule,
  findAllMerchants,
  findScheduleWithDate,
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

  describe("findScheduleWithDate", () => {
    it("should find a schedule with given date and merchantId", async () => {
      const mockSchedule = { _id: "scheduleId", merchantId: "merchantId" };
      scheduleModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockSchedule),
      });

      const merchantId = "merchantId";
      const scheduleDate = "2024-06-04";
      const result = await findScheduleWithDate(merchantId, scheduleDate);

      expect(scheduleModel.findOne).toHaveBeenCalledWith({
        merchantId,
        scheduleDate,
      });
      expect(result).toEqual(mockSchedule);
    });
  });
  
  describe('findAllMerchants', () => {
    it('should return all merchants excluding sensitive fields', async () => {
      const mockMerchants = [
        { _id: 'merchantId1', name: 'Merchant1' },
        { _id: 'merchantId2', name: 'Merchant2' },
      ];
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockMerchants),
      });

      const result = await findAllMerchants();

      expect(User.find).toHaveBeenCalledWith({ role: 'merchant' });
      expect(result).toEqual(mockMerchants);
    });
});
