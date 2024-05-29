const { findUserByEmail, createUser } = require("../services/users.services");

const login = async (req, res) => {
  res.send("login");
};

const register = async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};

const logout = async (req, res) => {
  res.send("logout");
};

module.exports = { login, register, logout };
