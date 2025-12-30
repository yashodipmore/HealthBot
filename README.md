# 🏥 HealthBot Monitor

> AI-Powered Health Assistant with Complete Datadog Observability

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Datadog](https://img.shields.io/badge/Datadog-632CA6?logo=datadog&logoColor=white)](https://www.datadoghq.com/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [API Documentation](#-api-documentation)
- [Datadog Integration](#-datadog-integration)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

HealthBot Monitor is a production-ready AI health assistant that demonstrates complete observability using Datadog. It combines the power of Google's Gemini AI for intelligent health-related conversations with comprehensive monitoring, metrics, and alerting capabilities.

### Why HealthBot Monitor?

- 🤖 **Smart Health Assistant**: Leverages Google Gemini for accurate, helpful health information
- 📊 **Real-time Monitoring**: Complete observability with Datadog APM, metrics, and logging
- 🚨 **Intelligent Alerts**: Proactive detection of anomalies and performance issues
- 🎨 **Beautiful UI**: Modern, responsive React interface
- 🐳 **Production Ready**: Docker-based deployment with health checks

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 💬 **AI Chat** | Natural language health conversations powered by Gemini |
| 📈 **Live Metrics** | Real-time performance monitoring dashboard |
| ⏱️ **Response Tracking** | Track response times, token usage, and errors |
| 🔔 **Smart Alerts** | Configurable alerts for performance thresholds |
| 📊 **Analytics** | Historical data and trend analysis |

### Datadog Integration

- ✅ Custom Metrics (response time, token usage, error rate)
- ✅ APM Tracing (distributed tracing across services)
- ✅ Log Management (structured JSON logging)
- ✅ Detection Rules (anomaly detection)
- ✅ Dashboard Templates (pre-built visualizations)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 3000)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Chat UI    │  │  Dashboard   │  │   Alerts     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP/REST
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Port 8000)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Chat API    │  │ Metrics API  │  │ Alerts API   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│  ┌──────▼───────┐  ┌──────▼─────────────────▼───────┐          │
│  │Gemini Service│  │      Datadog Config            │          │
│  └──────┬───────┘  │  • Custom Metrics              │          │
│         │          │  • APM Tracing                 │          │
│         │          │  • Monitor/Alerts              │          │
│         │          │  • Structured Logging          │          │
│         │          └──────┬─────────────────────────┘          │
└─────────┼─────────────────┼─────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌──────────────────┐  ┌──────────────────────────────────────────┐
│  Google Gemini   │  │              Datadog                      │
│     API          │  │  ┌────────────┐  ┌───────────────────┐   │
│  (AI Responses)  │  │  │  Metrics   │  │  Monitors/Alerts  │   │
└──────────────────┘  │  │  Dashboard │  │  • High Response  │   │
                      │  └────────────┘  │  • Error Rate     │   │
                      │                  │  • Token Spike    │   │
                      │  ┌────────────┐  │  • Service Down   │   │
                      │  │    APM     │  └───────────────────┘   │
                      │  │  Tracing   │                          │
                      │  └────────────┘   → Email/Webhook Alerts │
                      └──────────────────────────────────────────┘
```

### Data Flow

1. **User Query**: User sends health question via React Chat UI
2. **API Request**: Frontend sends POST to `/chat` endpoint
3. **AI Processing**: Backend forwards query to Google Gemini API
4. **Metrics Collection**: Response time, tokens, errors tracked
5. **Datadog Push**: Metrics sent to Datadog in real-time
6. **Alert Evaluation**: Datadog monitors check thresholds
7. **Response**: AI response returned to user with metrics

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Generative AI** - Gemini API for LLM capabilities
- **ddtrace** - Datadog APM integration
- **datadog-api-client** - Custom metrics submission
- **structlog** - Structured JSON logging

### Frontend
- **React 18** - Modern UI library
- **Recharts** - Beautiful charts and graphs
- **Axios** - HTTP client
- **CSS Variables** - Custom theming

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/healthbot-monitor.git
cd healthbot-monitor
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 4. Start Frontend

```bash
# In a new terminal
cd frontend
npm install
npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## ⚙️ Environment Setup

### Required API Keys

#### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create new API key
4. Copy to `.env` as `GOOGLE_API_KEY`

#### 2. Datadog API Keys

1. Sign up at [Datadog](https://www.datadoghq.com/)
2. Go to Organization Settings → API Keys
3. Create new API Key → Copy to `DD_API_KEY`
4. Go to Application Keys
5. Create new App Key → Copy to `DD_APP_KEY`

### Complete `.env` File

```env
# Google Gemini API Key
GOOGLE_API_KEY=your_gemini_api_key_here

# Datadog Configuration
DD_API_KEY=your_datadog_api_key_here
DD_APP_KEY=your_datadog_app_key_here
DD_SITE=datadoghq.com

# Service Configuration
DD_SERVICE=healthbot-monitor
DD_ENV=development
DD_VERSION=1.0.0

# Application Settings
PORT=8000
HOST=0.0.0.0
DEBUG=true
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information |
| `GET` | `/health` | Health check |
| `POST` | `/chat` | Send message to AI |
| `GET` | `/metrics` | Get current metrics |
| `GET` | `/dashboard` | Dashboard data |
| `GET` | `/stats` | Detailed statistics |
| `GET` | `/alerts` | Get active alerts |
| `POST` | `/alerts/setup` | Setup Datadog monitors |
| `DELETE` | `/conversation/{id}` | Clear conversation |

### Chat Request

```json
POST /chat
{
  "message": "What are the symptoms of common cold?",
  "conversation_id": "optional_id"
}
```

### Chat Response

```json
{
  "response": "Common cold symptoms include...",
  "conversation_id": "conv_abc123",
  "tokens_used": 150,
  "response_time_ms": 1234.56,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Alerts Response

```json
GET /alerts
{
  "alerts": [
    {
      "type": "warning",
      "name": "Elevated Response Time",
      "message": "Average response time is 3500ms (> 3000ms)",
      "value": 3500
    }
  ],
  "total_alerts": 1,
  "critical_count": 0,
  "warning_count": 1
}
```

## 📊 Datadog Integration

### Custom Metrics Tracked

| Metric | Type | Description |
|--------|------|-------------|
| `healthbot.response_time_ms` | Gauge | API response latency |
| `healthbot.tokens_used` | Gauge | Tokens per request |
| `healthbot.request_count` | Gauge | Total request count |
| `healthbot.error_count` | Gauge | Total errors |
| `healthbot.error_rate` | Gauge | Error percentage |

### 🚨 Alerting System

HealthBot Monitor includes a comprehensive alerting system that can be configured to send notifications via email or webhook.

#### Default Monitors

| Alert Name | Condition | Threshold |
|------------|-----------|-----------|
| High Response Time | Avg response > 5s | Critical: 5000ms, Warning: 3000ms |
| High Error Rate | Error rate > 5% | Critical: 5%, Warning: 2% |
| Token Usage Spike | Tokens > 10000/min | Critical: 10000, Warning: 5000 |
| Service Down | No requests in 10min | Critical threshold |

#### Setup Alerts via API

```bash
# Setup alerts with email notification
curl -X POST "http://localhost:8000/alerts/setup?email=your@email.com"

# Response
{
  "message": "Datadog alerts configured successfully",
  "monitors_created": 4,
  "monitors": [...]
}
```

### Setting Up Datadog Dashboard

1. Log in to Datadog
2. Go to Dashboards → New Dashboard
3. Add widgets with metrics prefixed `healthbot.*`
4. Configure time range and refresh interval

### Detection Rules (Alerts)

Create these alerts in Datadog:

1. **High Response Time**
   - Metric: `healthbot.response_time_ms`
   - Alert when: avg > 5000 for 5 minutes

2. **High Error Rate**
   - Metric: `healthbot.error_rate`
   - Alert when: > 5% for 5 minutes

3. **Token Usage Spike**
   - Metric: `healthbot.tokens_used`
   - Alert when: anomaly detected

## 🐳 Deployment

### Quick Deploy to Google Cloud Run

We provide an automated deployment script:

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will:
1. Build Docker images for frontend and backend
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Configure environment variables
5. Output the live URLs

### Using Docker Compose (Local)

```bash
# Production (full stack with Datadog agent)
docker-compose up -d

# Development (backend only)
docker-compose -f docker-compose.dev.yml up -d
```

### Manual Deployment

#### Backend (Cloud Run)

```bash
cd backend

# Build and submit
gcloud builds submit --tag gcr.io/PROJECT_ID/healthbot-backend

# Deploy with environment variables
gcloud run deploy healthbot-backend \
    --image gcr.io/PROJECT_ID/healthbot-backend \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars "GOOGLE_API_KEY=xxx,DD_API_KEY=xxx,DD_APP_KEY=xxx"
```

#### Frontend (Vercel or Cloud Run)

```bash
cd frontend

# Option 1: Vercel
npm run build
vercel deploy --prod

# Option 2: Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/healthbot-frontend
gcloud run deploy healthbot-frontend \
    --image gcr.io/PROJECT_ID/healthbot-frontend \
    --region us-central1 \
    --allow-unauthenticated
```

### Cloud Build (CI/CD)

For automated deployments on every push:

```bash
# Connect repository to Cloud Build
gcloud builds submit --config=cloudbuild.yaml \
    --substitutions=_GOOGLE_API_KEY="xxx",_DD_API_KEY="xxx",_DD_APP_KEY="xxx"
```

## 📸 Screenshots

### Chat Interface
Modern chat UI with health queries and AI responses.

### Monitoring Dashboard
Real-time metrics with response time graphs, success rates, and token usage.

### Datadog Integration
Custom dashboard showing all tracked metrics and alerts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities
- [Datadog](https://www.datadoghq.com/) - Observability platform
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [React](https://reactjs.org/) - UI library

---

Built with ❤️ for the Hackathon

**Made by [Your Name]**
