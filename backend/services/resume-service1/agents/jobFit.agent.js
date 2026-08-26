import llm from "../configs/llm.js";
import {
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

const jobFitAgent = async (resumeText, jobDescription) => {

  const response = await llm.invoke([

    new SystemMessage(`
You are an Expert ATS Resume Analyzer and Hiring Recruiter.

Compare the given resume against the given job description and determine how well the candidate fits this specific job.

Extract the following information:

- matchScore: overall job-fit score (0-100) based on how well the resume matches the job requirements
- matchedSkills: skills present in the resume that are required or implied by the job description
- missingSkills: skills the job description requires but the resume does not mention
- matchedKeywords: important keywords from the job description that appear in the resume (ATS keyword match)
- missingKeywords: important keywords from the job description that are missing from the resume (ATS keyword gap)
- roleStrengths: resume strengths that are valuable specifically for this job role
- recommendations: concrete, resume-specific improvements to increase the chances of getting this job (e.g. "Add a Spring Boot project", "Mention Docker in your deployment section")

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not use markdown.
3. Do not explain anything.
4. Do not add extra text.
5. Every field must exist.

Response Format:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "roleStrengths": [],
  "recommendations": []
}
`),

    new HumanMessage(`RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`),

  ]);

  return response.content;
};

export default jobFitAgent;
