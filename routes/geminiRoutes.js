const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * GET /
 * Root route - returns a simple status message
 */
router.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Coding Assistant API is running',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/daily-question', '/api/explanation', '/api/chat']
  });
});

/**
 * GET /daily-question
 * Returns a coding interview question
 */
router.get('/daily-question', async (req, res, next) => {
  console.log('Received request for daily question');
  try {
    // Add cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Force a new question by adding a timestamp parameter
    const question = await geminiService.generateDailyQuestion(Date.now());
    console.log('Question generated successfully');
    
    if (!question || typeof question !== 'string' || question.trim() === '') {
      throw new Error('Invalid question generated');
    }
    
    res.json({ 
      question,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in daily question route:', error.message, error.stack);
    res.status(500).json({ 
      error: true,
      question: 'Sorry, failed to retrieve a daily question. Please try again.',
      message: error.message
    });
  }
});

/**
 * POST /explanation
 * Returns a detailed explanation for a coding interview question
 */
router.post('/explanation', async (req, res, next) => {
  console.log('Received request for explanation');
  try {
    const { question } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        error: true,
        explanation: 'Question is required and must be a non-empty string'
      });
    }
    
    console.log('Generating explanation for question:', question.substring(0, 100) + (question.length > 100 ? '...' : ''));
    const explanation = await geminiService.generateExplanation(question);
    
    if (!explanation || typeof explanation !== 'string') {
      throw new Error('Invalid explanation generated');
    }
    
    res.json({ 
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in explanation route:', error.message, error.stack);
    res.status(500).json({ 
      error: true,
      explanation: 'Sorry, failed to generate an explanation. Please try again.',
      message: error.message
    });
  }
});

/**
 * POST /chat
 * Handles chatbot interactions for coding and interview questions
 */
router.post('/chat', async (req, res, next) => {
  console.log('Received chat request');
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: true,
        response: 'Message is required and must be a non-empty string'
      });
    }
    
    console.log('Processing chat message:', message.substring(0, 100) + (message.length > 100 ? '...' : ''));
    const response = await geminiService.chatWithBot(message);
    
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response generated');
    }
    
    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat route:', error.message, error.stack);
    res.status(500).json({ 
      error: true,
      response: 'Sorry, failed to process your message. Please try again.',
      message: error.message
    });
  }
});

module.exports = router; 