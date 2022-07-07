const express = require("express");
const { PORT } = require("./configs/server.config");
const { DB_URL } = require("./configs/db.config");
const mongoose = require("mongoose");

const app = express();

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to mongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
