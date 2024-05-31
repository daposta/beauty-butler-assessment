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
  findAppointmentsForMerchant,
  cancelAppointmentForMerchant,
  completeAppointmentForMerchant,
} = require("../services/customer.service");

jest.mock("../app/services/merchant.service");
jest.mock("../app/services/customer.service");

describe("Merchants Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      user: { _id: "merchantId" },
      params: {},
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
      const mockSchedule = { _id: "scheduleId", merchantId: "merchantId" };
      saveSchedule.mockResolvedValue(mockSchedule);

      await createSchedule(req, res, next);

      expect(saveSchedule).toHaveBeenCalledWith(req.body, req.user._id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockSchedule });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      saveSchedule.mockRejectedValue(error);

      await createSchedule(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("fetchSchedules", () => {
    it("should fetch all schedules for the merchant", async () => {
      const mockSchedules = [{ _id: "scheduleId1" }, { _id: "scheduleId2" }];
      getSchedules.mockResolvedValue(mockSchedules);

      await fetchSchedules(req, res, next);

      expect(getSchedules).toHaveBeenCalledWith(req.user._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockSchedules });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      getSchedules.mockRejectedValue(error);

      await fetchSchedules(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("fetchMyAppointments", () => {
    it("should fetch all appointments for the merchant", async () => {
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

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      findAppointmentsForMerchant.mockRejectedValue(error);

      await fetchMyAppointments(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("cancelAppointment", () => {
    it("should cancel the appointment and return it", async () => {
      req.params.id = "appointmentId";
      const mockAppointment = { _id: "appointmentId", status: "cancelled" };
      cancelAppointmentForMerchant.mockResolvedValue(mockAppointment);

      await cancelAppointment(req, res, next);

      expect(cancelAppointmentForMerchant).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointment });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      cancelAppointmentForMerchant.mockRejectedValue(error);

      await cancelAppointment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("completeAppointment", () => {
    it("should complete the appointment and return it", async () => {
      req.params.id = "appointmentId";
      const mockAppointment = { _id: "appointmentId", status: "completed" };
      completeAppointmentForMerchant.mockResolvedValue(mockAppointment);

      await completeAppointment(req, res, next);

      expect(completeAppointmentForMerchant).toHaveBeenCalledWith(
        req.params.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointment });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      completeAppointmentForMerchant.mockRejectedValue(error);

      await completeAppointment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
