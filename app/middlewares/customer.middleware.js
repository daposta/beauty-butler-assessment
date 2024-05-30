const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json({ msg: "Access denied, only customers are allowed" });
  }
  next();
};

module.exports = isCustomer;
