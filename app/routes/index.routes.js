const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/merchants", require("./merchants.routes"));
router.use("/customers", require("./customers.routes"));
// router.use("/appointments", require("./appointments.routes"));
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = router;
