/**
 * HealthBot Monitor - Chat Component
 * Professional White Theme with Clean SVG Icons
 */
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';
import './Chat.css';

// Professional SVG Icons
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <circle cx="9" cy="14" r="1" />
    <circle cx="15" cy="14" r="1" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const HeartPulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </svg>
);

const LoadingDots = () => (
  <div className="typing-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// Sample health questions for quick start
const SAMPLE_QUESTIONS = [
  "What are common symptoms of dehydration?",
  "How can I improve my sleep quality?",
  "What foods are good for heart health?",
  "How much water should I drink daily?",
  "What are the benefits of regular exercise?",
  "How can I reduce stress naturally?"
];

function Chat({ onMetricsUpdate }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add welcome message on first load
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hello! I'm HealthBot, your AI health assistant.

I can help you with:
• General health questions
• Symptom information
• Nutrition and wellness tips
• Lifestyle recommendations

**Disclaimer:** I provide general information only. Always consult a healthcare professional for medical advice.

How can I help you today?`,
      timestamp: new Date()
    }]);
  }, []);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isLoading) return;

    setError(null);
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(messageText.trim(), conversationId);
      
      // Update conversation ID if new
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metrics: {
          tokens: response.tokens_used,
          responseTime: response.response_time_ms
        }
      };

      setMessages(prev => [...prev, botMessage]);

      // Notify parent about new metrics
      if (onMetricsUpdate) {
        onMetricsUpdate({
          responseTime: response.response_time_ms,
          tokens: response.tokens_used
        });
      }
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const formatMessageContent = (content) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Handle bullet points
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <li key={i}>{line.substring(2)}</li>;
        }
        // Handle headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={i}>{line.slice(2, -2)}</strong>;
        }
        // Handle bold text inline
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formatted = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return <p key={i}>{formatted}</p>;
      });
  };

  return (
    <div className="chat-container">
      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <BotIcon />
            </div>
            <div className="chat-header-text">
              <h2>HealthBot</h2>
              <p><span className="online-dot"></span> Online</p>
            </div>
          </div>
          {conversationId && (
            <span className="conversation-id">ID: {conversationId.slice(-8)}</span>
          )}
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'assistant' ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'assistant' ? <BotIcon /> : <UserIcon />}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {formatMessageContent(message.content)}
                </div>
                <div className="message-meta">
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.metrics && (
                    <span className="message-metrics">
                      {message.metrics.responseTime.toFixed(0)}ms • {message.metrics.tokens} tokens
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="message bot loading">
              <div className="message-avatar">
                <BotIcon />
              </div>
              <div className="message-content">
                <div className="message-text">
                  <LoadingDots />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="chat-error">
            <InfoIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a health question..."
            rows={1}
            disabled={isLoading}
          />
          <button
            className="send-button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? <LoadingDots /> : <SendIcon />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-section">
          <h3>Try asking:</h3>
          <div className="quick-questions-list">
            {SAMPLE_QUESTIONS.slice(0, 3).map((q, i) => (
              <button
                key={i}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
