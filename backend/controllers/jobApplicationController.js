const JobApplication = require("../models/JobApplication");
const Resume = require("../models/Resume");

// Create application
exports.createApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      jobDescription,
      jobUrl,
      location,
      salary,
      status,
      appliedDate,
      followUpDate,
      notes,
      resume
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required"
      });
    }

    // Verify resume belongs to logged-in user
    if (resume) {
      const resumeExists = await Resume.findOne({
        _id: resume,
        user: req.user.id
      });

      if (!resumeExists) {
        return res.status(404).json({
          message: "Resume not found"
        });
      }
    }

    const application = await JobApplication.create({
      user: req.user.id,
      company,
      role,
      jobDescription,
      jobUrl,
      location,
      salary,
      status,
      appliedDate,
      followUpDate,
      notes,
      resume: resume || null
    });

    res.status(201).json({
      message: "Application created successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create application",
      error: error.message
    });
  }
};

// Get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      user: req.user.id
    })
      .populate("resume", "originalName version")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });
  }
};

// Update application
exports.updateApplication = async (req, res) => {
  try {
    const allowedFields = [
      "company",
      "role",
      "jobDescription",
      "jobUrl",
      "location",
      "salary",
      "status",
      "appliedDate",
      "followUpDate",
      "notes",
      "resume"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.resume) {
      const resumeExists = await Resume.findOne({
        _id: updates.resume,
        user: req.user.id
      });

      if (!resumeExists) {
        return res.status(404).json({
          message: "Resume not found"
        });
      }
    }

    const application = await JobApplication.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.status(200).json({
      message: "Application updated successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application",
      error: error.message
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.status(200).json({
      message: "Application deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete application",
      error: error.message
    });
  }
};