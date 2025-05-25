const axios = require('axios');

// Test the daily question endpoint
async function testDailyQuestion() {
  try {
    console.log('Testing /daily-question endpoint...');
    const response = await axios.get('http://localhost:3000/daily-question');
    console.log('Success! Received response from /daily-question');
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Error calling /daily-question:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data));
      console.error('Status code:', error.response.status);
    }
    return false;
  }
}

// Test the explanation endpoint
async function testExplanation() {
  try {
    console.log('\nTesting /explanation endpoint...');
    const response = await axios.post('http://localhost:3000/explanation', {
      question: 'Write a function to find the maximum element in an array'
    });
    console.log('Success! Received response from /explanation');
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Error calling /explanation:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data));
      console.error('Status code:', error.response.status);
    }
    return false;
  }
}

// Test the chat endpoint
async function testChat() {
  try {
    console.log('\nTesting /chat endpoint...');
    const response = await axios.post('http://localhost:3000/chat', {
      message: 'What are the common sorting algorithms?'
    });
    console.log('Success! Received response from /chat');
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Error calling /chat:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data));
      console.error('Status code:', error.response.status);
    }
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== API Endpoint Tests ===');
  const questionSuccess = await testDailyQuestion();
  const explanationSuccess = await testExplanation();
  const chatSuccess = await testChat();
  
  console.log('\n=== Test Results ===');
  console.log('Daily Question endpoint:', questionSuccess ? 'PASSED' : 'FAILED');
  console.log('Explanation endpoint:', explanationSuccess ? 'PASSED' : 'FAILED');
  console.log('Chat endpoint:', chatSuccess ? 'PASSED' : 'FAILED');
}

// Run the tests
runAllTests(); 