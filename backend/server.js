import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
    }))
  });
});

// Import dataStore for debug endpoint
import dataStore from './storage/dataStore.js';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
