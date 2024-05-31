const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Blacklist } = require("../models/users.models");

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = process.env.ALGORITHM;

const createUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  const savedUser = await user.save();
  const token = jwt.sign(
    { _id: savedUser._id.toString() },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.EXPIRY,
    }
  );
  return token;
};

// Cleaned up by standardizing variable names, removing debugging statements, improving readability by adding whitespace and using newlines, and more.

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const token = jwt.sign({ _id: user._id.toString() }, SECRET_KEY, {});
  return token;
};

const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const blacklistTokens = async (token) => {
  const { iat } = jwt.decode(token);
  const expiry = new Date(iat * 1000);
  await Blacklist.create({ token, expiry });
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  loginUser,
  blacklistTokens,
};
