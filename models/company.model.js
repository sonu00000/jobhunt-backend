const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    jobsPosted: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Job",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comapny", companySchema);
