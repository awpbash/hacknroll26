#!/bin/bash

# CloudArch Setup Script
# This script automates the setup process for the CloudArch application

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                CloudArch Setup Script                      ║"
echo "║        Learn Cloud Architecture Like LeetCode!            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} detected${NC}"

# Check if MongoDB is installed or running
echo ""
echo -e "${BLUE}[2/6] Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB not detected locally${NC}"
    echo "  You can either:"
    echo "  1. Install MongoDB locally: https://www.mongodb.com/try/download/community"
    echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Install backend dependencies
echo ""
echo -e "${BLUE}[3/6] Installing backend dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

# Install frontend dependencies
echo ""
echo -e "${BLUE}[4/6] Installing frontend dependencies...${NC}"
cd client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

# Check if .env exists, if not copy from example
echo ""
echo -e "${BLUE}[5/6] Setting up environment variables...${NC}"
if [ ! -f server/.env ]; then
    if [ -f server/.env.example ]; then
        cp server/.env.example server/.env
        echo -e "${GREEN}✓ Created server/.env from template${NC}"
        echo -e "${YELLOW}⚠ Please edit server/.env to configure your database and API keys${NC}"
    fi
else
    echo -e "${GREEN}✓ server/.env already exists${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}[6/6] Setup complete!${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Installation successful!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "Starting the app (backend + frontend) in this terminal..."
echo -e "${YELLOW}Press Ctrl+C to stop both servers.${NC}"
echo ""

# --- NEW: Run backend + frontend automatically (old Steps 2 & 3) ---

BACKEND_CMD="npm run dev"
FRONTEND_CMD="npm start"

BACKEND_DIR="server"
FRONTEND_DIR="client"

PIDS=()

cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping servers...${NC}"
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done
    wait 2>/dev/null || true
    echo -e "${GREEN}✓ Servers stopped.${NC}"
}

trap cleanup INT TERM EXIT

echo -e "${BLUE}→ Starting backend (${BACKEND_CMD})...${NC}"
( cd "$BACKEND_DIR" && $BACKEND_CMD ) &
PIDS+=($!)

# small delay so backend starts first
sleep 1

echo -e "${BLUE}→ Starting frontend (${FRONTEND_CMD})...${NC}"
( cd "$FRONTEND_DIR" && $FRONTEND_CMD ) &
PIDS+=($!)

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Both servers are starting up.${NC}"
echo ""
echo "Backend:"
echo "  http://localhost:5000"
echo ""
echo "Frontend:"
echo "  http://localhost:3000"
echo ""
echo "Optional: Initialize sample challenges:"
echo "  curl -X POST http://localhost:5000/api/challenges/initialize"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}For detailed documentation, see README.md${NC}"
echo -e "${GREEN}For a quick start guide, see QUICKSTART.md${NC}"
echo ""
echo "Happy architecting! ☁️🏗️"

# Keep script alive while both processes run
wait
