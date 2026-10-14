import mongoose from "mongoose";

const coverLetterSchema = new mongoose.Schema(
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

    coverLetter: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CoverLetter = mongoose.model("CoverLetter", coverLetterSchema);

export default CoverLetter;
