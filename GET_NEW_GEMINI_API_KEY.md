# 🔑 Get New Gemini API Key - Your Current Key is Leaked

## ⚠️ Problem
Your Gemini API key was exposed publicly and Google has blocked it:
```
[403 Forbidden] Your API key was reported as leaked. Please use another API key.
```

## 🤖 Which APIs You're Using

### 1. Gemini API (Google) - NEEDS REPLACEMENT ❌
**Used For:** AI Assistant (Database Queries)
- Analyzes student data from database
- Answers questions about students, attendance, marks
- Provides insights and recommendations
- Located in: `backend/controllers/aiAssistantController.js`

**Current Key (BLOCKED):**
```
GEMINI_API_KEY=AIzaSyBWrKeumJQtJhYILEdvMLt6xJvHu3rr7Ws
```

### 2. Groq API - Still Working ✅
**Used For:** General Chat Assistant
- General conversations
- Not connected to database
- Located in: `backend/controllers/aiAssistantController.js`

**Current Key (WORKING):**
```
GROQ_API_KEY=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
```

---

## 📝 How to Get New Gemini API Key

### Step 1: Go to Google AI Studio
Visit: https://aistudio.google.com/app/apikey

### Step 2: Sign In
- Use your Google account
- Accept terms if prompted

### Step 3: Create New API Key
1. Click **"Get API Key"** or **"Create API Key"**
2. Select **"Create API key in new project"** (recommended)
3. Or select existing project if you have one

### Step 4: Copy the Key
- Your new key will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- Copy it immediately (you won't see it again)

### Step 5: Update Your .env Files

#### Local Backend (.env)
```bash
# In: backend/.env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### ML Service (.env)
```bash
# In: ml-service/.env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 6: Update Render (Production)
1. Go to: https://dashboard.render.com
2. Open your backend service
3. Go to **Environment** tab
4. Find `GEMINI_API_KEY`
5. Click **Edit**
6. Paste new key
7. Click **Save**
8. Service will auto-redeploy

### Step 7: Restart Services
```bash
# Restart backend
cd backend
npm start

# Restart ML service (if using Gemini)
cd ml-service
python app.py
```

---

## 🔒 How to Protect Your New API Key

### 1. Never Commit to Git
Check your `.gitignore` includes:
```
.env
.env.local
.env.production
```

### 2. Use Environment Variables Only
❌ Bad:
```javascript
const apiKey = "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
```

✅ Good:
```javascript
const apiKey = process.env.GEMINI_API_KEY;
```

### 3. Restrict API Key (Recommended)
In Google AI Studio:
1. Click on your API key
2. Go to **"API restrictions"**
3. Select **"Restrict key"**
4. Choose **"Generative Language API"**
5. Add **Application restrictions** (optional):
   - HTTP referrers for web
   - IP addresses for servers

### 4. Set Usage Limits
1. Go to Google Cloud Console
2. Navigate to **APIs & Services → Quotas**
3. Set daily/monthly limits
4. Enable billing alerts

### 5. Monitor Usage
- Check usage at: https://aistudio.google.com/app/apikey
- Review API calls regularly
- Set up alerts for unusual activity

---

## 🧪 Test New API Key

### Test Script
Create `test-gemini.js` in backend folder:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent('Say hello!');
    const response = result.response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('Response:', response);
  } catch (error) {
    console.error('❌ Gemini API failed:', error.message);
  }
}

testGemini();
```

Run:
```bash
cd backend
node test-gemini.js
```

Expected output:
```
✅ Gemini API is working!
Response: Hello! How can I help you today?
```

---

## 🆓 Gemini API Pricing (Free Tier)

### Free Quota
- **15 requests per minute**
- **1 million tokens per day**
- **1,500 requests per day**

This is MORE than enough for your app!

### Models Available
- `gemini-2.0-flash-exp` (fastest, recommended)
- `gemini-1.5-flash` (fast)
- `gemini-1.5-pro` (most capable)

Your app uses: `gemini-2.0-flash-exp`

---

## 🔄 Alternative: Use Groq for Everything

If you don't want to deal with Gemini, you can use Groq for both:

### Update aiAssistantController.js

Find this section:
```javascript
// Use Gemini for database queries
if (queryType === 'database') {
  result = await analyzeQueryWithGemini(query, context);
}
```

Change to:
```javascript
// Use Groq for all queries
result = await analyzeQueryWithGroq(query, context);
```

**Pros:**
- One API to manage
- Groq is fast and reliable
- Your key is already working

**Cons:**
- Groq might not be as good for structured data analysis
- Different response format

---

## 📊 Current API Usage in Your App

### Gemini API (Database Assistant)
**File:** `backend/controllers/aiAssistantController.js`

**Used For:**
- Student data queries
- Attendance analysis
- Marks analysis
- Behavior insights
- Risk predictions
- Recommendations

**Endpoints:**
- `POST /api/ai-assistant/query`
- `POST /api/ai-assistant/analyze-student`

### Groq API (General Chat)
**File:** `backend/controllers/aiAssistantController.js`

**Used For:**
- General questions
- Explanations
- Conversations
- Non-database queries

**Same Endpoints:** (switches based on query type)

---

## ✅ Checklist

- [ ] Get new Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Update `backend/.env` with new key
- [ ] Update `ml-service/.env` with new key (if needed)
- [ ] Update Render environment variables
- [ ] Restart backend service
- [ ] Test with `test-gemini.js` script
- [ ] Try AI Assistant in the app
- [ ] Set API restrictions in Google AI Studio
- [ ] Monitor usage for first few days
- [ ] Delete old leaked key from Google AI Studio

---

## 🆘 If You Can't Get Gemini Key

### Option 1: Use Groq Only
Modify code to use Groq for everything (see above)

### Option 2: Use OpenAI
Get OpenAI API key: https://platform.openai.com/api-keys
- Similar to Gemini
- Paid service (but has free trial)
- Very reliable

### Option 3: Disable AI Assistant Temporarily
Comment out AI features until you get new key

---

## 📞 Need Help?

If you have issues:
1. Check Google AI Studio status
2. Verify API key is copied correctly (no spaces)
3. Make sure `.env` file is in correct location
4. Restart backend after updating
5. Check backend logs for errors

---

## 🎯 Quick Fix Summary

1. Go to: https://aistudio.google.com/app/apikey
2. Create new API key
3. Copy the key
4. Update `backend/.env`:
   ```
   GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```
5. Restart backend:
   ```bash
   cd backend
   npm start
   ```
6. Test AI Assistant in your app

Done! Your AI Assistant will work again.
