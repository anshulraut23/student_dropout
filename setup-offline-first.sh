#!/bin/bash

# Offline-First Mobile App Setup Script
# This script automates the setup process for converting the React app to Android APK

set -e  # Exit on error

echo "🚀 Starting Offline-First Mobile App Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js v18 or higher from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm ${NPM_VERSION} found${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${YELLOW}⚠️  Java is not installed${NC}"
    echo "Java JDK 17+ is required for Android builds"
    echo "Install from: https://www.oracle.com/java/technologies/downloads/"
else
    JAVA_VERSION=$(java --version 2>&1 | head -n 1)
    echo -e "${GREEN}✅ ${JAVA_VERSION} found${NC}"
fi

echo ""

# Navigate to frontend directory
echo -e "${BLUE}📂 Navigating to frontend directory...${NC}"
cd proactive-education-assistant

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo "This may take a few minutes..."
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check if Capacitor is already initialized
if [ -d "android" ]; then
    echo -e "${YELLOW}⚠️  Android platform already exists${NC}"
    read -p "Do you want to remove and recreate it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🗑️  Removing existing Android platform...${NC}"
        rm -rf android
        echo -e "${BLUE}🔧 Adding Android platform...${NC}"
        npx cap add android
    fi
else
    echo -e "${BLUE}🔧 Adding Android platform...${NC}"
    npx cap add android
fi

echo -e "${GREEN}✅ Android platform configured${NC}"
echo ""

# Build React app
echo -e "${BLUE}🏗️  Building React app...${NC}"
npm run build

echo -e "${GREEN}✅ React app built${NC}"
echo ""

# Sync with Capacitor
echo -e "${BLUE}🔄 Syncing with Capacitor...${NC}"
npx cap sync

echo -e "${GREEN}✅ Capacitor sync completed${NC}"
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 Next steps:${NC}"
echo ""
echo "1. Open Android Studio:"
echo -e "   ${YELLOW}npx cap open android${NC}"
echo ""
echo "2. Build APK in Android Studio:"
echo "   - Click Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo ""
echo "3. Or build via command line:"
echo -e "   ${YELLOW}cd android && ./gradlew assembleDebug${NC}"
echo ""
echo "4. Test on emulator or device"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   - Setup Guide: ../OFFLINE_FIRST_SETUP_GUIDE.md"
echo "   - Implementation Plan: ../OFFLINE_FIRST_IMPLEMENTATION_PLAN.md"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
