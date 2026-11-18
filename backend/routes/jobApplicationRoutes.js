const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
} = require("../controllers/jobApplicationController");

// Create application
router.post("/", authMiddleware, createApplication);

// Get all applications
router.get("/", authMiddleware, getApplications);

// Update application
router.put("/:id", authMiddleware, updateApplication);

// Delete application
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;