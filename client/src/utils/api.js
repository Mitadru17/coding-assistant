import axios from 'axios';

// Determine the correct base URL based on the environment
// For Vercel deployments, we need to use absolute URLs in production with the deployment URL
const baseURL = process.env.NODE_ENV === 'production' 
  ? window.location.origin // Use the current origin in production
  : 'http://localhost:3000'; // For local development

console.log('API base URL:', baseURL); // Debug log

// Create an axios instance with the base URL
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('API Request:', request.method, request.url);
  return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', 
      error.response?.status || 'Network Error', 
      error.response?.config?.url || 'Unknown URL'
    );
    return Promise.reject(error);
  }
);

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