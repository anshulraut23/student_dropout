# Quick Start Guide - Student Dropout Prevention System

## 🎯 Current Status: FULLY WORKING ✅

All systems are operational:
- ✅ Database connected (Supabase PostgreSQL)
- ✅ Backend server running (Port 5000)
- ✅ Frontend running (Port 5173)
- ✅ All 20 tables created and populated
- ✅ 13 users registered
- ✅ Authentication working

## 🔐 Login Credentials

### Admin Accounts
1. **GPP School Admin**
   - Email: `gpp@gmail.com`
   - Password: `123456`
   - School: GPP (Pune)

2. **Demo School Admin**
   - Email: `admin@demo.com`
   - Password: `admin123`
   - School: Demo High School

### Teacher Accounts (Approved)
1. **Teacher 1** - teacher1@demo.com (password unknown - use reset script)
2. **Teacher 2** - teacher2@demo.com (password unknown - use reset script)
3. **Student24** - student24@gmail.com (password unknown - use reset script)

To set a password for any teacher:
```bash
node backend/reset-password.js teacher1@demo.com newPassword123
```

## 🚀 How to Start

### 1. Start Backend Server
```bash
cd backend
npm start
```
Server will run on: http://localhost:5000

### 2. Start Frontend
```bash
cd proactive-education-assistant
npm run dev
```
Frontend will run on: http://localhost:5173

### 3. Login
- Go to http://localhost:5173
- Use any of the credentials above
- Admin can approve pending teachers

## 📊 Database Information

### Tables Created (20 total)
- users, schools, requests
- classes, subjects, students
- attendance, exams, marks
- exam_templates, exam_periods
- behaviors, interventions
- faculty_invites, faculty_messages
- teacher_gamification, xp_logs, badges, teacher_badges
- risk_predictions

### Current Data
- **Users:** 13 (2 admins, 11 teachers)
- **Schools:** 2 (GPP, Demo High School)
- **Pending Approvals:** 8 teachers waiting for admin approval

## 🛠️ Useful Commands

### Check Database Connection
```bash
node backend/test-db-connection.js
```

### List All Users
```bash
node backend/list-all-users.js
```

### Check Specific User
```bash
node backend/check-user.js email@example.com
```

### Test Login
```bash
node backend/test-login.js email@example.com password
```

### Reset Password
```bash
node backend/reset-password.js email@example.com newPassword
```

### Test Login API
```bash
node backend/test-login-api.js email@example.com password
```

## 🎓 Features Available

### Admin Features
- ✅ Approve/reject teacher registrations
- ✅ Manage classes and subjects
- ✅ View all students
- ✅ Monitor attendance
- ✅ Manage exams and marks
- ✅ View behavior records
- ✅ Track interventions
- ✅ Faculty connect messaging

### Teacher Features
- ✅ Dashboard with statistics
- ✅ Student list and profiles
- ✅ Data entry (attendance, scores, behavior, interventions)
- ✅ Attendance history
- ✅ Behavior tracking
- ✅ Interventions history
- ✅ Gamification system
- ✅ Faculty connect

## 🔧 Troubleshooting

### Login Issues
1. **401 Unauthorized Error**
   - Check you're using the correct password
   - Run: `node backend/test-login.js email@example.com password`
   - If needed, reset: `node backend/reset-password.js email@example.com newPassword`

2. **Backend Not Responding**
   - Check if server is running: `netstat -ano | findstr :5000`
   - Restart: `cd backend && npm start`

3. **Database Connection Failed**
   - Check .env file has DATABASE_URL
   - Test connection: `node backend/test-db-connection.js`

### Registration Issues
1. **Data Not Saving**
   - Check backend console for errors
   - Verify DATABASE_URL in backend/.env
   - Test connection: `node backend/test-db-connection.js`

2. **Teacher Can't Login**
   - Check if admin approved the teacher
   - Login as admin and approve from pending requests

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres.dbxuyimhcraccwsslkey:uHzPV7WLRRQoBfvs@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```

## 🎯 Next Steps

1. **Login with admin account** (gpp@gmail.com / 123456)
2. **Approve pending teachers** from admin panel
3. **Create classes and subjects**
4. **Add students**
5. **Start using data entry features**

## 📞 Support

If you encounter any issues:
1. Check backend console logs
2. Check browser console (F12)
3. Run diagnostic commands above
4. Verify database connection

## 🎉 Everything is Working!

Your system is fully operational. Just use the correct password (`123456`) for `gpp@gmail.com` and you're good to go!
