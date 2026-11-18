const Resume = require("../models/Resume");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const AI_SERVICE = process.env.AI_SERVICE_URL || "http://localhost:8000";

// 1. UPLOAD RESUME
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file"
      });
    }

    const userId = req.user.id;

    const versionGroup =
      req.file.originalname
        .trim()
        .toLowerCase()
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9]+/g, "-") || "resume";

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const aiResponse = await axios.post(
      `${AI_SERVICE}/extract-resume`,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        timeout: 60000
      }
    );

    const previousResume = await Resume.findOne({
      user: userId,
      versionGroup
    }).sort({ version: -1 });

    const nextVersion = previousResume
      ? previousResume.version + 1
      : 1;

    const resume = await Resume.create({
      user: userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText: aiResponse.data.extracted_text,
      analysisStatus: "pending",
      version: nextVersion,
      versionGroup,
      isLatest: true
    });

    await Resume.updateMany(
      {
        user: userId,
        versionGroup,
        _id: { $ne: resume._id }
      },
      {
        $set: { isLatest: false }
      }
    );

    let ragIndexed = false;
    let indexingError = null;

    try {
      const indexResponse = await axios.post(
        `${AI_SERVICE}/index-resume`,
        {
          user_id: String(userId),
          resume_id: String(resume._id),
          resume_text: resume.extractedText
        },
        { timeout: 180000 }
      );

      ragIndexed = indexResponse.data.success;
    } catch (error) {
      indexingError =
        error.response?.data?.detail || error.message;

      console.error("Resume Indexing Error:", indexingError);
    }

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      ragIndexed,
      indexingError,
      resume
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
      error: error.response?.data?.detail || error.message
    });
  }
};

// 2. GET USER RESUMES
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id
    })
      .select("-extractedText")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      latestCount: resumes.filter(r => r.isLatest).length,
      resumes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. AI RESUME ANALYSIS
exports.analyzeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({
      _id: id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is not available"
      });
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/analyze-resume`,
      { resume_text: resume.extractedText },
      { timeout: 120000 }
    );

    resume.analysis = aiResponse.data.analysis;
    resume.analysisStatus = "completed";

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      resumeId: resume._id,
      analysis: resume.analysis
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Resume analysis failed",
      error: error.response?.data?.detail || error.message
    });
  }
};

// 4. JOB DESCRIPTION MATCHING
exports.matchJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job_description = req.body.jobDescription;

    if (
      typeof job_description !== "string" ||
      job_description.trim().length < 30
    ) {
      return res.status(400).json({
        success: false,
        message: "Job description must contain at least 30 characters"
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is not available"
      });
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/match-job`,
      {
        resume_text: resume.extractedText,
        job_description: job_description.trim()
      },
      { timeout: 120000 }
    );

    return res.status(200).json({
      success: true,
      message: "Job matching completed successfully",
      resumeId: resume._id,
      result: aiResponse.data.result
    });

  } catch (error) {
    console.error("Job Matching Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Job matching failed",
      error: error.response?.data?.detail || error.message
    });
  }
};

// 5. INDEX / REINDEX RESUME
exports.indexResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({
      _id: id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is not available"
      });
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/index-resume`,
      {
        user_id: String(req.user.id),
        resume_id: String(resume._id),
        resume_text: resume.extractedText
      },
      { timeout: 180000 }
    );

    return res.status(200).json({
      success: true,
      message: "Resume indexed successfully",
      result: aiResponse.data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Resume indexing failed",
      error: error.response?.data?.detail || error.message
    });
  }
};

// 6. CHAT WITH RESUME

// 6. CHAT WITH RESUME
exports.chatResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (
      typeof question !== "string" ||
      question.trim().length < 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid question"
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is not available"
      });
    }

    const chatPayload = {
      user_id: String(req.user.id),
      resume_id: String(resume._id),
      question: question.trim()
    };

    let aiResponse;

    try {
      // First attempt
      aiResponse = await axios.post(
        `${AI_SERVICE}/chat-resume`,
        chatPayload,
        { timeout: 120000 }
      );

    } catch (error) {

      // If resume is not indexed, re-index it
      if (
        error.response?.status === 404 &&
        error.response?.data?.detail ===
          "Resume has not been indexed yet"
      ) {

        console.log("Resume not indexed. Re-indexing...");

        await axios.post(
          `${AI_SERVICE}/index-resume`,
          {
            user_id: String(req.user.id),
            resume_id: String(resume._id),
            resume_text: resume.extractedText
          },
          { timeout: 180000 }
        );

        // Retry chatbot after indexing
        aiResponse = await axios.post(
          `${AI_SERVICE}/chat-resume`,
          chatPayload,
          { timeout: 120000 }
        );

      } else {
        throw error;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      result: aiResponse.data
    });

  } catch (error) {

    console.error(
      "Resume Chat Error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Resume chatbot failed",
      error: error.response?.data?.detail || error.message
    });
  }
};


// 7. AI RESUME VERSION COMPARISON
exports.compareResumes = async (req, res) => {
  try {
    const { oldResumeId, newResumeId } = req.body;

    if (!oldResumeId || !newResumeId) {
      return res.status(400).json({
        success: false,
        message: "Both resume IDs are required"
      });
    }

    if (oldResumeId === newResumeId) {
      return res.status(400).json({
        success: false,
        message: "Please select two different resume versions"
      });
    }

    const [oldResume, newResume] = await Promise.all([
      Resume.findOne({
        _id: oldResumeId,
        user: req.user.id
      }),
      Resume.findOne({
        _id: newResumeId,
        user: req.user.id
      })
    ]);

    if (!oldResume || !newResume) {
      return res.status(404).json({
        success: false,
        message: "One or both resumes were not found"
      });
    }

    if (
      !oldResume.versionGroup ||
      oldResume.versionGroup !== newResume.versionGroup
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select versions from the same resume group"
      });
    }

    if (!oldResume.extractedText || !newResume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is not available"
      });
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/compare-resumes`,
      {
        old_resume_text: oldResume.extractedText,
        new_resume_text: newResume.extractedText
      },
      { timeout: 180000 }
    );

    return res.status(200).json({
      success: true,
      message: "Resume comparison completed successfully",
      oldResume: {
        id: oldResume._id,
        name: oldResume.originalName,
        version: oldResume.version
      },
      newResume: {
        id: newResume._id,
        name: newResume.originalName,
        version: newResume.version
      },
      result: aiResponse.data.result
    });

  } catch (error) {
    console.error("Resume Comparison Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Resume comparison failed",
      error: error.response?.data?.detail || error.message
    });
  }
};

// 8. DELETE RESUME
exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({
      _id: id,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    try {
      await axios.delete(
        `${AI_SERVICE}/delete-resume-index`,
        {
          data: {
            user_id: String(req.user.id),
            resume_id: String(resume._id)
          }
        }
      );

      console.log("Resume ChromaDB index deleted");

    } catch (error) {
      console.error(
        "ChromaDB cleanup failed:",
        error.response?.data || error.message
      );
    }

    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.deleteOne({
      _id: resume._id,
      user: req.user.id
    });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully"
    });

  } catch (error) {
    console.error("Delete Resume Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Resume deletion failed"
    });
  }
};