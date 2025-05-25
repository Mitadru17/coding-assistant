import axios from 'axios';

// Determine the correct base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production' 
  ? '' // When deployed on Vercel, we can use relative URLs
  : 'http://localhost:3000'; // For local development

// Create an axios instance with the base URL
const api = axios.create({
  baseURL
});

// Export API methods
export const chatWithBot = async (message) => {
  const response = await api.post('/api/chat', { message });
  return response.data;
};

export const getDailyQuestion = async () => {
  const response = await api.get('/api/daily-question');
  return response.data;
};

export const getExplanation = async (question) => {
  const response = await api.post('/api/explanation', { question });
  return response.data;
};

export default api; 