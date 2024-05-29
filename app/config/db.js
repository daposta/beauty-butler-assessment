const mongoose = require("mongoose");
const DB_URI = process.env.MONGO_URI;

console.log("loading connector");
console.log(DB_URI);
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(">>>>Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = mongoose;
