# AI Assistant Cheat Sheet

## Quick Access
**Location**: Faculty Chat → AI Assistant (🤖 icon in sidebar)

## Query Format
```
[Action] [Student Name] [Class] [Time Period]
```

## Example Queries

### Basic Report
```
Report of Aditya Honrao 8A
Give me data for John Doe 10B
Show info about Sarah Smith 9C
```

### With Time Period
```
Report of Aditya Honrao 8A of last week
Show data for John Doe 10B this month
Give me info about Sarah 9C today
```

## Time Periods
| Keyword | Range |
|---------|-------|
| `today` | Today only |
| `this week` | Current week |
| `last week` | Previous 7 days |
| `this month` | Current month |
| `last month` | Previous 30 days |
| (none) | Last 30 days |

## What You Get

### 📊 Report Sections
1. **Student Info** - Name, class, roll number
2. **Attendance** - Percentage, present/absent/late
3. **Academics** - Average marks, recent scores
4. **Behavior** - Positive/negative incidents
5. **Risk Level** - Low/Medium/High/Critical
6. **Interventions** - Active support plans
7. **Recommendations** - Action suggestions

### 💡 Smart Recommendations
- Low attendance → Parent meeting
- Poor grades → Tutoring
- Behavior issues → Intervention
- Good performance → Continue monitoring

## Quick Tips

✅ **DO**
- Use full student name
- Include class (e.g., 8A, 10B)
- Check spelling
- Use suggestion buttons

❌ **DON'T**
- Query students from other classes
- Use partial names without class
- Expect instant data for new students

## Common Errors

| Error | Solution |
|-------|----------|
| "Student not found" | Check spelling and class |
| "No access to class" | Only your assigned classes |
| "Insufficient data" | Student needs more records |

## Keyboard Shortcuts
- `Enter` - Send query
- `Esc` - Clear input
- `↑` - Previous query (coming soon)

## API Endpoints
```
POST /api/ai-assistant/query
GET  /api/ai-assistant/suggestions
```

## Response Time
- Average: < 500ms
- Complex queries: < 1s
- With charts: < 2s

## Data Sources
- ✅ Attendance records
- ✅ Exam marks
- ✅ Behavior logs
- ✅ Risk predictions
- ✅ Interventions
- ✅ Student profiles

## Security
- 🔒 Authentication required
- 🔒 Only your classes
- 🔒 Data stays private
- 🔒 No external AI

## Mobile Support
- ✅ Touch-friendly
- ✅ Responsive design
- ✅ Swipe gestures
- ✅ Voice input (coming soon)

## Browser Support
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

---

**Pro Tip**: Click suggestion buttons to learn the format, then customize!

**Need Help?** See `AI_ASSISTANT_QUICK_START.md` for detailed guide.
