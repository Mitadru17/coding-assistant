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
  timeout: 30000 // 30 second timeout - reduced from 60s to fail faster
});

// Add a retry mechanism
const MAX_RETRIES = 3;
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
  // Exponential backoff
  const backoff = Math.pow(2, MAX_RETRIES - config.retry) * 1000;
  await new Promise(resolve => setTimeout(resolve, backoff));
  return apiClient(config);
});

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = {
  question: `Q: Write a function that reverses a linked list.
Difficulty: Medium
Tags: Linked List, Two Pointers`,
  explanation: `# Linked List Reversal

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next one in the sequence. Reversing a linked list means changing the direction of all pointers.

## Approach:
1. Use three pointers: prev, current, and next
2. Iterate through the list, reversing each pointer

## Python Implementation:
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next  # Store next node
        current.next = prev       # Reverse pointer
        prev = current            # Move prev forward
        current = next_temp       # Move current forward
    
    return prev  # New head is the previous tail
\`\`\`

## Time & Space Complexity:
- Time Complexity: O(n) - one pass through the list
- Space Complexity: O(1) - only using a few pointers

## Test Cases:
- Empty list: Returns null
- Single node: Returns the same node
- Multiple nodes: Correctly reverses all pointers`,
  chat: "I'd be happy to help with your coding questions. What specific programming topic or problem would you like to discuss?"
};

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
    
    // Handle different response formats from Hugging Face
    if (response.data && typeof response.data === 'object') {
      if (Array.isArray(response.data) && response.data[0] && response.data[0].generated_text) {
        return cleanResponse(response.data[0].generated_text);
      } else if (response.data.generated_text) {
        return cleanResponse(response.data.generated_text);
      } else if (response.data.choices && response.data.choices[0] && response.data.choices[0].text) {
        return cleanResponse(response.data.choices[0].text);
      } else {
        console.log('Response data structure:', JSON.stringify(response.data).substring(0, 500));
        // If we can't identify a specific format, return the whole response as string
        return cleanResponse(JSON.stringify(response.data));
      }
    }
    
    console.error('Invalid API response format:', JSON.stringify(response.data).substring(0, 200));
    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('API request failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data).substring(0, 500));
    }
    
    // If it's a timeout error, return a specific message
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('API request timed out');
    }
    
    throw error;
  }
}

/**
 * Clean the response text to remove prompt/instruction text and formatting artifacts
 * @param {string} text - The raw response text
 * @returns {string} The cleaned response
 */
function cleanResponse(text) {
  if (!text) return '';
  
  // Remove common instruction patterns
  let cleaned = text.replace(/^.*?\[INST\].*?\[\/INST\]/s, '').trim();
  
  // Remove HTML-like tags
  cleaned = cleaned.replace(/<s>|<\/s>/g, '');
  
  // Remove "Question from student:" and similar prefixes
  cleaned = cleaned.replace(/Question from student:.*?$/m, '').trim();
  
  // Remove any remaining prompt text patterns
  cleaned = cleaned.replace(/You are CodeMentor,.*?expertise\./s, '').trim();
  cleaned = cleaned.replace(/Your responses are:.*?concept/s, '').trim();
  cleaned = cleaned.replace(/Respond with a helpful.*?examples\./s, '').trim();
  
  // Clean up any extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  
  // Remove "Hello! I'd be happy to explain" and similar openings
  cleaned = cleaned.replace(/^(Hello!|Hi there!|Sure,|I'd be happy to|Let me) .*(explain|describe|clarify|help you understand) .*?\./s, '').trim();
  
  return cleaned;
}

/**
 * Generates a daily coding interview question
 * @param {number} timestamp - Optional timestamp to prevent caching
 * @returns {Promise<string>} The generated question with difficulty and tags
 */
async function generateDailyQuestion(timestamp = Date.now()) {
  try {
    const prompt = `<s>[INST] Generate one coding interview question with difficulty level and tags.
Format exactly as:
Q: [question]
Difficulty: [Easy/Medium/Hard]
Tags: [tag1, tag2, ...]

Make it concise and challenging, focused on algorithms or data structures. 
Timestamp: ${timestamp} [/INST]`;
    
    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.8,
        top_p: 0.95,
        do_sample: true,
        // Add cache busting parameter
        seed: Math.floor(Math.random() * 100000)
      }
    };
    
    const result = await makeApiRequest(payload);
    
    // Additional cleanup for question format
    let cleanedResult = result;
    
    // Remove any potential model preamble before the Q:
    if (!cleanedResult.startsWith('Q:')) {
      cleanedResult = cleanedResult.replace(/^.*?Q:/s, 'Q:').trim();
    }
    
    // Remove any trailing text after the Tags section
    const tagsMatch = cleanedResult.match(/Tags:.*?(?:\n|$)/s);
    if (tagsMatch) {
      const tagsEndIndex = tagsMatch.index + tagsMatch[0].length;
      cleanedResult = cleanedResult.substring(0, tagsEndIndex).trim();
    }
    
    console.log('Generated question:', cleanedResult.substring(0, 100) + '...');
    
    return cleanedResult;
  } catch (error) {
    console.error('Error generating daily question:', error);
    // Return fallback question if API fails
    return FALLBACK_RESPONSES.question;
  }
}

/**
 * Generates an explanation for a coding question
 * @param {string} question - The question to explain
 * @returns {Promise<string>} The detailed explanation
 */
async function generateExplanation(question) {
  try {
    const prompt = `<s>[INST] Provide a detailed explanation for this coding interview question:

${question}

Include:
1. Problem understanding
2. Approach and algorithm
3. Code implementation in Python
4. Time and space complexity
5. Test cases

Use markdown formatting for structure. [/INST]`;
    
    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    };
    
    const result = await makeApiRequest(payload);
    console.log('Generated explanation length:', result.length);
    
    return result;
  } catch (error) {
    console.error('Error generating explanation:', error);
    // Return fallback explanation if API fails
    return FALLBACK_RESPONSES.explanation;
  }
}

/**
 * Handles general chatbot interactions
 * @param {string} userMessage - The user's message to the chatbot
 * @returns {Promise<string>} The chatbot's response
 */
async function chatWithBot(userMessage) {
  try {
    const prompt = `<s>[INST] You are CodeMentor, an expert coding tutor specialized in algorithms, data structures, and programming concepts. Answer the following question concisely and clearly without repeating the question or including any preamble.

Question: ${userMessage} [/INST]`;
    
    const payload = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    };
    
    const result = await makeApiRequest(payload);
    console.log('Generated chat response length:', result.length);
    
    return result;
  } catch (error) {
    console.error('Error in chatbot conversation:', error);
    // Return fallback response if API fails
    return FALLBACK_RESPONSES.chat;
  }
}

module.exports = {
  generateDailyQuestion,
  generateExplanation,
  chatWithBot
}; 