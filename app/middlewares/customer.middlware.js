const isCustomer = (req, res, next) => {
  if (req.user.role !== "merchant") {
    return res
      .status(403)
      .json({ msg: "Access denied, only merchants are allowed" });
  }
  next();
};

module.exports = isCustomer;
