const express = require("express");
const router = express.Router();
const {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getSingleJob,
} = require("../controllers/jobs.controller");
const { verifyToken, isAdminOrRecruiter } = require("../middlewares/authjwt");

router
  .route("/")
  .post([verifyToken, isAdminOrRecruiter], createJob)
  .get(getAllJobs);
router
  .route("/:id")
  .get(getSingleJob)
  .put([verifyToken], updateJob)
  .delete([verifyToken, isAdminOrRecruiter], deleteJob);

module.exports = router;
