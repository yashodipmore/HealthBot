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

// InfoIcon and LoadingDots components available if needed

// Sample health questions for quick start
const SAMPLE_QUESTIONS = [
  "What are common symptoms of dehydration?",
  "How can I improve my sleep quality?",
  "What foods are good for heart health?",
  "How much water should I drink daily?",
  "What are the benefits of regular exercise?",
  "How can I reduce stress naturally?"
];

// Lightbulb icon for tips
const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

// Shield icon for disclaimer
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// Check icon
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

function Chat({ onMetricsUpdate }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  // eslint-disable-next-line no-unused-vars
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
    <div className="chat">
      {/* Sidebar */}
      <div className="chat-sidebar">
        {/* Header with New Chat */}
        <div className="sidebar-header">
          <h3>Chat History</h3>
          <button className="new-chat-btn" onClick={() => {
            setMessages([{
              id: 'welcome',
              role: 'assistant',
              content: `👋 Hello! I'm HealthBot, your AI health assistant.\n\nI can help you with:\n• General health questions\n• Symptom information\n• Nutrition and wellness tips\n• Lifestyle recommendations\n\n**Disclaimer:** I provide general information only. Always consult a healthcare professional for medical advice.\n\nHow can I help you today?`,
              timestamp: new Date()
            }]);
            setConversationId(null);
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="chat-history">
          {conversationId ? (
            <div className="history-item active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Current Chat</span>
            </div>
          ) : (
            <div className="history-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No chat history yet.<br/>Start a new conversation!</p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="sidebar-tips">
          <h4>Quick Tips</h4>
          <div className="tip-item">
            <CheckIcon />
            <span>Be specific with your questions</span>
          </div>
          <div className="tip-item">
            <CheckIcon />
            <span>Include relevant symptoms</span>
          </div>
          <div className="tip-item">
            <ShieldIcon />
            <span>Always consult a doctor</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-title">
            <div className="avatar">
              <BotIcon />
            </div>
            <div>
              <h2>HealthBot Assistant</h2>
              <span>Powered by Gemini AI</span>
            </div>
          </div>
          <div className="chat-header-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length <= 1 ? (
            /* Welcome Screen with Quick Prompts */
            <div className="welcome-message">
              <div className="welcome-icon">
                <BotIcon />
              </div>
              <h2>Welcome to HealthBot!</h2>
              <p>I'm your AI health assistant. Ask me anything about health, wellness, symptoms, or nutrition.</p>
              <div className="quick-prompts">
                {SAMPLE_QUESTIONS.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    className="quick-prompt"
                    onClick={() => handleQuickQuestion(q)}
                    disabled={isLoading}
                  >
                    <LightbulbIcon />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`message ${message.role === 'assistant' ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-avatar">
                  {message.role === 'assistant' ? <BotIcon /> : <UserIcon />}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {formatMessageContent(message.content)}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {message.metrics && (
                      <span style={{ marginLeft: '8px', color: '#f97316' }}>
                        {message.metrics.responseTime.toFixed(0)}ms • {message.metrics.tokens} tokens
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <BotIcon />
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Medical Disclaimer */}
        <div className="medical-disclaimer">
          <ShieldIcon />
          <span>HealthBot provides general information only. Always consult a healthcare professional for medical advice.</span>
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <div className="input-box">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question..."
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              className="send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
            >
              <SendIcon />
            </button>
          </div>
          <div className="input-hint">
            <span><kbd>Enter</kbd> to send</span>
            <span><kbd>Shift</kbd> + <kbd>Enter</kbd> for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
