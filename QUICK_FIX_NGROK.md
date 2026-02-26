# ⚡ Quick Fix with ngrok (2 Minutes)

## 🎯 Fastest Solution for Testing

Use ngrok to create a public URL for your local backend. This works immediately!

---

## 🚀 Step-by-Step (2 Minutes)

### Step 1: Install ngrok

**Windows (using npm):**
```bash
npm install -g ngrok
```

**Or download from**: https://ngrok.com/download

### Step 2: Start Your Backend

```bash
cd backend
npm start
```

Keep this terminal running!

### Step 3: Open New Terminal and Start ngrok

```bash
ngrok http 5000
```

### Step 4: Copy the HTTPS URL

You'll see something like:

```
ngrok

Session Status                online
Account                       Free (Limit: 40 connections/minute)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:5000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copy this URL**: `https://abc123.ngrok.io`

### Step 5: Update Frontend .env

Edit `proactive-education-assistant/.env`:

```env
VITE_API_URL=https://abc123.ngrok.io/api
```

**Important**: Replace `abc123` with YOUR actual ngrok URL!

### Step 6: Rebuild App

```bash
cd proactive-education-assistant
npm run build
npx cap sync
```

### Step 7: Run in Emulator

```bash
npx cap open android
```

Click **Run** in Android Studio.

### Step 8: Test!

- App should connect successfully
- Login should work
- Data should download

---

## ✅ Advantages

- ✅ Works immediately (2 minutes)
- ✅ No deployment needed
- ✅ Free tier available
- ✅ HTTPS included
- ✅ Works from anywhere (even physical devices)

## ⚠️ Limitations

- ⚠️ URL changes every time you restart ngrok
- ⚠️ Free tier has connection limits
- ⚠️ Need to keep terminal running
- ⚠️ Need to rebuild app if URL changes

---

## 🔄 If You Restart ngrok

1. Get new URL from ngrok terminal
2. Update `.env` with new URL
3. Rebuild: `npm run build && npx cap sync`
4. Rerun app in Android Studio

---

## 💡 Pro Tip: Get Static URL (Optional)

Sign up for free ngrok account to get a static URL that doesn't change:

1. Go to https://ngrok.com/signup
2. Get your authtoken
3. Run: `ngrok authtoken YOUR_TOKEN`
4. Run: `ngrok http 5000 --domain=your-static-domain.ngrok.io`

---

## 🎯 Quick Commands Reference

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start ngrok
ngrok http 5000

# Terminal 3: Rebuild app
cd proactive-education-assistant
npm run build
npx cap sync
npx cap open android
```

---

## 🐛 Troubleshooting

### Issue: "ngrok not found"

**Solution**: Install globally
```bash
npm install -g ngrok
```

### Issue: "Connection limit reached"

**Solution**: Sign up for free account at https://ngrok.com

### Issue: "App still can't connect"

**Solution**: 
1. Check ngrok is running
2. Check backend is running
3. Verify URL in `.env` matches ngrok URL exactly
4. Make sure you rebuilt the app after changing `.env`

---

## ✅ Success Checklist

- [ ] ngrok installed
- [ ] Backend running (`npm start`)
- [ ] ngrok running (`ngrok http 5000`)
- [ ] Copied ngrok HTTPS URL
- [ ] Updated `.env` with ngrok URL
- [ ] Rebuilt app (`npm run build`)
- [ ] Synced Capacitor (`npx cap sync`)
- [ ] Opened Android Studio
- [ ] App connects successfully

---

## 🎉 You're Done!

Once ngrok is running and you've updated the `.env`, your app should connect successfully!

**Remember**: Keep both terminals running (backend and ngrok)!

---

**Last Updated**: February 26, 2026  
**Status**: Ready to Test ⚡
