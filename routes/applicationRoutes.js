const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const Job = require('../models/Job');  
const verifyToken = require('../Middleware/verifyToken')

// POST apply for a job — candidates only
router.post('/:id/apply', verifyToken, async (req, res) => {
  try {
    // only candidates can apply
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: "Only candidates can apply for jobs!" });
    }

    // check if job exists
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }

    // check if already applied
    const alreadyApplied = await Application.findOne({
      job: req.params.id,
      applicant: req.user.userId
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied for this job!" });
    }

    // create application
    const application = new Application({
      job: req.params.id,
      applicant: req.user.userId
    });

    await application.save();
    res.status(201).json({ message: "Applied successfully!", application });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

// GET my applications — candidates see their own applications
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job', 'title company location salary');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

// GET all applicants for a job — company only
router.get('/:id/applicants', verifyToken, async (req, res) => {
  try {
    // only companies can see applicants
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: "Only companies can view applicants!" });
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

// PUT update application status — company only
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: "Only companies can update status!" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found!" });
    }

    res.status(200).json({ message: "Status updated!", updated });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

module.exports = router;