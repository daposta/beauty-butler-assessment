const mockAppointments = [
  {
    _id: "appointmentId1",
    merchantId: "merchantId",
    customerId: {
      _id: "customerId1",
      name: "Customer 1",
    },
    appointmentDate: new Date("2024-06-01"),
    startTime: "10:00",
    endTime: "11:00",
    status: "scheduled",
  },
];

jest.mock("../app/models/appointments.models", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  populate: jest.fn().mockResolvedValue(mockAppointments),
}));

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

describe("Customer Service", () => {
  afterEach(() => {
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

      expect(appointmentModel.findOne).toHaveBeenCalledWith({
        appointmentDate,
        merchantId,
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
        status: "scheduled",
      });
      expect(result).toEqual(expectedAppointment);
    });
  });

  describe("findAppointmentsForMerchantWithDate", () => {
    it("should find appointments for a merchant on a specific date", async () => {
      const mockAppointmentsWithDate = [
        { appointmentDate: "2024-06-04", startTime: "09:00", endTime: "10:00" },
      ];
      appointmentModel.find.mockResolvedValue(mockAppointmentsWithDate);

      const appointments = await findAppointmentsForMerchantWithDate(
        "123",
        "2024-06-04"
      );

      expect(appointmentModel.find).toHaveBeenCalledWith({
        merchantId: "123",
        appointmentDate: "2024-06-04",
      });
      expect(appointments).toBe(mockAppointmentsWithDate);
    });
  });

  describe("cancelAppointmentForMerchant", () => {
    it("should cancel an appointment and return it", async () => {
      const mockAppointment = { _id: "789", status: "scheduled" };
      const savedMockAppointment = { ...mockAppointment, status: "cancelled" };

      appointmentModel.findById.mockResolvedValue(mockAppointment);
      mockAppointment.save = jest.fn().mockResolvedValue(savedMockAppointment);

      const cancelledAppointment = await cancelAppointmentForMerchant("789");

      expect(appointmentModel.findById).toHaveBeenCalledWith("789");
      expect(mockAppointment.save).toHaveBeenCalled();
      expect(cancelledAppointment.status).toBe("cancelled");
    });
  });

  describe("completeAppointmentForMerchant", () => {
    it("should complete an appointment and return it", async () => {
      const mockAppointment = { _id: "789", status: "scheduled" };
      const savedMockAppointment = { ...mockAppointment, status: "completed" };

      appointmentModel.findById.mockResolvedValue(mockAppointment);
      mockAppointment.save = jest.fn().mockResolvedValue(savedMockAppointment);

      const completedAppointment = await completeAppointmentForMerchant("789");

      expect(appointmentModel.findById).toHaveBeenCalledWith("789");
      expect(mockAppointment.save).toHaveBeenCalled();
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
