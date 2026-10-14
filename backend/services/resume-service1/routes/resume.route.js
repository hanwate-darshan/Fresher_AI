import express from "express";
import upload from "../configs/multer.js";
import { getResume, uploadResume } from "../controllers/resume.controller.js";
import {
  createJobFit,
  getAllJobFits,
  getJobFitById,
} from "../controllers/jobFit.controller.js";
import {
  createCoverLetter,
  getAllCoverLetters,
  getCoverLetterById,
} from "../controllers/coverLetter.controller.js";
import { chatWithCoach } from "../controllers/careerCoach.controller.js";



const resumeRouter = express.Router();

resumeRouter.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);
resumeRouter.get("/get-resume",getResume)

resumeRouter.post("/job-fit", createJobFit);
resumeRouter.get("/job-fit", getAllJobFits);
resumeRouter.get("/job-fit/:id", getJobFitById);

resumeRouter.post("/cover-letter", createCoverLetter);
resumeRouter.get("/cover-letter", getAllCoverLetters);
resumeRouter.get("/cover-letter/:id", getCoverLetterById);

resumeRouter.post("/career-coach", chatWithCoach);

export default resumeRouter;