const {
  createUser,
  loginUser,
  blacklistTokens,
} = require("../app/services/users.service");

const {
  loginUserWithPassword,
  registerUser,
  logout,
} = require("../app/controllers/auth.controller");

jest.mock("../app/services/users.service");

describe("Auth Controller", () => {
  describe("loginUserWithPassword", () => {
    it("should login a user with email and password", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const token = "mockToken";
      loginUser.mockResolvedValue(token);

      await loginUserWithPassword(req, res);

      expect(loginUser).toHaveBeenCalledWith("test@example.com", "password");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    it("should handle invalid credentials", async () => {
      const req = {
        body: { email: "test@example.com", password: "wrongpassword" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      loginUser.mockResolvedValue(null);

      await loginUserWithPassword(req, res);

      expect(loginUser).toHaveBeenCalledWith(
        "test@example.com",
        "wrongpassword"
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ msg: "Invalid credentials" });
    });
  });

  describe("registerUser", () => {
    it("should register a user with email and password", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const token = "mockToken";
      createUser.mockResolvedValue(token);

      await registerUser(req, res);

      expect(createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("logout", () => {
    it("should logout a user by blacklisting the token", async () => {
      const req = { header: jest.fn().mockReturnValue("Bearer mockToken") };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await logout(req, res);

      expect(req.header).toHaveBeenCalledWith("Authorization");
      expect(blacklistTokens).toHaveBeenCalledWith("mockToken");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });
  });
});
