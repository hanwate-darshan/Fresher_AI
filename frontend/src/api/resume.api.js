import api from "../utils/axios";


export const getResume = async () => {
  try {
    const response = await api.get("/api/resume/get-resume");
  return response.data;
  } catch (error) {
    console.log(error)
    return null
  }

  
};

export const analyzeJobFit = async (payload) => {
  try {
    const response = await api.post("/api/resume/job-fit", payload);
    return response.data;
  } catch (error) {
    console.log(error)
    return null
  }
};

export const getAllJobFits = async () => {
  try {
    const response = await api.get("/api/resume/job-fit");
    return response.data;
  } catch (error) {
    console.log(error)
    return null
  }
};

export const getJobFitById = async (id) => {
  try {
    const response = await api.get(`/api/resume/job-fit/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
    return null
  }
};

export const generateCoverLetter = async (payload) => {
  try {
    const response = await api.post("/api/resume/cover-letter", payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllCoverLetters = async () => {
  try {
    const response = await api.get("/api/resume/cover-letter");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCoverLetterById = async (id) => {
  try {
    const response = await api.get(`/api/resume/cover-letter/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const chatWithCareerCoach = async (payload) => {
  try {
    const response = await api.post("/api/resume/career-coach", payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};