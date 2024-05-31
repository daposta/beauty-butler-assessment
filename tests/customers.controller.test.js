const {
  createAppointment,
  fetchMerchants,
} = require("../app/controllers/customers.controller");
const { saveAppointment } = require("../app/services/customer.service");
const { findAllMerchants } = require("../app/services/merchant.service");

jest.mock("../app/services/customer.service");
jest.mock("../app/services/merchant.service");

describe("Customer Controller", () => {
  describe("createAppointment", () => {
    it("should create an appointment and return status 201 with data", async () => {
      const req = {
        body: {
          appointmentDate: "2024-06-04",
          startTime: "09:00",
          endTime: "10:00",
          merchantId: "merchantId",
        },
        user: {
          _id: "customerId",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockAppointment = {
        _id: "appointmentId",
        appointmentDate: "2024-06-04",
        startTime: "09:00",
        endTime: "10:00",
        merchantId: "merchantId",
        customerId: "customerId",
        status: "scheduled",
      };

      saveAppointment.mockResolvedValue(mockAppointment);

      await createAppointment(req, res);

      expect(saveAppointment).toHaveBeenCalledWith(req.body, req.user._id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointment });
    });

    it("should handle errors and log them", async () => {
      const req = {
        body: {
          appointmentDate: "2024-06-04",
          startTime: "09:00",
          endTime: "10:00",
          merchantId: "merchantId",
        },
        user: {
          _id: "customerId",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error("Failed to save appointment");

      saveAppointment.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      await createAppointment(req, res);

      expect(saveAppointment).toHaveBeenCalledWith(req.body, req.user._id);
      expect(consoleSpy).toHaveBeenCalledWith(error);

      consoleSpy.mockRestore();
    });
  });

  describe("fetchMerchants", () => {
    it("should fetch all merchants and return status 200 with data", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockMerchants = [
        { _id: "merchant1", name: "Merchant 1" },
        { _id: "merchant2", name: "Merchant 2" },
      ];

      findAllMerchants.mockResolvedValue(mockMerchants);

      await fetchMerchants(req, res);

      expect(findAllMerchants).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockMerchants });
    });

    it("should handle errors and log them", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error("Failed to fetch merchants");

      findAllMerchants.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      await fetchMerchants(req, res);

      expect(findAllMerchants).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(error);

      consoleSpy.mockRestore();
    });
  });
});
