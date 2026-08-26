import crypto from "crypto";

import JobFit from "../model/jobFit.model.js";
import Resume from "../model/resume.model.js";
import jobFitAgent from "../agents/jobFit.agent.js";

import redis from "../../../shared/redis/redis.js";

const JOB_FIT_CACHE_TTL = 60 * 60 * 24; // 24h
const HISTORY_CACHE_TTL = 60 * 60; // 1h

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

const jdHash = (text) =>
  crypto.createHash("sha1").update(text).digest("hex").slice(0, 16);

export const createJobFit = async (req, res) => {
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

    const cacheKey = `jobfit:${userId}:${jdHash(jobDescription)}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    const aiResponse = await jobFitAgent(
      resume.extractedText,
      jobDescription
    );

    const parsed = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jobFitData = JSON.parse(parsed);

    const cleanJobFit = {
      jobTitle,
      jobDescription,
      matchScore: toScore(jobFitData.matchScore),
      matchedSkills: toList(jobFitData.matchedSkills),
      missingSkills: toList(jobFitData.missingSkills),
      matchedKeywords: toList(jobFitData.matchedKeywords),
      missingKeywords: toList(jobFitData.missingKeywords),
      roleStrengths: toList(jobFitData.roleStrengths),
      recommendations: toList(jobFitData.recommendations),
    };

    const jobFit = await JobFit.create({
      userId,
      ...cleanJobFit,
    });

    await redis.set(
      cacheKey,
      JSON.stringify(jobFit),
      "EX",
      JOB_FIT_CACHE_TTL
    );

    await redis.del(`jobfits:${userId}`);

    return res.status(200).json({
      success: true,
      data: jobFit,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllJobFits = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const cacheKey = `jobfits:${userId}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    const jobFits = await JobFit.find({ userId })
      .sort({ createdAt: -1 });

    await redis.set(
      cacheKey,
      JSON.stringify(jobFits),
      "EX",
      HISTORY_CACHE_TTL
    );

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: jobFits,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobFitById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const { id } = req.params;

    const cacheKey = `jobfit:${id}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cached),
      });
    }

    const jobFit = await JobFit.findOne({ _id: id, userId });

    if (!jobFit) {
      return res.status(404).json({
        success: false,
        message: "Job fit analysis not found",
      });
    }

    await redis.set(
      cacheKey,
      JSON.stringify(jobFit),
      "EX",
      JOB_FIT_CACHE_TTL
    );

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: jobFit,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
