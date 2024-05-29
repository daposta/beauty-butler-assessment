const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const indexRoute = require("./routes/index.routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", indexRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
