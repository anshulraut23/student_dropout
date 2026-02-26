# 🚀 ngrok Setup - Simple Steps

## ✅ ngrok is Installed!

Now follow these simple steps:

---

## 📋 Step-by-Step Instructions

### Step 1: Start Backend (Terminal 1)

Open a terminal and run:

```bash
cd backend
npm start
```

**Keep this terminal running!** You should see:
```
Server running on port 5000
API available at http://localhost:5000/api
```

---

### Step 2: Start ngrok (Terminal 2)

Open a **NEW** terminal and run:

```bash
ngrok http 5000
```

**Or simply double-click**: `start-ngrok.bat`

You'll see something like this:

```
ngrok

Session Status                online
Account                       Free
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok.io -> http://localhost:5000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**COPY THIS URL**: `https://abc123-def456.ngrok.io`

⚠️ **IMPORTANT**: Keep this terminal running too!

---

### Step 3: Update Frontend .env

Edit `proactive-education-assistant/.env`:

**Replace with YOUR ngrok URL:**

```env
VITE_API_URL=https://abc123-def456.ngrok.io/api
```

**Important**: 
- Use the HTTPS URL (not HTTP)
- Add `/api` at the end
- Replace `abc123-def456` with YOUR actual ngrok subdomain

---

### Step 4: Rebuild App (Terminal 3)

Open a **NEW** terminal and run:

```bash
cd proactive-education-assistant
npm run build
npx cap sync
```

---

### Step 5: Open Android Studio

```bash
npx cap open android
```

---

### Step 6: Run the App

In Android Studio:
1. Click the green **Run** button (or press Shift+F10)
2. Wait for app to launch in emulator
3. Try to login!

---

## ✅ Expected Result

- ✅ No connection error
- ✅ Login screen works
- ✅ Can enter email/password
- ✅ Login succeeds
- ✅ Data downloads
- ✅ Dashboard loads

---

## 🎯 Quick Commands Summary

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: ngrok
ngrok http 5000

# Terminal 3: Rebuild app
cd proactive-education-assistant
npm run build
npx cap sync
npx cap open android
```

---

## 🔍 Verify ngrok is Working

Open your browser and visit:

```
https://your-ngrok-url.ngrok.io/api/schools
```

You should see JSON response (even if empty array).

---

## ⚠️ Important Notes

1. **Keep both terminals running** (backend and ngrok)
2. **ngrok URL changes** every time you restart ngrok
3. **If you restart ngrok**, you need to:
   - Get new URL
   - Update `.env`
   - Rebuild app (`npm run build && npx cap sync`)

---

## 🎯 Automated Setup (Optional)

Instead of manual steps, you can run:

```bash
setup-ngrok-complete.bat
```

This script will:
1. Check if backend is running
2. Start ngrok
3. Ask for ngrok URL
4. Update `.env` automatically
5. Rebuild app
6. Ready to test!

---

## 🐛 Troubleshooting

### Issue: "ngrok not found"

**Solution**: Already installed! Try closing and reopening terminal.

### Issue: "Port 5000 already in use"

**Solution**: Backend is already running, that's good! Just start ngrok.

### Issue: "App still can't connect"

**Solution**: 
1. Check ngrok terminal shows "online" status
2. Verify `.env` has correct ngrok URL with `/api` at end
3. Make sure you rebuilt app after changing `.env`
4. Check backend terminal shows no errors

### Issue: "Connection limit reached"

**Solution**: Sign up for free ngrok account at https://ngrok.com

---

## 📱 Testing Checklist

- [ ] Backend running (Terminal 1)
- [ ] ngrok running (Terminal 2)
- [ ] Copied ngrok HTTPS URL
- [ ] Updated `.env` with ngrok URL + `/api`
- [ ] Rebuilt app (`npm run build`)
- [ ] Synced Capacitor (`npx cap sync`)
- [ ] Opened Android Studio
- [ ] Clicked Run button
- [ ] App launches in emulator
- [ ] Login works!

---

## 🎉 Success!

Once you complete these steps, your app will connect to your backend through ngrok!

**Remember**: Keep both terminals running (backend and ngrok)!

---

**Current Status**: ngrok installed ✅  
**Next Step**: Start backend, then start ngrok  
**Time Required**: 2 minutes
