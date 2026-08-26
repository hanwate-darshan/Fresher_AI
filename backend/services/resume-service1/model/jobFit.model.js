import mongoose from "mongoose";

const jobFitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    jobTitle: {
      type: String,
      default: "",
    },

    jobDescription: {
      type: String,
      default: "",
    },

    matchScore: {
      type: Number,
      default: 0,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    roleStrengths: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const JobFit = mongoose.model("JobFit", jobFitSchema);

export default JobFit;
