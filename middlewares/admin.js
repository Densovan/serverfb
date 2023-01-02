const admin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(500).json({ msg: "You are not admin" });
  }
};
module.exports = admin;
