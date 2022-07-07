const mongoose = require("mongoose");
const {
  jobStatuses: { active, expired },
} = require("../utils/constants");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    default: active,
    enum: {
      values: [active, expired],
    },
  },
  appliedBy: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
  company: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Company",
  },
});

module.exports = mongoose.model("Job", jobSchema);
