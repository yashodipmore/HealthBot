/**
 * HealthBot Monitor - Main App Component
 * Professional White Theme with Orange Accents
 */
import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import { checkHealth } from './services/api';
import './App.css';

// Professional SVG Icons
const HeartPulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'chat', 'dashboard'
  const [activeTab, setActiveTab] = useState('chat');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsCheckingConnection(true);
        const health = await checkHealth();
        setIsConnected(health.status === 'healthy');
        setConnectionError(null);
      } catch (error) {
        setIsConnected(false);
        setConnectionError('Unable to connect to backend API. Make sure the server is running.');
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkConnection();
    
    // Periodically check connection
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle navigation from landing page
  const handleGetStarted = () => {
    setCurrentPage('app');
    setActiveTab('chat');
  };

  const handleGoHome = () => {
    setCurrentPage('landing');
  };

  // Show landing page
  if (currentPage === 'landing') {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="app">
      {/* Navigation Header */}
      <nav className="nav">
        <div className="nav-container">
          {/* Logo with Home button */}
          <div className="nav-logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
            <div className="nav-logo-icon">
              <HeartPulseIcon />
            </div>
            <h1>Health<span>Bot</span></h1>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <button
              className="nav-link"
              onClick={handleGoHome}
              title="Back to Home"
            >
              <HomeIcon />
              <span>Home</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <ChatIcon />
              <span>Chat</span>
            </button>
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Status */}
          <div className="nav-status">
            <div className="status-indicator">
              <span className={`status-dot ${isConnected ? '' : 'offline'}`}></span>
              <span>{isCheckingConnection ? 'Checking...' : isConnected ? 'Connected' : 'Offline'}</span>
            </div>
            <a
              href="https://github.com/yashodipmore/HealthBot"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              style={{ width: '44px', height: '44px' }}
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </nav>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="error-banner" style={{
          padding: '1rem 2rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderBottom: '2px solid #ef4444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ color: '#ef4444', fontWeight: 500 }}>⚠️ {connectionError}</span>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="tab-content">
          {activeTab === 'chat' ? <Chat /> : <Dashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with ❤️ for the Hackathon | Powered by{' '}
          <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer">
            Google Gemini
          </a>{' '}
          &{' '}
          <a href="https://www.datadoghq.com/" target="_blank" rel="noopener noreferrer">
            Datadog
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
