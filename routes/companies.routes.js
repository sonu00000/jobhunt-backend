const express = require("express");
const router = express.Router();
const {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getSingleCompany,
} = require("../controllers/companies.controller");
const { verifyToken, isAdminOrRecruiter } = require("../middlewares/authjwt");

router
  .route("/")
  .post([verifyToken, isAdminOrRecruiter], createCompany)
  .get(getAllCompanies);
router
  .route("/:id")
  .get(getSingleCompany)
  .put([verifyToken, isAdminOrRecruiter], updateCompany)
  .delete([verifyToken, isAdminOrRecruiter], deleteCompany);

module.exports = router;
