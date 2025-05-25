const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * GET /daily-question
 * Returns a daily coding interview question
 */
router.get('/daily-question', async (req, res, next) => {
  try {
    const question = await geminiService.generateDailyQuestion();
    res.json({ question });
  } catch (error) {
    console.error('Error in daily question route:', error);
    res.status(500).json({ 
      question: 'Sorry, failed to retrieve a daily question. Please try again.' 
    });
  }
});

/**
 * POST /explanation
 * Returns a detailed explanation for a coding interview question
 */
router.post('/explanation', async (req, res, next) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({
        explanation: 'Question is required'
      });
    }
    
    const explanation = await geminiService.generateExplanation(question);
    res.json({ explanation });
  } catch (error) {
    console.error('Error in explanation route:', error);
    res.status(500).json({ 
      explanation: 'Sorry, failed to generate an explanation. Please try again.' 
    });
  }
});

/**
 * POST /chat
 * Handles chatbot interactions for coding and interview questions
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        response: 'Message is required'
      });
    }
    
    const response = await geminiService.chatWithBot(message);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ 
      response: 'Sorry, failed to process your message. Please try again.' 
    });
  }
});

module.exports = router; 