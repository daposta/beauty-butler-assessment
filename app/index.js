const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

require("dotenv").config();
require("./config/db");

const indexRoute = require("./routes/index.routes");

const app = express();

const port = process.env.PORT || 3000;

// log all requests
app.use(morgan("dev"));

// implement rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", indexRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
