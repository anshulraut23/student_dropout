# AI Assistant Quick Start Guide

## What is it?
An intelligent assistant integrated into Faculty Chat that lets teachers query student data using natural language.

## How to Use

### Step 1: Access AI Assistant
1. Login as a teacher
2. Go to **Faculty Chat** page
3. Click on **"AI Assistant"** in the left sidebar (with robot icon 🤖)

### Step 2: Ask Questions
Type natural language queries like:
- "Give me report of Aditya Honrao 8A of last week"
- "Show data for John Doe from 10B"
- "Report of Sarah Smith 9C this month"

### Step 3: Get Instant Reports
The AI will provide:
- ✅ Attendance percentage and details
- 📚 Academic performance and exam scores
- 🎭 Behavior records (positive/negative)
- ⚠️ Risk assessment
- 🎯 Active interventions
- 💡 Smart recommendations

## Query Format

```
[Action] [Student Name] [Class] [Time Period]
```

### Examples:
- "Report of **Aditya Honrao** **8A** **last week**"
- "Show data for **John Doe** from **10B** **this month**"
- "Give me info about **Sarah** **9C**" (defaults to last 30 days)

### Supported Time Periods:
- `today` - Today only
- `this week` - Current week
- `last week` - Previous 7 days
- `this month` - Current month
- `last month` - Previous 30 days
- No period = Last 30 days (default)

## Features

### 🔒 Security
- Only shows students from YOUR assigned classes
- Requires authentication
- Data stays private

### 📊 Comprehensive Data
- Attendance tracking
- Exam performance
- Behavior incidents
- Risk predictions
- Intervention plans

### 💡 Smart Recommendations
Based on student data, get suggestions like:
- "Attendance below 75% - consider parent meeting"
- "Academic performance needs attention - consider tutoring"
- "Student performing well - continue monitoring"

## Tips

1. **Use Suggestions**: Click the suggestion buttons for quick queries
2. **Be Specific**: Include both student name and class
3. **Check Spelling**: Student names must match database records
4. **Time Periods**: Add time periods for focused reports

## Troubleshooting

### "Student not found"
- Check spelling of student name
- Verify the class is correct
- Ensure student is in YOUR assigned class

### "You don't have access to class X"
- You can only query students from classes assigned to you
- Contact admin to assign you to the class

### "Insufficient data"
- Student may be newly added
- Not enough attendance/exam records yet
- System needs more data for predictions

## Technical Notes

- **No External AI**: Uses rule-based processing (fast & private)
- **Real-time**: Queries your database directly
- **Offline-capable**: Works with local data
- **Extensible**: Can be upgraded to use GPT/Claude later

## Next Steps

Want more features? The AI Assistant can be extended to:
- Class-wide statistics
- Comparative analysis between students
- Trend predictions
- Export reports to PDF/Excel
- Voice input support
- Multi-language queries

---

**Need Help?** Contact your system administrator or check the full documentation in `TEST_AI_ASSISTANT.md`
