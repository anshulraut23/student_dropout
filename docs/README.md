# Education Assistant Platform - Documentation

Complete documentation for the Proactive Education Assistant platform with ML-powered dropout prediction, gamification, and teacher collaboration features.

## 📚 Documentation Index

### Core System Documentation

#### Authentication & User Management
- [Authentication System](./AUTHENTICATION_SYSTEM.md) - Login, registration, role-based access
- [Teacher Management](./TEACHER_MANAGEMENT.md) - Teacher accounts and approval workflow
- [Profile System](./PROFILE_SYSTEM.md) - User profiles and settings

#### Academic Management
- [Class Management](./CLASS_MANAGEMENT.md) - Class creation and organization
- [Subject Management](./SUBJECT_MANAGEMENT.md) - Subject assignment and tracking
- [Student Management](./STUDENT_MANAGEMENT.md) - Student enrollment and records

#### Data Tracking
- [Attendance System](./ATTENDANCE_SYSTEM.md) - Daily and subject-wise attendance
- [Exam Management](./EXAM_MANAGEMENT.md) - Exam templates and scheduling
- [Marks Management](./MARKS_MANAGEMENT.md) - Grade entry and analytics
- [Behavior System](./BEHAVIOR_SYSTEM.md) - Behavior logging and tracking
- [Intervention System](./INTERVENTION_SYSTEM.md) - Student support interventions

### Advanced Features

#### AI/ML System
- [ML Risk Prediction](./ML_RISK_PREDICTION.md) - AI-powered dropout risk prediction
  - Random Forest classifier
  - Google Gemini AI explanations
  - Real-time risk scoring
  - Automated recommendations
  - Model retraining

#### Gamification & Engagement
- [Gamification System](./GAMIFICATION_SYSTEM.md) - Teacher engagement with XP and badges
  - XP earning system
  - Level progression (1-5)
  - Achievement badges
  - Daily task tracking
  - Login streaks

- [Leaderboard System](./LEADERBOARD_SYSTEM.md) - Competitive rankings
  - Real-time rankings
  - Multiple timeframes
  - Top 3 podium
  - Statistics dashboard

#### Teacher Collaboration
- [Faculty Connect](./FACULTY_CONNECT.md) - Teacher-to-teacher communication
  - Invitation-based connections
  - One-on-one messaging
  - File sharing (up to 1.5MB)
  - Real-time chat

### Setup & Development
- [Setup Guide](./SETUP.md) - Installation and configuration
- [Testing Guide](./TESTING.md) - Testing procedures
- [Backend Implementation Plan](./BACKEND_IMPLEMENTATION_PLAN.md) - Architecture overview

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Supabase)
- Python 3.8+ (for ML service)
- Google Gemini API key

### Installation
```bash
# Clone repository
git clone <repository-url>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../proactive-education-assistant
npm install

# Install ML service dependencies
cd ../ml-service
pip install -r requirements.txt
```

### Database Setup
```bash
cd backend
node scripts/apply-complete-schema.js
```

### Environment Configuration
```bash
# Backend (.env)
DATABASE_URL=your_supabase_url
JWT_SECRET=your_secret_key
ML_SERVICE_URL=http://localhost:5001

# ML Service (.env)
GEMINI_API_KEY=your_gemini_api_key
PORT=5001
```

### Running the Application
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd proactive-education-assistant
npm run dev

# Terminal 3: ML Service
cd ml-service
python app.py
```

## 📊 System Architecture

### Technology Stack
- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL
- **ML Service**: Python, Flask, scikit-learn, Google Gemini
- **Database**: PostgreSQL (Supabase)

### Key Components
1. **Core Platform**: Student data management
2. **ML Engine**: Risk prediction and recommendations
3. **Gamification**: Teacher engagement system
4. **Communication**: Faculty collaboration tools

## 🎯 Feature Overview

### For Teachers
- ✅ Mark attendance (daily/subject-wise)
- ✅ Enter exam marks
- ✅ Log student behavior
- ✅ Create interventions
- ✅ View at-risk students
- ✅ Earn XP and badges
- ✅ Compete on leaderboards
- ✅ Chat with colleagues

### For Admins
- ✅ Manage schools and teachers
- ✅ Create classes and subjects
- ✅ Approve teacher registrations
- ✅ View school-wide analytics
- ✅ Monitor teacher engagement
- ✅ Access ML predictions
- ✅ Export reports

## 📈 ML Risk Prediction

### How It Works
1. System collects student data (attendance, marks, behavior)
2. ML service extracts features and calculates risk score
3. Google Gemini AI generates personalized recommendations
4. Teachers receive alerts for high-risk students
5. Interventions are tracked and outcomes measured

### Risk Levels
- **Low** (0.0-0.3): Student performing well
- **Medium** (0.3-0.6): Minor concerns, monitor closely
- **High** (0.6-0.8): Significant risk, intervention needed
- **Critical** (0.8-1.0): Urgent action required

## 🎮 Gamification System

### XP Earning
- Mark Attendance: +20 XP
- Enter Marks: +30 XP
- Log Behavior: +20 XP
- Create Intervention: +40 XP
- Daily Login: +10 XP

### Levels
- Level 1: 0-299 XP
- Level 2: 300-999 XP
- Level 3: 1000-1999 XP
- Level 4: 2000-3999 XP
- Level 5: 4000+ XP

### Badges
- 👥 First 10 Students
- 🔥 7 Day Streak
- 📊 100 Attendance Records
- 💙 Student Supporter
- ⭐ Consistency Star

## 🔗 Faculty Connect

### Connection Process
1. Browse teachers in your school
2. Send invitation
3. Wait for acceptance
4. Start chatting

### Features
- Text messaging
- File attachments (PDF, DOC, images)
- Real-time updates
- Conversation history
- Search and filter

## 📱 API Documentation

### Base URLs
- Backend API: `http://localhost:5000/api`
- ML Service: `http://localhost:5001`

### Key Endpoints
- `/api/auth/*` - Authentication
- `/api/students/*` - Student management
- `/api/attendance/*` - Attendance tracking
- `/api/marks/*` - Marks management
- `/api/ml/*` - ML predictions
- `/api/gamification/*` - Gamification
- `/api/faculty/*` - Faculty Connect

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# ML service tests
cd ml-service
python -m pytest

# Frontend tests
cd proactive-education-assistant
npm test
```

### Test Scripts
```bash
# Test gamification
node backend/scripts/test-gamification-api.js

# Test faculty connect
node backend/scripts/test-faculty-connect.js

# Test leaderboard
node backend/scripts/test-leaderboard.js
```

## 🐛 Troubleshooting

### Common Issues
1. **Database connection failed**: Check DATABASE_URL in .env
2. **ML service not responding**: Ensure Python service is running
3. **XP not awarded**: Verify gamification tables exist
4. **Chat not working**: Check faculty_invites and faculty_messages tables

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm start
```

## 📝 Contributing

### Code Style
- Use ES6+ features
- Follow existing patterns
- Add comments for complex logic
- Write tests for new features

### Commit Messages
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactoring
- test: Testing

## 👥 Support
For issues and questions, please refer to the specific documentation files or contact the development team.

---

**Last Updated**: February 2026
**Version**: 1.0.0
