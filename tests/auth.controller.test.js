const {
  loginUserWithPassword,
  registerUser,
  logout,
} = require("../app/controllers/auth.controller");
const {
  createUser,
  loginUser,
  blacklistTokens,
} = require("../app/services/users.service");

jest.mock("../app/services/users.service");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUserWithPassword", () => {
    it("should return a token for valid credentials", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const token = "valid-token";

      loginUser.mockResolvedValue(token);

      await loginUserWithPassword(req, res);

      expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    it("should return 401 for invalid credentials", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "wrongpassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

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
    it("should create a user and return a token", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const token = "valid-token";

      createUser.mockResolvedValue(token);

      await registerUser(req, res);

      expect(createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("logout", () => {
    it("should blacklist the token and return a success message", async () => {
      const req = {
        header: jest.fn().mockReturnValue("Bearer valid-token"),
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await logout(req, res);

      expect(req.header).toHaveBeenCalledWith("Authorization");
      expect(blacklistTokens).toHaveBeenCalledWith("valid-token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });
  });
});
