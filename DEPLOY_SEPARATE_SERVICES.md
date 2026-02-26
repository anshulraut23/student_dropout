# Deploy Backend and ML Service Separately on Render

This guide explains how to deploy the Node.js backend and Python ML service as separate services on Render.

## Why Separate Services?

- **Easier to manage**: Each service has its own logs, metrics, and scaling
- **Independent deployments**: Update one without affecting the other
- **Better resource allocation**: Each service gets its own resources
- **Cleaner architecture**: Clear separation of concerns

## Prerequisites

1. GitHub repository with your code
2. Render account (free tier works)
3. Supabase database credentials

## Step 1: Deploy ML Service First

### 1.1 Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `student-dropout-ml`
- **Region**: Oregon (US West)
- **Branch**: `vivek-apk` (or your branch)
- **Root Directory**: `ml-service`
- **Environment**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && python generate_and_train.py
  ```
- **Start Command**: 
  ```bash
  gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app
  ```

**Advanced Settings:**
- **Health Check Path**: `/health`
- **Auto-Deploy**: Yes

**Environment Variables:**
```
FLASK_ENV=production
GEMINI_API_KEY=your_gemini_api_key_here (optional)
```

### 1.2 Deploy and Get URL

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes for first deploy)
3. Once deployed, copy the URL (e.g., `https://student-dropout-ml.onrender.com`)
4. Test the health endpoint: `https://student-dropout-ml.onrender.com/health`

## Step 2: Deploy Backend Service

### 2.1 Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `student-dropout-backend`
- **Region**: Oregon (US West)
- **Branch**: `vivek-apk` (or your branch)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: 
  ```bash
  npm install
  ```
- **Start Command**: 
  ```bash
  node server.js
  ```

**Advanced Settings:**
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: Yes

**Environment Variables:**
```
NODE_ENV=production
DB_TYPE=postgres
ML_SERVICE_URL=https://student-dropout-ml.onrender.com
DATABASE_URL=postgresql://postgres.dbxuyimhcraccwsslkey:uHzPV7WLRRQoBfvs@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
JWT_SECRET=your_jwt_secret_key_here_change_in_production
DB_HOST=aws-1-ap-northeast-2.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=uHzPV7WLRRQoBfvs
```

**Important**: Replace `ML_SERVICE_URL` with the actual URL from Step 1.2

### 2.2 Deploy and Get URL

1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Once deployed, copy the URL (e.g., `https://student-dropout-backend.onrender.com`)
4. Test the health endpoint: `https://student-dropout-backend.onrender.com/api/health`

## Step 3: Update Frontend Configuration

Update your frontend `.env` file to use the backend URL:

```env
VITE_API_URL=https://student-dropout-backend.onrender.com/api
```

Or update `apiService.js` to use the new backend URL as fallback.

## Step 4: Test the Integration

### Test Backend
```bash
curl https://student-dropout-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```

### Test ML Service
```bash
curl https://student-dropout-ml.onrender.com/health
```

Expected response:
```json
{
  "status":"healthy",
  "service":"ml-dropout-prediction",
  "model_loaded":true,
  "gemini_available":false,
  "model_type":"RandomForestClassifier"
}
```

### Test ML Prediction via Backend
```bash
curl -X POST https://student-dropout-backend.onrender.com/api/ml/risk/student/STUDENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Monitoring and Logs

### View Logs
1. Go to Render Dashboard
2. Click on the service name
3. Go to "Logs" tab
4. Monitor real-time logs

### Check Metrics
1. Go to service dashboard
2. View CPU, Memory, and Request metrics
3. Set up alerts if needed

## Troubleshooting

### ML Service Issues

**Problem**: Model not loading
- **Solution**: Check build logs, ensure `generate_and_train.py` runs successfully
- **Check**: `/health` endpoint should show `"model_loaded": true`

**Problem**: Out of memory
- **Solution**: Reduce model complexity or upgrade to paid plan

### Backend Issues

**Problem**: Database connection fails
- **Solution**: Verify DATABASE_URL is correct
- **Check**: Supabase connection pooler URL format
- **Test**: Run `psql $DATABASE_URL` locally

**Problem**: ML service unreachable
- **Solution**: Verify ML_SERVICE_URL is correct
- **Check**: ML service is deployed and healthy
- **Test**: `curl https://student-dropout-ml.onrender.com/health`

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month free (enough for 1 service 24/7)

**Solutions:**
- Use a service like UptimeRobot to ping your services every 14 minutes
- Upgrade to paid plan for always-on services
- Accept cold starts for free tier

## Updating Services

### Update ML Service
1. Push changes to GitHub
2. Render auto-deploys (if enabled)
3. Or manually trigger deploy from dashboard

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys (if enabled)
3. Or manually trigger deploy from dashboard

## URLs Summary

After deployment, you'll have:

- **ML Service**: `https://student-dropout-ml.onrender.com`
- **Backend**: `https://student-dropout-backend.onrender.com`
- **Frontend**: Your Vercel/local URL

Update these URLs in your configuration files accordingly.

## Cost Estimate

**Free Tier (Current Setup):**
- ML Service: Free (750 hours/month)
- Backend: Free (750 hours/month)
- Total: $0/month

**Note**: You can only run ONE service 24/7 on free tier. For both services always-on, you need:
- Starter Plan: $7/month per service = $14/month total

## Next Steps

1. Deploy ML service first
2. Copy ML service URL
3. Deploy backend with ML service URL
4. Test both services
5. Update frontend configuration
6. Monitor logs and metrics
