import React, { useState } from 'react';
import axios from 'axios';
import './ChatInterface.css';

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://basic-chatbot-orefb38c6-mitadrus-projects.vercel.app';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      text: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Call backend API
      const response = await axios.post(`${API_URL}/api/chat`, { message: userMessage.text });
      
      // Add bot response to chat
      const botMessage = {
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Add error message
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to format code blocks in messages
  const formatMessage = (text) => {
    if (!text) return null;
    
    // Split by code block markers
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract the code and language (if specified)
        let code = part.slice(3, -3).trim();
        let language = '';
        
        // Check if language is specified
        const firstLineEnd = code.indexOf('\n');
        if (firstLineEnd > 0) {
          language = code.substring(0, firstLineEnd).trim();
          if (language && !language.includes(' ')) {
            code = code.substring(firstLineEnd + 1);
          } else {
            language = '';
          }
        }
        
        return (
          <pre key={index} className="code-block">
            {language && <div className="code-language">{language}</div>}
            <code>{code}</code>
          </pre>
        );
      }
      
      // Regular text
      return <p key={index} dangerouslySetInnerHTML={{ __html: formatInlineCode(part) }} />;
    });
  };
  
  // Format inline code snippets
  const formatInlineCode = (text) => {
    return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  };
  
  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Coding Assistant</h3>
        <p className="chat-description">
          Ask any coding or interview related questions
        </p>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>👋 Hi there! I'm your coding interview assistant.</p>
            <p>Ask me anything about coding problems, algorithms, data structures, or interview preparation.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`chat-message ${msg.sender} ${msg.isError ? 'error' : ''}`}
            >
              <div className="message-content">
                {formatMessage(msg.text)}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="chat-message bot loading">
            <div className="loading-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
      </div>
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a coding or interview question..."
          rows={2}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !userInput.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface; 