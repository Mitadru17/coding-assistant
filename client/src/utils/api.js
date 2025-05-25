import axios from 'axios';

// Determine the correct base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production' 
  ? window.location.origin // Use the current domain (very important for Vercel)
  : 'http://localhost:3000'; // For local development

console.log('API base URL:', baseURL, 'Environment:', process.env.NODE_ENV); // Debug log

// Create an axios instance with the base URL
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Increased timeout for Hugging Face API calls
  timeout: 120000 // 2 minute timeout
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
    // Check if the error is a timeout
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('API Request Timeout:', error.config?.url);
    } else {
      console.error('API Error:', 
        error.response?.status || 'Network Error', 
        error.response?.config?.url || 'Unknown URL',
        error.message
      );
    }
    return Promise.reject(error);
  }
);

// Export API methods
export const chatWithBot = async (message) => {
  try {
    const response = await api.post('/api/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Chat error:', error.message);
    return { error: true, response: 'Sorry, I could not process your request. Please try again later.' };
  }
};

export const getDailyQuestion = async () => {
  try {
    const response = await api.get('/api/daily-question', {
      // Add cache-busting parameter
      params: { _t: new Date().getTime() }
    });
    return response.data;
  } catch (error) {
    console.error('Daily question error:', error.message);
    return { error: true, question: 'Sorry, I could not generate a question. Please try again later.' };
  }
};

export const getExplanation = async (question) => {
  try {
    const response = await api.post('/api/explanation', { question });
    return response.data;
  } catch (error) {
    console.error('Explanation error:', error.message);
    return { error: true, explanation: 'Sorry, I could not generate an explanation. Please try again later.' };
  }
};

export default api; 