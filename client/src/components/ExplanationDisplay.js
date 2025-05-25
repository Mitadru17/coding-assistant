import React from 'react';
import './ExplanationDisplay.css';

const ExplanationDisplay = ({ explanation }) => {
  if (!explanation) {
    return null;
  }

  // Function to process and format the explanation text
  const formatExplanation = (text) => {
    // Split text by newlines to handle different parts
    const lines = text.split('\n');
    
    // Track if we're inside a code block
    let isInCodeBlock = false;
    let codeBlock = '';
    const formattedContent = [];
    
    lines.forEach((line, index) => {
      // Check for Python code block markers
      if (line.trim().startsWith('```python') || line.trim().startsWith('```')) {
        isInCodeBlock = true;
        codeBlock = '';
        return;
      }
      
      if (isInCodeBlock && line.trim() === '```') {
        formattedContent.push(
          <pre key={`code-${index}`} className="code-block">
            <code>{codeBlock}</code>
          </pre>
        );
        isInCodeBlock = false;
        return;
      }
      
      if (isInCodeBlock) {
        codeBlock += line + '\n';
        return;
      }
      
      // Handle normal text with special formatting
      if (line.match(/^(Time Complexity|Space Complexity):/)) {
        formattedContent.push(
          <p key={index} className="complexity">
            <strong>{line}</strong>
          </p>
        );
      } else if (line.match(/^[0-9]+\./)) {
        // Numbered list items
        formattedContent.push(
          <p key={index} className="list-item">{line}</p>
        );
      } else if (line.trim() === '') {
        formattedContent.push(<br key={index} />);
      } else {
        formattedContent.push(<p key={index}>{line}</p>);
      }
    });
    
    return formattedContent;
  };

  return (
    <div className="explanation-display">
      <h3>Solution Explanation</h3>
      <div className="explanation-content">
        {formatExplanation(explanation)}
      </div>
    </div>
  );
};

export default ExplanationDisplay; 