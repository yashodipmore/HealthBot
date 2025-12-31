/**
 * HealthBot Monitor - Landing Page
 * Professional White + Orange Theme
 */
import React from 'react';
import './Landing.css';

// Icons
const HeartPulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const DatadogIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="datadog-icon">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M8 14c.5-1 1.5-1 2-1s1 .5 1.5 1c.5.5 1.5.5 2 0 .5-.5 1-1 1.5-1s1.5 0 2 1"/>
    <circle cx="9" cy="10" r="1.5"/>
    <circle cx="15" cy="10" r="1.5"/>
  </svg>
);

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

function Landing({ onGetStarted }) {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <nav className="landing-nav">
          <div className="nav-logo">
            <div className="logo-icon">
              <HeartPulseIcon />
            </div>
            <span>Health<span className="accent">Bot</span></span>
          </div>
          <div className="nav-links-landing">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#features">Features</a>
            <a href="#tech">Technology</a>
            <a href="#team">Team</a>
          </div>
          <button className="btn-primary" onClick={onGetStarted}>
            Try HealthBot
            <ArrowRightIcon />
          </button>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Hackathon Project 2025
          </div>
          
          <h1>
            AI-Powered Health Assistant
            <span className="hero-highlight">with Real-Time Observability</span>
          </h1>
          
          <p className="hero-description">
            HealthBot combines the power of <strong>Google Gemini AI</strong> with 
            <strong> Datadog's enterprise-grade monitoring</strong> to deliver intelligent 
            health guidance while maintaining complete system transparency.
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime Monitoring</span>
            </div>
            <div className="stat">
              <span className="stat-number">&lt;500ms</span>
              <span className="stat-label">Response Time</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">AI Available</span>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="btn-primary btn-large" onClick={onGetStarted}>
              Start Health Chat
              <ArrowRightIcon />
            </button>
            <a href="#features" className="btn-secondary btn-large">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="mockup-title">HealthBot Chat</span>
            </div>
            <div className="mockup-content">
              <div className="mockup-message bot">
                <div className="mockup-avatar"><HeartPulseIcon /></div>
                <div className="mockup-bubble">
                  Hello! I'm HealthBot, your AI health assistant. How can I help you today?
                </div>
              </div>
              <div className="mockup-message user">
                <div className="mockup-bubble">
                  What are some tips for better sleep?
                </div>
              </div>
              <div className="mockup-message bot">
                <div className="mockup-avatar"><HeartPulseIcon /></div>
                <div className="mockup-bubble">
                  Here are evidence-based tips for better sleep quality...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="section problem-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">The Challenge</span>
            <h2>Healthcare Meets Technology Gap</h2>
            <p>
              In today's fast-paced world, people struggle to get quick, reliable health 
              information while healthcare systems lack proper monitoring and observability.
            </p>
          </div>
          
          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <ClockIcon />
              </div>
              <h3>Delayed Health Guidance</h3>
              <p>
                People wait hours or days to get answers to basic health questions, 
                leading to anxiety and potentially delayed care.
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <AlertIcon />
              </div>
              <h3>No System Visibility</h3>
              <p>
                Most health applications lack proper monitoring, making it impossible 
                to track performance, errors, or system health in real-time.
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <ShieldIcon />
              </div>
              <h3>Trust & Reliability Issues</h3>
              <p>
                Without proper observability, users can't trust that the system is 
                working correctly or that their data is being handled properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="section solution-section">
        <div className="section-container">
          <div className="solution-content">
            <div className="solution-text">
              <span className="section-tag">Our Solution</span>
              <h2>HealthBot Monitor</h2>
              <p className="solution-description">
                We built an AI health assistant that doesn't just answer questions – 
                it provides <strong>complete transparency</strong> through enterprise-grade 
                observability powered by Datadog.
              </p>
              
              <ul className="solution-benefits">
                <li>
                  <CheckCircleIcon />
                  <span>Instant AI-powered health guidance using Gemini 2.5</span>
                </li>
                <li>
                  <CheckCircleIcon />
                  <span>Real-time metrics dashboard with live updates</span>
                </li>
                <li>
                  <CheckCircleIcon />
                  <span>Complete request tracking and performance monitoring</span>
                </li>
                <li>
                  <CheckCircleIcon />
                  <span>Proactive alerts for system health issues</span>
                </li>
                <li>
                  <CheckCircleIcon />
                  <span>Token usage and response time analytics</span>
                </li>
              </ul>
              
              <button className="btn-primary btn-large" onClick={onGetStarted}>
                Experience HealthBot
                <ArrowRightIcon />
              </button>
            </div>
            
            <div className="solution-visual">
              <div className="solution-diagram">
                <div className="diagram-node user-node">
                  <span>User</span>
                </div>
                <div className="diagram-arrow">→</div>
                <div className="diagram-node main-node">
                  <HeartPulseIcon />
                  <span>HealthBot</span>
                </div>
                <div className="diagram-connections">
                  <div className="diagram-branch">
                    <div className="diagram-arrow">→</div>
                    <div className="diagram-node ai-node">
                      <GeminiIcon />
                      <span>Gemini AI</span>
                    </div>
                  </div>
                  <div className="diagram-branch">
                    <div className="diagram-arrow">→</div>
                    <div className="diagram-node datadog-node">
                      <DatadogIcon />
                      <span>Datadog</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>Everything You Need</h2>
            <p>
              A complete health assistant with built-in observability 
              for production-ready deployments.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-icon">
                <BrainIcon />
              </div>
              <h3>Gemini 2.5 AI</h3>
              <p>
                Powered by Google's latest Gemini 2.5 Flash model for accurate, 
                contextual health information with natural conversation flow.
              </p>
              <span className="feature-badge">Core Feature</span>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ChartIcon />
              </div>
              <h3>Live Dashboard</h3>
              <p>
                Real-time metrics visualization including response times, 
                success rates, and token usage with auto-refresh capability.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <AlertIcon />
              </div>
              <h3>Smart Alerts</h3>
              <p>
                Automated detection of high response times, error spikes, 
                and system anomalies with instant notifications.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ShieldIcon />
              </div>
              <h3>Health-First Design</h3>
              <p>
                Built with medical disclaimers, encouraging professional 
                consultation while providing helpful general guidance.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ClockIcon />
              </div>
              <h3>Performance Tracking</h3>
              <p>
                Every request is tracked with response time, token count, 
                and success/failure status for complete transparency.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <DatadogIcon />
              </div>
              <h3>Datadog Integration</h3>
              <p>
                Enterprise-grade observability with custom metrics, 
                APM tracing, and centralized logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tech" className="section tech-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Technology Stack</span>
            <h2>Built with Modern Tech</h2>
            <p>
              Production-ready architecture using industry-standard technologies.
            </p>
          </div>
          
          <div className="tech-grid">
            <div className="tech-category">
              <h3>Frontend</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-name">React 18</span>
                  <span className="tech-desc">UI Framework</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Recharts</span>
                  <span className="tech-desc">Data Visualization</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Axios</span>
                  <span className="tech-desc">HTTP Client</span>
                </div>
              </div>
            </div>
            
            <div className="tech-category">
              <h3>Backend</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-name">FastAPI</span>
                  <span className="tech-desc">Python Framework</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Uvicorn</span>
                  <span className="tech-desc">ASGI Server</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Pydantic</span>
                  <span className="tech-desc">Data Validation</span>
                </div>
              </div>
            </div>
            
            <div className="tech-category">
              <h3>AI & Monitoring</h3>
              <div className="tech-items">
                <div className="tech-item highlight">
                  <span className="tech-name">Google Gemini 2.5</span>
                  <span className="tech-desc">AI Model</span>
                </div>
                <div className="tech-item highlight">
                  <span className="tech-name">Datadog</span>
                  <span className="tech-desc">Observability</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Structlog</span>
                  <span className="tech-desc">Logging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to Experience HealthBot?</h2>
            <p>
              Try our AI health assistant with real-time monitoring. 
              Ask any health question and see the observability in action.
            </p>
            <button className="btn-primary btn-large btn-white" onClick={onGetStarted}>
              Launch HealthBot
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section team-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Our Team</span>
            <h2>Meet the Builders</h2>
            <p>
              A passionate team of developers building the future of health tech.
            </p>
          </div>
          
          <div className="team-grid">
            <div className="team-card leader">
              <div className="team-avatar">YM</div>
              <h3>Yashodip More</h3>
              <span className="team-role">Team Leader</span>
              <p>Full Stack Development & Architecture</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">S</div>
              <h3>Sarthak</h3>
              <span className="team-role">Developer</span>
              <p>Backend & API Development</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">KK</div>
              <h3>Komal Kumavat</h3>
              <span className="team-role">Developer</span>
              <p>Frontend & UI Design</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">TP</div>
              <h3>Tejas Patil</h3>
              <span className="team-role">Developer</span>
              <p>Integration & Testing</p>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">JG</div>
              <h3>Jaykumar Girase</h3>
              <span className="team-role">Developer</span>
              <p>DevOps & Deployment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="logo-icon">
                <HeartPulseIcon />
              </div>
              <span>Health<span className="accent">Bot</span></span>
            </div>
            <p>AI Health Assistant with Datadog Observability</p>
          </div>
          
          <div className="footer-links">
            <a href="https://github.com/yashodipmore/HealthBot" target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              GitHub
            </a>
          </div>
          
          <div className="footer-bottom">
            <p>Built with ❤️ for Hackathon 2025</p>
            <p className="team-credit">
              Team: Sarthak • <strong>Yashodip More (Leader)</strong> • Komal Kumavat • Tejas Patil • Jaykumar Girase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
