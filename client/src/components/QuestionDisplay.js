import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuestionDisplay.css';

const QuestionDisplay = ({ question, setQuestion, isLoading, setIsLoading }) => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (question) {
      setShowContent(true);
    }
  }, [question]);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setShowContent(false);
    try {
      const response = await axios.get('/daily-question');
      
      // Short delay for better UX
      setTimeout(() => {
        setQuestion(response.data.question);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching question:', error);
      setQuestion('Failed to load question. Please try again.');
      setIsLoading(false);
    }
  };

  const formatQuestion = (text) => {
    if (!text) return null;
    
    // Split by newlines and format according to expected structure
    const lines = text.split('\n');
    
    return (
      <>
        {lines.map((line, index) => {
          if (line.startsWith('Q:')) {
            return <h3 key={index} className="question-title">{line}</h3>;
          } else if (line.startsWith('Difficulty:')) {
            // Extract difficulty level to apply appropriate styling
            const difficulty = line.toLowerCase();
            let difficultyClass = "";
            
            if (difficulty.includes("easy")) {
              difficultyClass = "easy";
            } else if (difficulty.includes("medium")) {
              difficultyClass = "medium";
            } else if (difficulty.includes("hard")) {
              difficultyClass = "hard";
            }
            
            return <p key={index} className={`question-difficulty ${difficultyClass}`}>{line}</p>;
          } else if (line.startsWith('Tags:')) {
            return <p key={index} className="question-tags">{line}</p>;
          } else if (line.trim() === '') {
            return <br key={index} />;
          } else {
            return <p key={index}>{line}</p>;
          }
        })}
      </>
    );
  };

  return (
    <div className="question-display">
      <button 
        className={`fetch-button ${isLoading ? 'loading' : ''}`}
        onClick={fetchQuestion}
        disabled={isLoading}
      >
        {isLoading ? 'Generating Question...' : 'Get Daily Question'}
      </button>
      
      <div className={`question-content ${isLoading ? 'loading' : ''} ${showContent ? 'fadeIn' : ''}`}>
        {question ? (
          formatQuestion(question)
        ) : (
          <p className="placeholder-text">
            Click the button above to get your daily coding interview question.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay; 