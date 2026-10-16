import Resume from "../model/resume.model.js";
import careerCoachAgent from "../agents/careerCoach.agent.js";

export const chatWithCoach = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    const { message, chatHistory = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Load resume for context (optional — coach works even without resume)
    const resume = await Resume.findOne({ userId });
    const userProfile = resume
      ? {
          name: resume.name || "",
          skills: resume.skills || [],
          missingSkills: resume.missingSkills || [],
          suggestedRole: resume.suggestedRole || "",
          score: resume.score || 0,
          projects: resume.projects || [],
          experience: resume.experience || [],
          education: resume.education || [],
          strengths: resume.strengths || [],
          weaknesses: resume.weaknesses || [],
          recommendations: resume.recommendations || [],
          extractedText: resume.extractedText || "",
        }
      : null;

    const reply = await careerCoachAgent(
      userProfile,
      message.trim(),
      chatHistory
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
