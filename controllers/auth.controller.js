const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../configs/auth.config");

const signup = async (req, res) => {
  try {
    const { name, userId, email, password, userType } = req.body;

    const userObj = {
      name,
      userId,
      email,
      password: bcrypt.hashSync(password, 8),
      userType,
    };

    const user = await User.create(userObj);

    const userResObj = {
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(201).json({ success: true, user: userResObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId: userId });

    //check whether userId is available in the system
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: `UserId: ${userId} doesn't exist!` });
    }

    //validate password
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: `Invalid Credentials` });
    }

    //generate token on successful login
    const token = jwt.sign({ id: userId }, secret, { expiresIn: "10d" });

    const userResObj = {
      accessToken: token,
      name: user.name,
      userId: user.userId,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(200).json({ success: true, user: userResObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  signin,
};
