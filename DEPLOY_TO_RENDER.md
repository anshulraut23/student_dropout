# 🚀 Deploy Backend to Render (Free)

## Why Deploy?

Deploying your backend to the cloud solves the localhost connection issue permanently. Your mobile app can connect from anywhere!

---

## 🎯 Quick Deploy to Render (10 Minutes)

### Step 1: Prepare Backend for Deployment

Create `render.yaml` in the backend directory:

```yaml
services:
  - type: web
    name: proactive-edu-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_TYPE
        value: postgres
      - key: PORT
        value: 5000
```

### Step 2: Create Account

1. Go to https://render.com
2. Sign up with GitHub (free)
3. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the repository
4. Configure:
   - **Name**: `proactive-edu-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 4: Add Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
DB_TYPE=postgres
JWT_SECRET=your_secure_random_string_here
DATABASE_URL=your_supabase_connection_string
ML_SERVICE_URL=http://localhost:5001
```

Get your Supabase connection string from your `.env.example`:
```
DATABASE_URL=postgresql://postgres.dbxuyimhcraccwsslkey:uHzPV7WLRRQoBfvs@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://proactive-edu-backend.onrender.com`

### Step 6: Update Frontend

Update `proactive-education-assistant/.env`:

```env
VITE_API_URL=https://proactive-edu-backend.onrender.com/api
```

### Step 7: Rebuild App

```bash
cd proactive-education-assistant
npm run build
npx cap sync
npx cap open android
```

Rebuild APK and test!

---

## 🎯 Alternative: Deploy to Railway (Even Easier!)

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

### Step 3: Deploy

```bash
cd backend
railway init
railway up
```

### Step 4: Add Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set DB_TYPE=postgres
railway variables set JWT_SECRET=your_secret_here
railway variables set DATABASE_URL=your_supabase_url
```

### Step 5: Get URL

```bash
railway domain
```

You'll get a URL like: `https://backend-production-xxxx.up.railway.app`

---

## 🎯 Alternative: Use ngrok (Temporary Testing)

If you just want to test quickly without deploying:

### Step 1: Install ngrok

```bash
npm install -g ngrok
```

### Step 2: Start Backend

```bash
cd backend
npm start
```

### Step 3: Create Tunnel

```bash
ngrok http 5000
```

### Step 4: Copy URL

You'll see something like:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:5000
```

### Step 5: Update Frontend

```env
VITE_API_URL=https://abc123.ngrok.io/api
```

**Note**: ngrok URLs change every time you restart, so this is only for testing.

---

## 📝 Recommended: Render Deployment

I recommend Render because:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration
- ✅ Persistent URL
- ✅ Auto-deploys on git push
- ✅ Works with Supabase

---

## 🔧 Backend Changes Needed

Before deploying, make sure your backend has CORS configured:

Check `backend/server.js`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: '*', // Allow all origins
  credentials: true
}));
```

---

## ✅ After Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Environment variables set
- [ ] Backend URL accessible (test in browser)
- [ ] Frontend `.env` updated with new URL
- [ ] React app rebuilt
- [ ] Capacitor synced
- [ ] APK rebuilt
- [ ] App tested and working

---

## 🧪 Test Your Deployed Backend

Visit in browser:
```
https://your-backend-url.onrender.com/api/schools
```

You should see JSON response (even if empty array).

---

## 💰 Cost

**Render Free Tier:**
- ✅ Free forever
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Takes 30-60 seconds to wake up
- ✅ Perfect for development/testing

**Railway Free Tier:**
- ✅ $5 free credit per month
- ✅ No spin-down
- ✅ Faster than Render
- ✅ Better for production

---

## 🚀 Quick Start (Choose One)

### Option 1: Render (Recommended)
1. Go to https://render.com
2. Sign up with GitHub
3. Create new Web Service
4. Connect your repo
5. Add environment variables
6. Deploy!

### Option 2: Railway
```bash
npm install -g @railway/cli
cd backend
railway login
railway init
railway up
```

### Option 3: ngrok (Testing Only)
```bash
npm install -g ngrok
cd backend
npm start
# In another terminal:
ngrok http 5000
```

---

## 🎯 My Recommendation

**For Testing Now**: Use ngrok (fastest, 2 minutes)

**For Production**: Use Render or Railway (10 minutes setup, permanent solution)

---

## 📞 Need Help?

If you choose to deploy, let me know which platform and I'll help you through any issues!

---

**Last Updated**: February 26, 2026  
**Status**: Ready to Deploy 🚀
