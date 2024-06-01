const { body, validationResult } = require("express-validator");
const { findUserByEmail } = require("../services/users.service");

const loginValidator = () => [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").exists().withMessage("Password is required"),
];

const registerValidator = () => [
  body("name")
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character"),
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const member = await findUserByEmail(value);

      if (member) {
        throw new Error("User already exists");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["customer", "merchant"])
    .withMessage("Role must be either customer or merchant"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { loginValidator, registerValidator, validate };
