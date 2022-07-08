const express = require("express");
const { PORT } = require("./configs/server.config");
const { DB_URL } = require("./configs/db.config");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const { userTypes } = require("./utils/constants");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./routes/auth.routes");

app.use("/jobhunt/api/v1/auth", authRouter);

const init = async () => {
  //check if admin user is already created
  try {
    const admin = await User.findOne({ userId: "admin" });
    if (admin) {
      return;
    }
    const user = await User.create({
      name: "admin user",
      userId: "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("adminSecret", 8),
      userType: userTypes.admin,
    });
    console.log("ADMIN user is created");
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to mongoDB");
    init();
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
