import fs from "fs/promises";

import Resume from "../model/resume.model.js";
import extractPdfText from "../configs/pdf.js";
import resumeAgent from "../agents/resume.agent.js";

import redis from "../../../shared/redis/redis.js";


export const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    // -----------------------
    // Extract Resume Text
    // -----------------------

    const resumeText = await extractPdfText(req.file.path);

    // -----------------------
    // AI Resume Analysis
    // -----------------------

    const aiResponse = await resumeAgent(resumeText);

    const parsed = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const resumeData = JSON.parse(parsed);

    const toText = (value) =>
      typeof value === "string" ? value.trim() : "";

    const toList = (value) =>
      Array.isArray(value)
        ? value
            .filter((item) => item != null)
            .map((item) =>
              typeof item === "string"
                ? item.trim()
                : typeof item === "object"
                  ? JSON.stringify(item)
                  : String(item)
            )
            .filter(Boolean)
        : [];

    const toScore = (value) => {
      const num = Number(value);
      return Number.isFinite(num)
        ? Math.min(100, Math.max(0, num))
        : 0;
    };

    const cleanResume = {
      name: toText(resumeData.name),
      email: toText(resumeData.email),
      phone: toText(resumeData.phone),
      summary: toText(resumeData.summary),
      skills: toList(resumeData.skills),
      projects: toList(resumeData.projects),
      education: toList(resumeData.education),
      experience: toList(resumeData.experience),
      strengths: toList(resumeData.strengths),
      weaknesses: toList(resumeData.weaknesses),
      missingSkills: toList(resumeData.missingSkills),
      suggestedRole: toText(resumeData.suggestedRole),
      score: toScore(resumeData.score),
      recommendations: toList(resumeData.recommendations),
    };

    // -----------------------
    // MongoDB
    // -----------------------

    let resume = await Resume.findOne({ userId });

    if (resume) {

      Object.assign(resume, {
        ...cleanResume,
        extractedText: resumeText,
      });

      await resume.save();

    } else {

      resume = await Resume.create({
        userId,
        extractedText: resumeText,
        ...cleanResume,
      });

    }

    // -----------------------
    // Redis
    // -----------------------

    await redis.set(
      `resume:${userId}`,
      JSON.stringify(resume)
    );

    
    await fs.unlink(req.file.path);

    // -----------------------
    // Response
    // -----------------------

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: resume,
    });

  } catch (error) {

    console.log(error);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch {}
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getResume = async (req, res) => {
  try {

    const userId = req.headers["x-user-id"];

  

    // -------------------------
    // Check Redis
    // -------------------------

    const cache = await redis.get(`resume:${userId}`);

    if (cache) {

      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cache),
      });

    }

    // -------------------------
    // MongoDB
    // -------------------------

    const resume = await Resume.findOne({ userId });

    if (!resume) {

      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });

    }

    // -------------------------
    // Update Redis
    // -------------------------

    await redis.set(
      `resume:${userId}`,
      JSON.stringify(resume)
    );

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: resume,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};