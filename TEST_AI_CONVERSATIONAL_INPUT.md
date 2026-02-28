# Test Guide: AI Assistant Conversational Input

## Quick Test Checklist

### Test 1: View Today's Attendance ✅
**Steps:**
1. Open Faculty Chat
2. Click "AI Assistant"
3. Type: "Show today's attendance"
4. Press Send

**Expected Result:**
- Comprehensive attendance report
- Date range shown
- Student list with percentages
- Status indicators (Good/Needs Attention/Critical)
- AI-generated insights

### Test 2: View Attendance with Variations ✅
**Try these queries:**
- "Today's attendance"
- "Show attendance of today"
- "What's the attendance for today?"
- "View today's attendance"

**Expected Result:**
- All variations should work
- Same comprehensive report format

### Test 3: View Attendance for Specific Class ✅
**Steps:**
1. Type: "Show attendance for N3"
2. Press Send

**Expected Result:**
- Attendance report filtered to N3 class only
- Shows only N3 students

### Test 4: View Weekly Attendance ✅
**Steps:**
1. Type: "Show attendance summary for this week"
2. Press Send

**Expected Result:**
- Attendance report for current week (Sunday to today)
- Weekly statistics and trends

### Test 5: Mark Attendance - Confirmation Flow ✅
**Steps:**
1. Type: "Mark attendance for N3"
2. Press Send
3. AI asks: "Would you like to mark attendance for class N3 today?"
4. Click "Yes, proceed" button

**Expected Result:**
- Step 1-2: Confirmation message appears
- Step 3: Yes/No buttons shown
- Step 4: Instructions for marking attendance displayed
- Suggests using Attendance page

### Test 6: Mark Attendance - Cancel ✅
**Steps:**
1. Type: "Take attendance"
2. Press Send
3. AI asks for confirmation
4. Click "No, cancel" button

**Expected Result:**
- Action cancelled message
- "How else can I help you?" prompt

### Test 7: Confirmation with Text Response ✅
**Steps:**
1. Type: "Mark attendance for N3"
2. Press Send
3. Type: "yes" (instead of clicking button)
4. Press Send

**Expected Result:**
- Same as clicking "Yes, proceed"
- Instructions displayed

### Test 8: Existing Features Still Work ✅
**Try these:**
- "Report of [Student Name] N3"
- "List students with low attendance"
- "Show high-risk students"
- "Show all students of N3"

**Expected Result:**
- All existing features work as before
- No regression

### Test 9: AI Suggestions Updated ✅
**Steps:**
1. Open AI Assistant
2. Check suggestion buttons

**Expected Result:**
- "Show today's attendance" appears in suggestions
- "Show attendance summary for this week" appears
- Other suggestions still present

### Test 10: Error Handling ✅
**Try these:**
- Empty query
- Gibberish text
- Query for non-existent class
- Query for non-existent student

**Expected Result:**
- Helpful error messages
- Suggestions for correct format
- No crashes

## Manual Testing Script

### Scenario 1: Teacher Wants to Check Today's Attendance
```
Teacher: "Show today's attendance"
AI: [Displays comprehensive attendance report with statistics]
Teacher: "Show attendance for N3 only"
AI: [Displays filtered report for N3]
```

### Scenario 2: Teacher Wants to Mark Attendance
```
Teacher: "Mark attendance for N3"
AI: "Would you like to mark attendance for class N3 today?"
     [Yes, proceed] [No, cancel]
Teacher: [Clicks Yes]
AI: "Great! To mark attendance for class N3, please use the Attendance page..."
```

### Scenario 3: Teacher Checks Weekly Trends
```
Teacher: "Show attendance summary for this week"
AI: [Displays weekly report with trends and insights]
Teacher: "List students with low attendance"
AI: [Displays filtered list of students below 75%]
```

## Backend Testing (Optional)

### Test API Endpoint Directly
```bash
# Test view attendance
curl -X POST http://localhost:5000/api/ai-assistant/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "Show today'\''s attendance"}'

# Test mark attendance (confirmation)
curl -X POST http://localhost:5000/api/ai-assistant/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query": "Mark attendance for N3"}'

# Test confirmation response
curl -X POST http://localhost:5000/api/ai-assistant/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "yes",
    "confirmAction": "mark_attendance",
    "confirmData": {"className": "N3"}
  }'
```

## Verification Checklist

- [ ] Natural language queries work
- [ ] Confirmation flow works for data modifications
- [ ] Yes/No buttons appear and function
- [ ] Text-based yes/no responses work
- [ ] Attendance reports show correct data
- [ ] Date range parsing works (today, this week, etc.)
- [ ] Class filtering works
- [ ] AI-generated insights are relevant
- [ ] Formatting is clean and readable
- [ ] No console errors
- [ ] Existing features not broken
- [ ] Suggestions updated
- [ ] Error messages are helpful

## Known Limitations

1. **Attendance Marking**: Currently redirects to Attendance page (inline marking coming soon)
2. **Date Ranges**: Limited to predefined periods (custom dates coming soon)
3. **Bulk Operations**: Not yet supported (e.g., "mark all present")
4. **Export**: Cannot export reports to PDF yet

## Performance Notes

- First query may take 2-3 seconds (Gemini API call)
- Subsequent queries are faster (cached context)
- Large class sizes (>50 students) may take longer
- Confirmation responses are instant (no API call)

## Troubleshooting

**Issue**: AI doesn't understand query
**Solution**: Try rephrasing with more specific details

**Issue**: Confirmation buttons not showing
**Solution**: Check browser console for errors, refresh page

**Issue**: "Gemini API not configured" error
**Solution**: Verify GEMINI_API_KEY in backend/.env

**Issue**: No attendance data shown
**Solution**: Verify students have attendance records in database

---

**Test Status**: Ready for Testing
**Last Updated**: February 28, 2026
**Tester**: [Your Name]
**Date Tested**: [Date]
