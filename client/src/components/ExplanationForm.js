import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import './ExplanationForm.css';

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://basic-chatbot-orefb38c6-mitadrus-projects.vercel.app';

const ExplanationForm = ({ setExplanation, isLoading, setIsLoading }) => {
  const [questionText, setQuestionText] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionText.trim()) {
      return;
    }
    
    setIsLoading(true);
    setIsFormVisible(false);
    
    try {
      // Short delay for better UX
      setTimeout(async () => {
        const response = await axios.post(`${API_URL}/api/explanation`, {
          question: questionText
        });
        setExplanation(response.data.explanation);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error getting explanation:', error);
      setExplanation('Failed to get explanation. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <CSSTransition
      in={isFormVisible}
      timeout={300}
      classNames="form"
      unmountOnExit
    >
      <div className="explanation-form">
        <h3>Get Solution Explanation</h3>
        <p className="form-description">
          Paste your coding interview question below to get a detailed explanation of the solution.
        </p>
        
        <form onSubmit={handleSubmit}>
          <textarea 
            value={questionText} 
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Paste your coding question here..."
            rows={6}
            required
          />
          
          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !questionText.trim()}
          >
            {isLoading ? 'Generating Explanation...' : 'Get Explanation'}
          </button>
        </form>
      </div>
    </CSSTransition>
  );
};

export default ExplanationForm; 