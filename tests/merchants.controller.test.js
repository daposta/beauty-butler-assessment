const {
  createSchedule,
  fetchSchedules,
  fetchMyAppointments,
  cancelAppointment,
  completeAppointment,
} = require("../app/controllers/merchants.controller");

const {
  saveSchedule,
  getSchedules,
} = require("../app/services/merchant.service");

const {
  findAppointmentsForMerchant,
  cancelAppointmentForMerchant,
  completeAppointmentForMerchant,
} = require("../app/services/customer.service");

jest.mock("../app/services/customer.service");

jest.mock("../app/services/merchant.service", () => ({
  saveSchedule: jest.fn(),
  getSchedules: jest.fn(),
}));

describe("Merchants Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: "merchantId" },
      params: { id: "appointmentId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createSchedule", () => {
    it("should create a new schedule and return it", async () => {
      const mockRequest = { body: {}, user: { _id: "merchantId" } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockSchedule = { _id: "scheduleId", merchantId: "merchantId" };
      saveSchedule.mockResolvedValue(mockSchedule);

      await createSchedule(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockSchedule });
    });
  });

  describe("fetchSchedules", () => {
    it("should fetch schedules for the merchant", async () => {
      const mockRequest = { user: { _id: "merchantId" } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockSchedules = [{ _id: "scheduleId1" }, { _id: "scheduleId2" }];
      getSchedules.mockResolvedValue(mockSchedules);

      await fetchSchedules(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockSchedules });
    });
  });

  describe("fetchMyAppointments", () => {
    it("should fetch appointments for the merchant", async () => {
      const mockAppointments = [
        { _id: "appointmentId1" },
        { _id: "appointmentId2" },
      ];
      findAppointmentsForMerchant.mockResolvedValue(mockAppointments);

      await fetchMyAppointments(req, res, next);

      expect(findAppointmentsForMerchant).toHaveBeenCalledWith(req.user._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointments });
    });
  });

  describe("cancelAppointment", () => {
    it("should cancel an appointment and return it", async () => {
      const mockAppointment = { _id: "appointmentId", status: "cancelled" };
      cancelAppointmentForMerchant.mockResolvedValue(mockAppointment);

      await cancelAppointment(req, res, next);

      expect(cancelAppointmentForMerchant).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointment });
    });
  });

  describe("completeAppointment", () => {
    it("should complete an appointment and return it", async () => {
      const mockAppointment = { _id: "appointmentId", status: "completed" };
      completeAppointmentForMerchant.mockResolvedValue(mockAppointment);

      await completeAppointment(req, res, next);

      expect(completeAppointmentForMerchant).toHaveBeenCalledWith(
        req.params.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointment });
    });
  });
});
