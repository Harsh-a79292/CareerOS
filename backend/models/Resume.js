const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    mimeType: {
      type: String,
      default: "application/pdf"
    },

    extractedText: {
      type: String,
      default: ""
    },

    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    analysisStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },

    // Resume Version Management
    version: {
      type: Number,
      default: 1
    },

    isLatest: {
      type: Boolean,
      default: true
    },

    versionGroup: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, versionGroup: 1, version: 1 });

module.exports = mongoose.model("Resume", resumeSchema);