const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const Resume = require("../models/Resume");

const migrateResumeVersions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // Get all resumes
    const resumes = await Resume.find({}).sort({
      createdAt: 1,
      _id: 1
    });

    // Group by user + normalized filename
    const groups = {};

    for (const resume of resumes) {
      const normalizedName = resume.originalName
        .trim()
        .toLowerCase()
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9]+/g, "-") || "resume";

      const groupKey = `${resume.user}_${normalizedName}`;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(resume);
    }

    let updatedCount = 0;

    for (const [groupKey, group] of Object.entries(groups)) {
      const versionGroup = groupKey.split("_").slice(1).join("_");

      for (let i = 0; i < group.length; i++) {
        const resume = group[i];

        resume.versionGroup = versionGroup;
        resume.version = i + 1;
        resume.isLatest = i === group.length - 1;

        await resume.save();

        updatedCount++;
      }
    }

    console.log(`Migration completed: ${updatedCount} resumes updated`);

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

migrateResumeVersions();