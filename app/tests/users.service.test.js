const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Blacklist } = require("../models/users.models");
const {
  createUser,
  findUserById,
  findUserByEmail,
  loginUser,
  blacklistTokens,
} = require("../services/users.service");

// Mock the dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/users.models");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should hash the password and create a new user", async () => {
      const mockUser = {
        save: jest
          .fn()
          .mockResolvedValue({ _id: "123", email: "test@example.com" }),
      };
      User.mockImplementation(() => mockUser);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      jwt.sign.mockReturnValue("token");

      const token = await createUser({
        name: "Test User",
        email: "test@example.com",
        password: "password",
        role: "customer",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: "123" },
        process.env.SECRET_KEY,
        { expiresIn: process.env.EXPIRY }
      );
      expect(token).toBe("token");
    });
  });

  describe("loginUser", () => {
    it("should return null if user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const result = await loginUser("test@example.com", "password");

      expect(result).toBeNull();
    });

    it("should return null if password does not match", async () => {
      const mockUser = { password: "hashedpassword" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await loginUser("test@example.com", "password");

      expect(result).toBeNull();
    });

    it("should return a token if login is successful", async () => {
      const mockUser = { _id: "123", password: "hashedpassword" };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      const result = await loginUser("test@example.com", "password");

      expect(result).toBe("token");
    });
  });

  describe("findUserById", () => {
    it("should return the user if found by ID", async () => {
      const mockUser = { _id: "123", email: "test@example.com" };
      User.findById.mockResolvedValue(mockUser);

      const user = await findUserById("123");

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(user).toBe(mockUser);
    });
  });

  describe("findUserByEmail", () => {
    it("should return the user if found by email", async () => {
      const mockUser = { _id: "123", email: "test@example.com" };
      User.findOne.mockResolvedValue(mockUser);

      const user = await findUserByEmail("test@example.com");

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(user).toBe(mockUser);
    });
  });

  describe("blacklistTokens", () => {
    it("should decode the token and create a blacklist entry", async () => {
      const decodedToken = { iat: 1628799999 }; // example iat value
      jwt.decode.mockReturnValue(decodedToken);
      Blacklist.create.mockResolvedValue({});

      await blacklistTokens("token");

      expect(jwt.decode).toHaveBeenCalledWith("token");
      expect(Blacklist.create).toHaveBeenCalledWith({
        token: "token",
        expiry: new Date(decodedToken.iat * 1000),
      });
    });
  });
});
