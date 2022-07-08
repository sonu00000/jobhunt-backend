const Job = require("../models/job.model");
const Company = require("../models/company.model");
const User = require("../models/user.model");
const { userTypes, jobStatuses } = require("../utils/constants");

const createJob = async (req, res) => {
  try {
    const { title, description, status, appliedBy, company } = req.body;

    //re body fields validation
    if (!title || !description || !company) {
      return res.status(400).json({
        success: false,
        message: `Job title, description and company filed must be provided`,
      });
    }

    //check if the company id provided is valid or not
    const companyFromDb = await Company.findOne({ _id: company });
    if (!companyFromDb) {
      return res.status(400).json({
        success: false,
        message: `Company Id - ${company} doesn't exist`,
      });
    }

    //prepare job object to be used to create job in db
    const jobObj = {
      title,
      description,
      status,
      appliedBy,
      company,
    };

    //create the job
    const job = await Job.create(jobObj);

    //Update the coressponding company instance to include the recently created job in db
    companyFromDb.jobsPosted.push(job._id);
    await companyFromDb.save();

    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findOne({ _id: jobId });

    //check if the job exists
    if (!job) {
      return res
        .status(400)
        .json({ success: false, message: `Job Id: ${jobId} doesn't exist` });
    }

    const user = await User.findOne({ userId: req.userId });

    //call the applyJob method if user has passed 'applied=true' query parameter
    if (req.query.apply) {
      return applyJob(req, res, user, job);
    }

    //allow only admin and company requiter can update the job
    if (
      !user.userType === userTypes.admin ||
      !user.userType === userTypes.recruiter
    ) {
      return res.status(400).json({
        success: false,
        message: `Only ADMIN and RECRUITER can update the job posting`,
      });
    }

    //update the attrbutes of job instance with req body
    job.title = job.title !== undefined ? req.body.title : job.title;
    job.description =
      job.description !== undefined ? req.body.description : job.title;
    job.status = job.status !== undefined ? req.body.status : job.status;
    job.title = job.title !== undefined ? req.body.title : job.title;
    await job.save();

    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** This function will be called from updateJob controller when a user applies for a job */
const applyJob = async (req, res, user, job) => {
  //allow only students to apply to jobs
  if (user.userType !== userTypes.student) {
    return res
      .status(200)
      .json({ success: false, message: `Only Students can apply to job` });
  }
  if (job.status === jobStatuses.expired) {
    return res
      .status(200)
      .json({ success: false, message: `Sorry, this job posting has expired` });
  }
  //update the corresponding user and job object to include the changes in the arrays
  user.jobsApplied.push(user._id);
  await user.save();

  job.appliedBy.push(user._id);
  await job.save();

  return res.status(200).json({ success: true, user });
};

const deleteJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findByIdAndRemove({ _id: jobId });

    if (!job) {
      return res
        .status(400)
        .json({ success: false, message: `Job Id: ${jobId} doesn't exist` });
    }
    return res
      .status(200)
      .json({ success: true, message: "Job posting removed!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).json({ success: true, jobs, count: jobs.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id });
    if (!job) {
      return res.status(400).json({
        success: false,
        message: `Job with id ${req.params.id} doesn't exist`,
      });
    }
    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getSingleJob,
};
