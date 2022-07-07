const mongoose = require("mongoose");
const {
  userTypes: { admin, student, recruiter },
} = require("../utils/constants");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    default: student,
    enum: {
      values: [admin, student, recruiter],
    },
  },
  jobsApplied: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Job",
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

module.exports = mongoose.model("User", userSchema);
