const request = require("supertest");
const app = require("../app"); // Adjust the path to your app

describe("Schedule Endpoints", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "merchant@example.com",
      password: "password123",
    });
    token = res.body.token;
  });

  it("should create a new schedule", async () => {
    const res = await request(app)
      .post("/api/schedules")
      .set("Authorization", `Bearer ${token}`)
      .send({
        scheduleDate: "2024-06-04",
        startTime: "09:00",
        endTime: "17:00",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("merchantId");
  });
});
