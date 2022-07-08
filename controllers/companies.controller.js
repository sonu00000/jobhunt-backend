const Company = require("../models/company.model");

const createCompany = async (req, res) => {
  try {
    const { name, address } = req.body;

    //validation
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: `Validation failed - name and address values should be provided`,
      });
    }

    const companyObj = {
      name,
      address,
    };

    const company = await Company.create(companyObj);

    return res.status(200).json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id: companyId } = req.params;

    const company = await Company.findOne({ _id: companyId });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `Comapny Id: ${companyId} doesn't exist`,
      });
    }

    const { name, address } = req.body;

    //validation to check whether empty values for name and address are passed
    if (name === "") {
      return res.status(400).json({
        success: false,
        message: `Validation failed - name cannot be empty value.`,
      });
    }
    if (address === "") {
      return res.status(400).json({
        success: false,
        message: `Validation failed - address cannot be empty value.`,
      });
    }

    //company obj to be used for update query
    const companyUpdateObj = {
      name,
      address,
    };

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: companyId },
      companyUpdateObj,
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, company: updatedCompany });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id: companyId } = req.params;

    const company = await Company.findByIdAndRemove({ _id: companyId });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `Comapny Id: ${companyId} doesn't exist`,
      });
    }

    return res.status(200).json({ success: true, message: "Company removed!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    return res
      .status(200)
      .json({ success: true, companies, count: companies.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleCompany = async (req, res) => {
  try {
    const { id: companyId } = req.params;

    const company = await Company.findOne({ _id: companyId });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: `Comapny Id: ${companyId} doesn't exist`,
      });
    }

    return res.status(200).json({ success: true, company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCompany,
  updateCompany,
  deleteCompany,
  getAllCompanies,
  getSingleCompany,
};
