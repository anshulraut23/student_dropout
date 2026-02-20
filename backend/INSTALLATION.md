# Backend Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd student_dropout/backend
npm install
```

This will install all required packages including:
- express
- bcrypt
- jsonwebtoken
- better-sqlite3 (for persistent database)
- and more...

### 2. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and set your values:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Database

The SQLite database will be automatically created at:
```
student_dropout/backend/storage/education_assistant.db
```

### First Run

On first run, the database will be initialized with empty tables.
You can then:
1. Register an admin account
2. Create classes
3. Register teachers
4. And more...

### Data Persistence

✅ All data persists across server restarts
✅ No need to recreate schools, teachers, classes every time
✅ Database file is stored locally in the project

### Reset Database

If you want to start fresh:
```bash
rm storage/education_assistant.db
```

The database will be recreated on next server start.

## API Endpoints

Server runs on: `http://localhost:5000`

### Authentication
- POST `/api/auth/register/admin` - Register admin
- POST `/api/auth/register/teacher` - Register teacher
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Schools
- GET `/api/schools` - Get all schools

### Teachers (Admin only)
- GET `/api/teachers` - Get all teachers
- GET `/api/teachers/my-classes` - Get teacher's classes (Teacher only)

### Approvals (Admin only)
- GET `/api/approvals/pending` - Get pending requests
- POST `/api/approvals/approve/:teacherId` - Approve teacher
- POST `/api/approvals/reject/:teacherId` - Reject teacher

### Classes (Admin only)
- GET `/api/classes` - Get all classes
- POST `/api/classes` - Create class
- PUT `/api/classes/:classId` - Update class
- DELETE `/api/classes/:classId` - Delete class

### Subjects (Admin only)
- GET `/api/subjects` - Get all subjects
- GET `/api/subjects/class/:classId` - Get subjects by class
- POST `/api/subjects` - Create subject
- PUT `/api/subjects/:subjectId` - Update subject
- DELETE `/api/subjects/:subjectId` - Delete subject

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, change it in `.env`:
```
PORT=5001
```

### Database Locked

If you get "database is locked" error:
1. Make sure only one server instance is running
2. Close any database browser tools
3. Restart the server

### Module Not Found

If you get module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development

### Watch Mode

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Database Inspection

You can inspect the SQLite database using:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [SQLite Viewer VS Code Extension](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite)

Database location: `storage/education_assistant.db`
