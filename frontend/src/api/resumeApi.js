/**
 * resumeApi.js
 * Centralised Axios helper for backend API calls.
 * Update VITE_API_URL in your .env to point to your backend URL.
 */

import axios from "axios";

// Falls back to localhost during development
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Send resume form data to the backend and get an AI-generated resume.
 * @param {Object} formData - Resume input from the user
 * @returns {Promise<string>} - The formatted resume text
 */
export const generateResume = async (formData) => {
  const response = await axios.post(`${API_BASE}/generate-resume`, formData, {
    headers: { "Content-Type": "application/json" },
    timeout: 60000, // 60 s — OpenAI can be slow on the first call
  });
  return response.data.resume;
};
