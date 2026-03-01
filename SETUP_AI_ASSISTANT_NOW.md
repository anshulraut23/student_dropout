# 🚀 Setup AI Assistant V2 - Quick Guide

## What You Need (5 Minutes)

### 1. Get FREE Gemini API Key

**Go to**: https://makersuite.google.com/app/apikey

1. Sign in with Google account
2. Click "Create API Key"
3. Copy the key (looks like: `AIzaSyD...xyz`)

### 2. Add API Key to Backend

Open `backend/.env` file and add:

```env
GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
```

(Replace with your actual key)

### 3. Restart Backend

```bash
cd backend
npm start
```

### 4. Test It!

1. Login as teacher
2. Go to **Faculty Chat**
3. Click **AI Assistant** (🤖 icon)
4. Try these queries:

```
✅ "List students with low attendance"
✅ "Show all students of N3"
✅ "Report of Omkar Ganesh Jagtap N3"
✅ "Who has attendance below 70%"
✅ "Show high-risk students"
```

## What Changed?

### Before ❌
```
"List students with low attendance"
→ Error: "I couldn't identify the student name and class"
```

### After ✅
```
"List students with low attendance"
→ Shows complete list with attendance percentages!
```

## New Features

✅ **Natural Language** - Ask in any way you want
✅ **List Students** - With filters (low attendance, high risk, etc.)
✅ **Class Overview** - See all students in a class
✅ **Flexible Queries** - Works with variations and typos
✅ **Smart Filters** - Attendance thresholds, risk levels, performance
✅ **Time Periods** - This week, last month, today, etc.

## Example Queries That Now Work

### Student Lists
- "List students with low attendance"
- "Show students with attendance below 70%"
- "Who has poor attendance?"
- "Students with less than 75% attendance"

### Class Queries
- "Show all students of N3"
- "List all students in N3"
- "Give me N3 class students"

### Risk Queries
- "Show high-risk students"
- "List students at risk"
- "Who needs intervention?"

### Individual Reports
- "Report of Omkar Ganesh Jagtap N3"
- "Show data for Omkar Jagtap from N3"
- "Give me info about Omkar N3"

## Free Tier Limits

✅ 60 requests per minute
✅ 1,500 requests per day
✅ No credit card required
✅ Perfect for schools

## Troubleshooting

### Error: "Gemini API not configured"
**Fix**: Add GEMINI_API_KEY to backend/.env file

### Error: "API key not valid"
**Fix**: Check if you copied the complete key from Google AI Studio

### Still not working?
1. Make sure you saved the .env file
2. Restart the backend server
3. Clear browser cache
4. Try again

## Security

- ✅ Only query text sent to Gemini
- ✅ Student data stays in your database
- ✅ Privacy compliant
- ✅ No data stored by Google

## Cost

**FREE** for development and small schools!
- 1,500 requests/day = enough for 50+ teachers
- Paid tier: $0.00025/request (very cheap)

## Need Help?

See detailed guides:
- `GEMINI_API_SETUP.md` - Step-by-step API key setup
- `AI_ASSISTANT_V2_UPGRADE.md` - Complete feature list
- `AI_ASSISTANT_QUICK_START.md` - Usage guide

---

## Quick Start Commands

```bash
# 1. Add API key to backend/.env
echo "GEMINI_API_KEY=your_key_here" >> backend/.env

# 2. Restart backend
cd backend
npm start

# 3. Test in browser
# Login → Faculty Chat → AI Assistant → Try queries!
```

---

**Ready?** Get your API key and start using natural language queries! 🎉
