const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getResumes,
  analyzeResume,
  matchJob,
  indexResume,
  chatResume,
  deleteResume,
  compareResumes
} = require("../controllers/resumeController");

// Upload resume
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// Get all user resumes
router.get("/", authMiddleware, getResumes);

// Analyze resume
router.post("/:id/analyze", authMiddleware, analyzeResume);

// Match job description
router.post("/:id/match-job", authMiddleware, matchJob);

// Index resume
router.post("/:id/index", authMiddleware, indexResume);

// Chat with resume
router.post("/:id/chat", authMiddleware, chatResume);

// Compare resume versions
router.post("/compare", authMiddleware, compareResumes);

// Delete resume
router.delete("/:id", authMiddleware, deleteResume);

module.exports = router;