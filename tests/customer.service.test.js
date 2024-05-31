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
    it("should find appointments for a customer on a given date with a specific merchant", async () => {
      const mockAppointment = {
        appointmentDate: "2024-06-04",
        startTime: "09:00",
        endTime: "10:00",
        merchantId: "123",
        status: "scheduled",
      };
      appointmentModel.findOne.mockResolvedValue(mockAppointment);

      const appointment = await findAppointmentsForCustomer(
        "2024-06-04",
        "123",
        "09:00",
        "10:00",
        "456"
      );

      expect(appointmentModel.findOne).toHaveBeenCalledWith({
        appointmentDate: "2024-06-04",
        merchantId: "123",
        status: "scheduled",
      });
      expect(appointment).toBe(mockAppointment);
    });
  });

  describe("findAppointmentsForMerchant", () => {
    it("should find appointments for a merchant", async () => {
      const mockAppointments = [
        {
          appointmentDate: "2024-06-04",
          startTime: "09:00",
          endTime: "10:00",
          customerId: { name: "Customer1" },
        },
        {
          appointmentDate: "2024-06-05",
          startTime: "11:00",
          endTime: "12:00",
          customerId: { name: "Customer2" },
        },
      ];
      appointmentModel.find.mockResolvedValue(mockAppointments);
      appointmentModel.populate = jest.fn().mockResolvedValue(mockAppointments);

      const appointments = await findAppointmentsForMerchant("123");

      expect(appointmentModel.find).toHaveBeenCalledWith({ merchantId: "123" });
      expect(appointmentModel.populate).toHaveBeenCalledWith({
        path: "customerId",
        select: "name ",
      });
      expect(appointments).toBe(mockAppointments);
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
