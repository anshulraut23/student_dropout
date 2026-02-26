# 🔧 Fix "Cannot Connect to Backend Server" Issue

## 🎯 The Problem

When running the app on a physical Android device, `localhost` refers to the device itself, not your computer. That's why you're seeing:

> "Cannot connect to backend server. Please make sure the backend is running on http://localhost:5000"

## ✅ The Solution

You need to use your computer's actual IP address instead of `localhost`.

---

## 🚀 Quick Fix (Automated)

### Option 1: Run the Auto-Configuration Script

```bash
get-ip-and-configure.bat
```

This script will:
1. Find your computer's IP address
2. Update the `.env` file automatically
3. Show you the next steps

---

## 🔧 Manual Fix (Step by Step)

### Step 1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```

Look for "IPv4 Address" under your active network connection:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Common IP ranges:**
- Home WiFi: `192.168.x.x` or `10.0.x.x`
- Office: `172.16.x.x` to `172.31.x.x`

### Step 2: Update Frontend .env File

Edit `proactive-education-assistant/.env`:

**Before:**
```env
VITE_API_URL=http://localhost:5000/api
```

**After:** (replace with YOUR IP)
```env
VITE_API_URL=http://192.168.1.100:5000/api
```

### Step 3: Rebuild the App

```bash
cd proactive-education-assistant
npm run build
npx cap sync
```

### Step 4: Rebuild APK

```bash
npx cap open android
```

In Android Studio:
- Click **Build** → **Build APK**
- Wait for build to complete
- Install new APK on device

### Step 5: Test

1. Make sure backend is running on your computer
2. Make sure phone and computer are on the same WiFi network
3. Open the app and try to login

---

## 🔥 Important Notes

### 1. Same Network Required

Your phone and computer MUST be on the same WiFi network for this to work.

### 2. Firewall Settings

If still not connecting, check Windows Firewall:

```bash
# Allow Node.js through firewall
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=5000
```

Or manually:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find Node.js and check both Private and Public
4. Click OK

### 3. Backend Must Be Running

Make sure your backend is running:

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
API available at http://localhost:5000/api
```

### 4. Test Backend Connection

From your phone's browser, try accessing:
```
http://YOUR_IP:5000/api/schools
```

Replace `YOUR_IP` with your computer's IP address.

If you see JSON data, the connection works!

---

## 🧪 Testing Checklist

- [ ] Found computer's IP address
- [ ] Updated `.env` file with IP
- [ ] Rebuilt React app (`npm run build`)
- [ ] Synced with Capacitor (`npx cap sync`)
- [ ] Rebuilt APK in Android Studio
- [ ] Phone and computer on same WiFi
- [ ] Backend is running
- [ ] Firewall allows port 5000
- [ ] Can access backend from phone browser
- [ ] App connects successfully

---

## 🎯 Alternative Solutions

### Option 1: Use ngrok (Internet Tunnel)

If you can't get local network working, use ngrok:

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 5000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and use it in `.env`:

```env
VITE_API_URL=https://abc123.ngrok.io/api
```

### Option 2: Deploy Backend to Cloud

Deploy your backend to:
- Heroku
- Railway
- Render
- DigitalOcean

Then use the cloud URL in `.env`.

### Option 3: Use Android Emulator

If testing on emulator instead of physical device:

```env
VITE_API_URL=http://10.0.2.2:5000/api
```

`10.0.2.2` is the special IP that emulator uses to access host machine.

---

## 🐛 Troubleshooting

### Issue: "Network request failed"

**Causes:**
1. Phone not on same WiFi as computer
2. Firewall blocking connection
3. Backend not running
4. Wrong IP address

**Solution:**
1. Check WiFi connection
2. Disable firewall temporarily to test
3. Restart backend
4. Verify IP with `ipconfig`

### Issue: "Timeout"

**Causes:**
1. Backend is slow to respond
2. Network is slow
3. Backend crashed

**Solution:**
1. Check backend logs
2. Restart backend
3. Check network speed

### Issue: "CORS error"

**Causes:**
Backend not configured for your IP

**Solution:**
Check `backend/server.js` has CORS enabled:

```javascript
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true
}));
```

---

## 📝 Quick Reference

### Your Configuration

**Computer IP:** (Run `ipconfig` to find)
```
192.168.1.100  (example)
```

**Frontend .env:**
```env
VITE_API_URL=http://192.168.1.100:5000/api
```

**Backend .env:**
```env
PORT=5000
DB_TYPE=sqlite
```

**Rebuild Commands:**
```bash
cd proactive-education-assistant
npm run build
npx cap sync
npx cap open android
```

---

## ✅ Success Indicators

When everything works, you should see:

1. **Backend logs:**
   ```
   Server running on port 5000
   API available at http://localhost:5000/api
   ```

2. **App login screen:**
   - No error message
   - Can type email/password
   - "Sign In" button works

3. **After login:**
   - Data download starts
   - Progress bar shows
   - Dashboard loads with data

---

## 🎉 You're Done!

Once you've updated the IP and rebuilt the APK, your app should connect successfully!

**Remember:**
- Phone and computer must be on same WiFi
- Backend must be running
- Use your computer's IP, not localhost

---

**Need Help?**
- Check backend is running: `http://YOUR_IP:5000/api/schools`
- Check firewall settings
- Try ngrok if local network doesn't work

**Last Updated:** February 26, 2026
