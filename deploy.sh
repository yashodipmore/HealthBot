#!/bin/bash

# HealthBot Monitor - Cloud Run Deployment Script
# This script deploys the application to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 HealthBot Monitor - Cloud Run Deployment${NC}"
echo "=============================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo "   Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}⚠️ Please login to Google Cloud:${NC}"
    gcloud auth login
fi

# Get or set project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}Enter your Google Cloud Project ID:${NC}"
    read PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo -e "${GREEN}📦 Using project: $PROJECT_ID${NC}"

# Check for required environment variables
if [ -z "$GOOGLE_API_KEY" ]; then
    echo -e "${YELLOW}Enter your Google API Key (Gemini):${NC}"
    read GOOGLE_API_KEY
fi

if [ -z "$DD_API_KEY" ]; then
    echo -e "${YELLOW}Enter your Datadog API Key:${NC}"
    read DD_API_KEY
fi

if [ -z "$DD_APP_KEY" ]; then
    echo -e "${YELLOW}Enter your Datadog App Key:${NC}"
    read DD_APP_KEY
fi

# Enable required APIs
echo -e "${GREEN}🔧 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Set region
REGION="us-central1"

# Build and deploy Backend
echo -e "${GREEN}🐳 Building Backend Docker image...${NC}"
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/healthbot-backend

echo -e "${GREEN}🚀 Deploying Backend to Cloud Run...${NC}"
gcloud run deploy healthbot-backend \
    --image gcr.io/$PROJECT_ID/healthbot-backend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars "GOOGLE_API_KEY=$GOOGLE_API_KEY,DD_API_KEY=$DD_API_KEY,DD_APP_KEY=$DD_APP_KEY,DD_SITE=datadoghq.com" \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10

# Get backend URL
BACKEND_URL=$(gcloud run services describe healthbot-backend --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"

cd ..

# Build and deploy Frontend
echo -e "${GREEN}🐳 Building Frontend Docker image...${NC}"
cd frontend

# Update frontend to use backend URL
echo "REACT_APP_API_URL=$BACKEND_URL" > .env.production

gcloud builds submit --tag gcr.io/$PROJECT_ID/healthbot-frontend \
    --build-arg REACT_APP_API_URL=$BACKEND_URL

echo -e "${GREEN}🚀 Deploying Frontend to Cloud Run...${NC}"
gcloud run deploy healthbot-frontend \
    --image gcr.io/$PROJECT_ID/healthbot-frontend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 256Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 5

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe healthbot-frontend --region $REGION --format 'value(status.url)')

cd ..

echo ""
echo -e "${GREEN}=============================================="
echo "🎉 Deployment Complete!"
echo "=============================================="
echo ""
echo "📱 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL:  $BACKEND_URL"
echo "📊 API Docs:     $BACKEND_URL/docs"
echo ""
echo "Next steps:"
echo "1. Visit your frontend URL to test the chatbot"
echo "2. Check Datadog dashboard for metrics"
echo "3. Setup alerts: POST $BACKEND_URL/alerts/setup"
echo "===============================================${NC}"
