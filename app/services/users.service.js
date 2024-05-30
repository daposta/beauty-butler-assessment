const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.models");

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = process.env.ALGORITHM;

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user["password"] = hashedPassword;
  const newUser = await usersModel.create(user);
  const token = jwt.sign({ _id: newUser._id.toString() }, SECRET_KEY, {});
  return token;
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  const token = jwt.sign({ _id: user._id.toString() }, SECRET_KEY, {});
  return { token };
};

const findUserById = async (id) => {
  const user = await usersModel.findById(id);
  return user;
};

const findUserByEmail = async (email) => {
  const user = await usersModel.findOne({ email });
  return user;
};

module.exports = { createUser, findUserById, findUserByEmail, loginUser };
