const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    jobDescription: {
      type: String,
      default: ""
    },

    jobUrl: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      default: ""
    },

    salary: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Saved",
        "Applied",
        "Assessment",
        "Interview",
        "Offer",
        "Rejected",
        "Withdrawn"
      ],
      default: "Saved"
    },

    appliedDate: {
      type: Date,
      default: null
    },

    followUpDate: {
      type: Date,
      default: null
    },

    notes: {
      type: String,
      default: ""
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null
    }
  },
  { timestamps: true }
);

jobApplicationSchema.index({ user: 1, status: 1 });
jobApplicationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);