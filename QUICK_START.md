# Quick Start Guide

## 🚀 Fastest Way to Start

### Windows
1. Double-click `start-all.bat`
2. Wait for both servers to start
3. Browser will open automatically

### Mac/Linux
1. Make the script executable:
   ```bash
   chmod +x start-all.sh
   ```
2. Run the script:
   ```bash
   ./start-all.sh
   ```
3. Browser will open automatically

---

## 📋 Manual Start (If Script Doesn't Work)

### Step 1: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm install
npm start
```

You should see:
```
Server running on port 5000
Database connected successfully
```

**Keep this terminal open!**

### Step 2: Start Frontend Server

Open a **NEW** terminal and run:

```bash
cd proactive-education-assistant
npm install
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

**Keep this terminal open too!**

### Step 3: Open Browser

Go to: http://localhost:5173

---

## ✅ Verify Everything is Working

### Check Backend Health

Open: http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Check Frontend

Open: http://localhost:5173

You should see the login page.

---

## 🔧 Troubleshooting

### Error: "Cannot connect to backend server"

**Solution:** Make sure the backend server is running on port 5000.

```bash
cd backend
npm start
```

### Error: "Port 5000 is already in use"

**Solution:** Kill the process using port 5000.

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Error: "Module not found"

**Solution:** Install dependencies.

```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd proactive-education-assistant
rm -rf node_modules
npm install
```

### Error: "Database error"

**Solution:** Delete and recreate the database.

```bash
cd backend/storage
rm education_assistant.db
cd ..
npm start
```

The database will be recreated automatically.

---

## 📝 Default Login Credentials

After starting the application, you need to register first:

1. Go to http://localhost:5173
2. Click "Register as Admin" or "Register as Teacher"
3. Fill in the registration form
4. After registration, login with your credentials

---

## 🛑 Stopping the Servers

### If using the script:
- Close the terminal windows that opened

### If started manually:
- Press `Ctrl+C` in each terminal

---

## 📚 Need More Help?

See the full troubleshooting guide: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎯 What's Next?

After logging in:

### As Admin:
1. Approve teacher registrations
2. Create classes and subjects
3. Create exam templates
4. View analytics

### As Teacher:
1. Wait for admin approval
2. View assigned classes
3. Add students
4. Mark attendance
5. Enter exam marks

---

## 📦 Project Structure

```
.
├── backend/                 # Backend server (Node.js + Express)
│   ├── controllers/        # Request handlers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── storage/           # Database
│   └── server.js          # Entry point
│
├── proactive-education-assistant/  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   └── App.jsx        # Main app
│   └── index.html
│
├── start-all.bat          # Windows startup script
├── start-all.sh           # Mac/Linux startup script
└── TROUBLESHOOTING.md     # Detailed troubleshooting guide
```

---

## 🔐 Security Note

This is a development setup. For production:

1. Change `JWT_SECRET` in `backend/.env`
2. Use a proper database (PostgreSQL/MySQL)
3. Enable HTTPS
4. Add rate limiting
5. Implement proper authentication
6. Add input validation
7. Use environment-specific configs

---

## 💡 Tips

1. **Keep both terminals open** while using the application
2. **Check backend console** if something doesn't work
3. **Press F12** in browser to see frontend errors
4. **Clear browser cache** if you see old data
5. **Restart servers** if things get weird

---

## 🐛 Found a Bug?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Check backend console for errors
3. Check browser console (F12) for errors
4. Try restarting both servers
5. Try clearing browser cache

---

## ✨ Features Implemented

- ✅ Admin Profile Management
- ✅ Teacher Profile Management  
- ✅ Student Management
- ✅ Class Management
- ✅ Subject Management
- ✅ Exam Template Management
- ✅ Attendance Tracking
- ✅ Marks Entry
- ✅ Analytics Dashboard
- ⏳ Bulk Attendance Upload (In Progress)
- ⏳ Behavior Tracking (In Progress)

---

Happy Teaching! 🎓
