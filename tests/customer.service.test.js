const appointmentModel = require("../app/models/appointments.models");
const {
  saveAppointment,
  findAppointmentsForCustomer,
  findAppointmentsForMerchant,
  findAppointmentsForMerchantWithDate,
  cancelAppointmentForMerchant,
  completeAppointmentForMerchant,
  findAppointmentById,
} = require("../app/services/customer.service");

// Mock the dependencies
jest.mock("../app/models/appointments.models");

describe("Customer Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveAppointment", () => {
    it("should save a new appointment and return it", async () => {
      const payload = {
        appointmentDate: "2024-06-04",
        startTime: "09:00",
        endTime: "10:00",
        merchantId: "123",
      };
      const mockAppointment = { ...payload, customerId: "456" };
      appointmentModel.create.mockResolvedValue(mockAppointment);

      const newAppointment = await saveAppointment(payload, "456");

      expect(appointmentModel.create).toHaveBeenCalledWith({
        ...payload,
        customerId: "456",
      });
      expect(newAppointment).toBe(mockAppointment);
    });
  });

  describe("findAppointmentsForCustomer", () => {
    it("should find appointments for the customer within the specified time range", async () => {
      const appointmentDate = new Date();
      const merchantId = "merchant_id";
      const startTime = new Date("2024-06-01T08:00:00Z");
      const endTime = new Date("2024-06-01T09:00:00Z");
      const customerId = "customer_id";
      const expectedAppointment = {
        _id: "appointment_id",
        appointmentDate,
        merchantId,
        startTime,
        endTime,
      };

      appointmentModel.findOne.mockResolvedValue(expectedAppointment);

      const result = await findAppointmentsForCustomer(
        appointmentDate,
        merchantId,
        startTime,
        endTime,
        customerId
      );

      expect(result).toEqual(expectedAppointment);
      expect(appointmentModel.findOne).toHaveBeenCalledWith({
        appointmentDate,
        merchantId,
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
        status: "scheduled",
      });
    });
  });
  describe("findAppointmentsForMerchant", () => {
    it("should find appointments for the merchant", async () => {
      const merchantId = "merchant_id";
      const appointments = [
        { _id: "appointment_id", customerId: "customer_id" },
      ];
      appointmentModel.find.mockResolvedValue(appointments);

      const result = await findAppointmentsForMerchant(merchantId);

      expect(result).toEqual(appointments);
      expect(appointmentModel.find).toHaveBeenCalledWith({ merchantId });
    });
  });

  describe("findAppointmentsForMerchantWithDate", () => {
    it("should find appointments for a merchant on a specific date", async () => {
      const mockAppointments = [
        { appointmentDate: "2024-06-04", startTime: "09:00", endTime: "10:00" },
      ];
      appointmentModel.find.mockResolvedValue(mockAppointments);

      const appointments = await findAppointmentsForMerchantWithDate(
        "123",
        "2024-06-04"
      );

      expect(appointmentModel.find).toHaveBeenCalledWith({
        merchantId: "123",
        appointmentDate: "2024-06-04",
      });
      expect(appointments).toBe(mockAppointments);
    });
  });

  describe("cancelAppointmentForMerchant", () => {
    it("should cancel an appointment and return it", async () => {
      const mockAppointment = { _id: "789", status: "scheduled" };
      appointmentModel.findById.mockResolvedValue(mockAppointment);
      appointmentModel.findById.mockResolvedValue({
        ...mockAppointment,
        save: jest
          .fn()
          .mockResolvedValue({ ...mockAppointment, status: "cancelled" }),
      });

      const cancelledAppointment = await cancelAppointmentForMerchant("789");

      expect(appointmentModel.findById).toHaveBeenCalledWith("789");
      expect(cancelledAppointment.status).toBe("cancelled");
    });
  });

  describe("completeAppointmentForMerchant", () => {
    it("should complete an appointment and return it", async () => {
      const mockAppointment = { _id: "789", status: "scheduled" };
      appointmentModel.findById.mockResolvedValue(mockAppointment);
      appointmentModel.findById.mockResolvedValue({
        ...mockAppointment,
        save: jest
          .fn()
          .mockResolvedValue({ ...mockAppointment, status: "completed" }),
      });

      const completedAppointment = await completeAppointmentForMerchant("789");

      expect(appointmentModel.findById).toHaveBeenCalledWith("789");
      expect(completedAppointment.status).toBe("completed");
    });
  });

  describe("findAppointmentById", () => {
    it("should find an appointment by its ID", async () => {
      const mockAppointment = {
        _id: "789",
        appointmentDate: "2024-06-04",
        startTime: "09:00",
        endTime: "10:00",
      };
      appointmentModel.findById.mockResolvedValue(mockAppointment);

      const appointment = await findAppointmentById("789");

      expect(appointmentModel.findById).toHaveBeenCalledWith("789");
      expect(appointment).toBe(mockAppointment);
    });
  });
});
