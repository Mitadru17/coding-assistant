import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './App.css';
import QuestionDisplay from './components/QuestionDisplay';
import ExplanationForm from './components/ExplanationForm';
import ExplanationDisplay from './components/ExplanationDisplay';
import ChatInterface from './components/ChatInterface';

function App() {
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('question');

  return (
    <div className="App">
      <header className="header">
        <h1>Coding Interview Question Generator</h1>
      </header>
      
      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'question' ? 'active' : ''}`}
            onClick={() => setActiveTab('question')}
          >
            Daily Question
          </button>
          <button 
            className={`tab ${activeTab === 'explanation' ? 'active' : ''}`}
            onClick={() => setActiveTab('explanation')}
          >
            Get Explanation
          </button>
          <button 
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat Assistant
          </button>
        </div>

        <div className="content-area">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={activeTab}
              timeout={300}
              classNames="tab-content"
            >
              <div>
                {activeTab === 'question' ? (
                  <QuestionDisplay 
                    question={question} 
                    setQuestion={setQuestion} 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                ) : activeTab === 'explanation' ? (
                  <>
                    <ExplanationForm 
                      setExplanation={setExplanation} 
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                    <ExplanationDisplay explanation={explanation} />
                  </>
                ) : (
                  <ChatInterface />
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
      
      <footer className="footer">
        <p>Powered by Hugging Face</p>
      </footer>
    </div>
  );
}

export default App; 