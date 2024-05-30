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

const BlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
const Blacklist = mongoose.model("Blacklist", BlacklistSchema);
module.exports = { User, Blacklist };
