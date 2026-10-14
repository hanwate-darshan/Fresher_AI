import llm from "../configs/llm.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const coverLetterAgent = async (resumeText, jobDescription, jobTitle, userName) => {
  const response = await llm.invoke([
    new SystemMessage(`
You are an expert career coach and professional cover letter writer.

Generate a compelling, personalized cover letter based on the candidate's resume and the job description provided.

Guidelines:
- Make it professional but personable
- Keep it to 3-4 paragraphs
- Opening: Show genuine enthusiasm for the specific role and company
- Middle: Highlight 2-3 most relevant experiences/skills from the resume that match the job description
- Closing: Strong call to action
- DO NOT use generic phrases like "I am writing to apply..."
- DO NOT use placeholders like [Company Name] — infer from job description if available or use "your company"
- Make it ATS-friendly by naturally including keywords from the job description
- Tone: confident, enthusiastic, professional

IMPORTANT RULES:
1. Return ONLY a JSON object with a single field "coverLetter" containing the full cover letter text
2. Do not use markdown code blocks
3. Do not explain anything
4. The cover letter should have proper paragraphs separated by newlines

Response format:
{"coverLetter": "Dear Hiring Manager,\\n\\n[paragraph1]\\n\\n[paragraph2]\\n\\n[paragraph3]\\n\\nSincerely,\\n[Name]"}
`),
    new HumanMessage(
      `CANDIDATE NAME: ${userName || "The Candidate"}\n\nRESUME:\n${resumeText}\n\nJOB TITLE: ${jobTitle || "the role"}\n\nJOB DESCRIPTION:\n${jobDescription}`
    ),
  ]);

  return response.content;
};

export default coverLetterAgent;
