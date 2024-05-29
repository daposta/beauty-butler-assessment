const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, require: true, lowercase: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ["customer", "merchant"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
