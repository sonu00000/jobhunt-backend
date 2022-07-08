const { secret } = require("../configs/auth.config");
const User = require("../models/user.model");
const { userTypes } = require("../utils/constants");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  //get the token from request headers
  const token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }
  //verify the token
  try {
    //this will verify and get the payload
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    //read the userId from the payload and add it to req object
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Check if the passed access token is of admin or not
 */
const isAdminOrRecruiter = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    if (
      user.userType === userTypes.admin ||
      user.userType === userTypes.recruiter
    ) {
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Requires ADMIN/RECRUITER role!" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  verifyToken,
  isAdminOrRecruiter,
};
