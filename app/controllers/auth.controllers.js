const { createUser, loginUser } = require("../services/users.service");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);

  if (user === null) {
    return res.status(400).send({ error: "Invalid credentials." });
  }
  res.status(201).json(user);
};

const register = async (req, res) => {
  const token = await createUser(req.body);

  res.status(201).json({ token });
};

const logout = async (req, res) => {
  const user = null;
  res.status(201).json(user);
};

module.exports = { login, register, logout };
