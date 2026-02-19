import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Debug endpoint - remove in production
app.get('/api/debug/data', (req, res) => {
  const schools = dataStore.getSchools();
  const users = dataStore.getUsers();
  const requests = dataStore.getRequests();
  
  res.json({
    schools: schools.map(s => ({ id: s.id, name: s.name, adminId: s.adminId })),
    users: users.map(u => ({ 
      id: u.id, 
      email: u.email, 
      role: u.role, 
      schoolId: u.schoolId, 
      status: u.status 
    })),
    requests: requests
  });
});

// Import dataStore for debug endpoint
import dataStore from './storage/dataStore.js';

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
