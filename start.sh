#!/bin/bash

# ========================================
# HealthBot Monitor - Quick Start Script
# ========================================

set -e

echo "╔══════════════════════════════════════════════════╗"
echo "║       🏥 HealthBot Monitor - Setup Script        ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for required tools
check_requirements() {
    echo -e "${BLUE}📋 Checking requirements...${NC}"
    
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python 3 is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Python 3 found${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js found${NC}"
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm found${NC}"
    
    echo ""
}

# Setup environment file
setup_env() {
    echo -e "${BLUE}⚙️  Setting up environment...${NC}"
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${YELLOW}⚠️  Created .env from .env.example${NC}"
            echo -e "${YELLOW}   Please update .env with your API keys!${NC}"
        else
            echo -e "${RED}❌ No .env.example found${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✓ .env file exists${NC}"
    fi
    
    echo ""
}

# Setup backend
setup_backend() {
    echo -e "${BLUE}🐍 Setting up backend...${NC}"
    
    cd backend
    
    # Create virtual environment if not exists
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo -e "${GREEN}✓ Created virtual environment${NC}"
    fi
    
    # Activate and install dependencies
    source venv/bin/activate
    pip install --upgrade pip -q
    pip install -r requirements.txt -q
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    
    cd ..
    echo ""
}

# Setup frontend
setup_frontend() {
    echo -e "${BLUE}⚛️  Setting up frontend...${NC}"
    
    cd frontend
    npm install --silent
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    
    cd ..
    echo ""
}

# Start services
start_services() {
    echo -e "${BLUE}🚀 Starting services...${NC}"
    echo ""
    
    # Start backend in background
    echo -e "${YELLOW}Starting backend on http://localhost:8000${NC}"
    cd backend
    source venv/bin/activate
    python main.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 3
    
    # Start frontend
    echo -e "${YELLOW}Starting frontend on http://localhost:3000${NC}"
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  🎉 HealthBot Monitor is running!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Frontend:  ${BLUE}http://localhost:3000${NC}"
    echo -e "  Backend:   ${BLUE}http://localhost:8000${NC}"
    echo -e "  API Docs:  ${BLUE}http://localhost:8000/docs${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    
    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
    wait
}

# Main
main() {
    check_requirements
    setup_env
    setup_backend
    setup_frontend
    
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✅ Setup complete!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Before starting, make sure to update .env with:${NC}"
    echo -e "   - GOOGLE_API_KEY (from Google AI Studio)"
    echo -e "   - DD_API_KEY (from Datadog)"
    echo -e "   - DD_APP_KEY (from Datadog)"
    echo ""
    
    read -p "Start the services now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_services
    else
        echo ""
        echo -e "To start manually:"
        echo -e "  ${BLUE}Backend:${NC}  cd backend && source venv/bin/activate && python main.py"
        echo -e "  ${BLUE}Frontend:${NC} cd frontend && npm start"
    fi
}

main
