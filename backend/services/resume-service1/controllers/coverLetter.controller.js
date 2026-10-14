import CoverLetter from "../model/coverLetter.model.js";
import Resume from "../model/resume.model.js";
import coverLetterAgent from "../agents/coverLetter.agent.js";
import redis from "../../../shared/redis/redis.js";

const HISTORY_CACHE_TTL = 60 * 60; // 1h

const toText = (value) =>
  typeof value === "string" ? value.trim() : "";

export const createCoverLetter = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const jobDescription = toText(req.body?.jobDescription);
    const jobTitle = toText(req.body?.jobTitle);
    const userName = toText(req.body?.userName);

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first",
      });
    }

    const aiResponse = await coverLetterAgent(
      resume.extractedText,
      jobDescription,
      jobTitle,
      userName
    );

    const parsed = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let coverLetterText;
    try {
      const parsed_json = JSON.parse(parsed);
      coverLetterText = toText(parsed_json.coverLetter);
    } catch {
      // If AI returns plain text instead of JSON, use it directly
      coverLetterText = parsed;
    }

    if (!coverLetterText) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate cover letter. Please try again.",
      });
    }

    const coverLetter = await CoverLetter.create({
      userId,
      jobTitle,
      jobDescription,
      coverLetter: coverLetterText,
    });

    // Invalidate history cache
    await redis.del(`coverletters:${userId}`);

    return res.status(200).json({
      success: true,
      data: coverLetter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCoverLetters = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const cacheKey = `coverletters:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    const coverLetters = await CoverLetter.find({ userId })
      .sort({ createdAt: -1 });

    await redis.set(
      cacheKey,
      JSON.stringify(coverLetters),
      "EX",
      HISTORY_CACHE_TTL
    );

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: coverLetters,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCoverLetterById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const { id } = req.params;

    const cacheKey = `coverletter:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    const coverLetter = await CoverLetter.findOne({ _id: id, userId });

    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        message: "Cover letter not found",
      });
    }

    await redis.set(
      cacheKey,
      JSON.stringify(coverLetter),
      "EX",
      HISTORY_CACHE_TTL
    );

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: coverLetter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
