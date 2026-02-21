# Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd student_dropout
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd proactive-education-assistant
npm install
```

### 4. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

#### Frontend (.env)
```bash
cd proactive-education-assistant
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Create Test Data
```bash
cd backend
node add-test-data.js
```

## Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd proactive-education-assistant
npm run dev
```
Frontend runs on: http://localhost:5173

## Test Credentials

### Admin
- Email: `admin@school.com`
- Password: `admin123`

### Teachers
- Email: `teacher1@school.com` to `teacher4@school.com`
- Password: `admin123`

## Database

### Location
`backend/storage/education_assistant.db`

### Reset Database
```bash
cd backend
rm storage/education_assistant.db
node add-test-data.js
```

### View Data
```bash
cd backend
node show-test-data.js
```

## Troubleshooting

### Port Already in Use
Change the port in `.env` files.

### Database Errors
Delete and recreate the database:
```bash
rm backend/storage/education_assistant.db
node backend/add-test-data.js
```

### Module Not Found
Reinstall dependencies:
```bash
cd backend && npm install
cd ../proactive-education-assistant && npm install
```

## Next Steps

1. Login with test credentials
2. Explore the application
3. Run tests: `cd backend && node test-attendance-system.js`
4. Review documentation in `docs/` folder

---

For detailed feature documentation, see other files in the `docs/` folder.
