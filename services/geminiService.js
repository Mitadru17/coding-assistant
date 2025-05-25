/**
 * Service that uses Hugging Face API to generate responses
 */
const axios = require('axios');

// Initialize the Hugging Face API with your API key
const apiKey = process.env.HF_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

// Log API setup
console.log('Hugging Face API URL:', API_URL);
console.log('API Key configured:', apiKey ? 'Yes' : 'No');

// Configure headers for API requests
const headers = {
  "Authorization": `Bearer ${apiKey}`,
  "Content-Type": "application/json"
};

// Create axios instance with retry logic
const apiClient = axios.create({
  headers,
  timeout: 60000 // 60 second timeout
});

// Add a retry mechanism
const MAX_RETRIES = 2;
apiClient.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }
  
  config.retry -= 1;
  if (config.retry === 0) {
    return Promise.reject(error);
  }
  
  console.log(`Retrying API request (${MAX_RETRIES - config.retry + 1}/${MAX_RETRIES})...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return apiClient(config);
});

/**
 * Makes a request to the Hugging Face API with retry logic
 */
async function makeApiRequest(payload) {
  try {
    const config = {
      retry: MAX_RETRIES,
      method: 'post',
      url: API_URL,
      data: payload
    };
    
    console.log('Making API request with payload:', JSON.stringify(payload).substring(0, 200) + '...');
    const response = await apiClient(config);
    console.log('API response received:', response.status);
    
    if (!response.data || !response.data[0] || !response.data[0].generated_text) {
      console.error('Invalid API response format:', JSON.stringify(response.data).substring(0, 200));
      throw new Error('Invalid response format from API');
    }
    
    return response.data[0].generated_text;
  } catch (error) {
    console.error('API request failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data).substring(0, 500));
    }
    throw error;
  }
}

/**
 * Generates a daily coding interview question
 * @returns {Promise<string>} The generated question with difficulty and tags
 */
async function generateDailyQuestion() {
  try {
    const payload = {
      inputs: `Generate a coding interview question with difficulty level and tags.
      Format it as:
      Q: [question]
      Difficulty: [Easy/Medium/Hard]
      Tags: [tag1, tag2, ...]
      
      Make it concise and clear.`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    };
    
    return await makeApiRequest(payload);
  } catch (error) {
    console.error('Error generating daily question:', error);
    return "Sorry, I couldn't generate a question at this time. Please try again later.";
  }
}

/**
 * Generates an explanation for a coding question
 * @param {string} question - The question to explain
 * @returns {Promise<string>} The detailed explanation
 */
async function generateExplanation(question) {
  try {
    const payload = {
      inputs: `Question: ${question}
      
      Provide a detailed explanation for this coding interview question, including:
      1. Step-by-step approach
      2. Optimal algorithm
      3. Code implementation (preferably in Python)
      4. Time and space complexity analysis
      5. Edge cases to consider`,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    };
    
    return await makeApiRequest(payload);
  } catch (error) {
    console.error('Error generating explanation:', error);
    return "Sorry, I couldn't generate an explanation at this time. Please try again later.";
  }
}

/**
 * Handles general chatbot interactions
 * @param {string} userMessage - The user's message to the chatbot
 * @returns {Promise<string>} The chatbot's response
 */
async function chatWithBot(userMessage) {
  try {
    const payload = {
      inputs: `<s>[INST] You are a helpful coding assistant. Answer the following question about programming, algorithms, data structures, or coding interviews in a detailed and educational way.

Question: ${userMessage} [/INST]`,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false
      }
    };
    
    return await makeApiRequest(payload);
  } catch (error) {
    console.error('Error in chatbot conversation:', error);
    return "I'm currently experiencing some issues. Please try again later.";
  }
}

module.exports = {
  generateDailyQuestion,
  generateExplanation,
  chatWithBot
}; 