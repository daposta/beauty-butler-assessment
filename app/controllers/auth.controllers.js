const {
  createUser,
  loginUser,
  blacklistTokens,
} = require("../services/users.service");

const loginUserWithPassword = async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);

  if (!token) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  return res.status(200).json({ token });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const token = await createUser({ name, email, password, role });

  res.status(201).json({ token });
};

// Changes made:

const logout = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  await blacklistTokens(token);
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { loginUserWithPassword, registerUser, logout };
