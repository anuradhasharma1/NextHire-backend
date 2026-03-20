const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const verifyToken = require('../middleware/verifyToken');

//Get all jobs 
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

// GET one job by id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

// POST create a job — companies only
router.post('/', verifyToken, async (req, res) => {
  try {
    // only companies can post jobs
    if (req.user.role !== 'company') {
      return res.status(403).json({ message: "Only companies can post jobs!" });
    }

    const newJob = new Job({
      ...req.body,
      postedBy: req.user.userId
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

// DELETE a job — only company who posted it
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }

     // check if this company owns the job
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own jobs!" });
    }

 await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});

module.exports = router;
