import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import examTemplateRoutes from './routes/examTemplateRoutes.js';
import examPeriodRoutes from './routes/examPeriodRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import behaviorRoutes from './routes/behaviorRoutes.js';
import interventionRoutes from './routes/interventionRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import mlRoutes from './ml-integration/routes.js';
import dataStore from './storage/dataStore.js';
import { connectPostgres } from './database/connection.js';

const app = express();
const PORT = process.env.PORT || 5000;

const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();
if (dbType === 'postgres') {
  console.log('📊 Using PostgreSQL/Supabase for persistent data storage');
} else if (dbType === 'memory') {
  console.log('⚠️  Using in-memory storage (no persistence)');
} else {
  console.log('📊 Using SQLite for persistent data storage');
  console.log('💾 Database file: ./storage/education_assistant.db');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/exam-templates', examTemplateRoutes);
app.use('/api/exam-periods', examPeriodRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/ml', mlRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Debug endpoint - remove in production
app.get('/api/debug/data', (req, res) => {
  const schools = dataStore.getSchools();
  const users = dataStore.getUsers();
  const requests = dataStore.getRequests();
  const classes = dataStore.getClasses();
  const subjects = dataStore.getSubjects();
  const attendance = dataStore.getAttendance();
  const exams = dataStore.getExams({});
  const marks = dataStore.getMarks({});
  
  res.json({
    schools: schools.map(s => ({ id: s.id, name: s.name, adminId: s.adminId })),
    users: users.map(u => ({ 
      id: u.id, 
      email: u.email, 
      role: u.role, 
      schoolId: u.schoolId, 
      status: u.status 
    })),
    requests: requests,
    classes: classes.map(c => ({
      id: c.id,
      name: c.name,
      schoolId: c.schoolId,
      teacherId: c.teacherId,
      grade: c.grade,
      section: c.section
    })),
    subjects: subjects.map(s => ({
      id: s.id,
      name: s.name,
      classId: s.classId,
      teacherId: s.teacherId,
      schoolId: s.schoolId
    })),
    attendance: attendance.map(a => ({
      id: a.id,
      studentId: a.studentId,
      classId: a.classId,
      subjectId: a.subjectId,
      date: a.date,
      status: a.status
    })),
    exams: exams.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type,
      classId: e.classId,
      subjectId: e.subjectId,
      totalMarks: e.totalMarks,
      examDate: e.examDate,
      status: e.status
    })),
    marks: marks.map(m => ({
      id: m.id,
      examId: m.examId,
      studentId: m.studentId,
      marksObtained: m.marksObtained,
      percentage: m.percentage,
      grade: m.grade,
      status: m.status
    }))
  });
});

// Import dataStore for debug endpoint
// (already imported at top)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Initialize PostgreSQL connection if using postgres
    if (dbType === 'postgres') {
      await connectPostgres();
      console.log('✅ Database connection initialized');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`✨ Database is clean - Register your school to get started`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
