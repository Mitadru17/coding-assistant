require('dotenv').config();
const axios = require('axios');

// Log environment variables
console.log('Environment variables:');
console.log('HF_API_KEY:', process.env.HF_API_KEY ? 'API Key is set' : 'API Key is not set');

// Test function for Hugging Face API
async function testHuggingFaceAPI() {
  const HF_API_URL = 'https://api-inference.huggingface.co/models';
  const HF_MODEL = 'facebook/bart-large-cnn';  // Using a summarization model that's widely available
  const HF_API_KEY = process.env.HF_API_KEY;

  try {
    console.log('Testing connection to Hugging Face API...');
    console.log('Model:', HF_MODEL);
    
    const response = await axios.post(
      `${HF_API_URL}/${HF_MODEL}`,
      {
        inputs: 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world.',
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Success! Received response from Hugging Face API');
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error calling Hugging Face API:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data));
      console.error('Status code:', error.response.status);
    }
  }
}

// Run the test
testHuggingFaceAPI(); 