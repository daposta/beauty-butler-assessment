const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/users.models");

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user["password"] = hashedPassword;
  const newUser = await usersModel.create(user);
  return newUser;
};

const findUserById = async (id) => {
  const user = await usersModel.findById(id);
  return user;
};

const findUserByEmail = async (email) => {
  const user = await usersModel.findOne({ email });
  return user;
};

module.exports = { createUser, findUserById, findUserByEmail };
