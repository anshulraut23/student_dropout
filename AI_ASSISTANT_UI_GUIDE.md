# AI Assistant UI Guide

## Interface Overview

### 1. Sidebar Navigation
```
┌─────────────────────────┐
│  Connections            │
├─────────────────────────┤
│  🤖 AI Assistant        │ ← Click here!
│     Ask about student   │
│     data                │
├─────────────────────────┤
│  👤 John Teacher        │
│     john@school.com     │
├─────────────────────────┤
│  👤 Sarah Teacher       │
│     sarah@school.com    │
└─────────────────────────┘
```

### 2. AI Assistant Welcome Screen
```
┌────────────────────────────────────────────┐
│  🤖 AI Assistant                           │
│  Ask me about your students               │
├────────────────────────────────────────────┤
│                                            │
│         🤖                                 │
│    Welcome to AI Assistant                │
│                                            │
│  Ask me about your students' performance, │
│  attendance, behavior, and more!          │
│                                            │
│  Try asking:                               │
│  ┌──────────────────────────────────────┐ │
│  │ "Report of Aditya Honrao 8A"        │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ "Show attendance for John Doe 10B"  │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ "List high-risk students"           │ │
│  └──────────────────────────────────────┘ │
│                                            │
├────────────────────────────────────────────┤
│  [Suggestion] [Suggestion] [Suggestion]   │
│                                            │
│  Ask about a student...                   │
│  [_________________________________] [Ask] │
└────────────────────────────────────────────┘
```

### 3. Query Example
```
User Query:
┌────────────────────────────────────────────┐
│                                      You   │
│  ┌──────────────────────────────────────┐ │
│  │ Give me report of Aditya Honrao 8A  │ │
│  │ of last week                         │ │
│  │                              10:30 AM│ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 4. AI Response
```
AI Response:
┌────────────────────────────────────────────┐
│  🤖 AI Assistant                           │
│  ┌──────────────────────────────────────┐ │
│  │ 📊 Student Report: Aditya Honrao     │ │
│  │                                       │ │
│  │ Class: 8A                            │ │
│  │ Roll Number: 15                      │ │
│  │ Period: Dec 20 - Dec 27              │ │
│  │                                       │ │
│  │ 📅 Attendance Summary:               │ │
│  │ • Overall: 85% (6 present, 1 absent) │ │
│  │ • Total days tracked: 7              │ │
│  │                                       │ │
│  │ 📚 Academic Performance:             │ │
│  │ • Average marks: 78%                 │ │
│  │ • Exams completed: 3                 │ │
│  │ • Recent scores: 75/100, 80/100      │ │
│  │                                       │ │
│  │ 🎭 Behavior Records:                 │ │
│  │ • Positive incidents: 2              │ │
│  │ • Negative incidents: 0              │ │
│  │                                       │ │
│  │ ⚠️ Risk Assessment:                  │ │
│  │ • Risk Level: LOW                    │ │
│  │ • Risk Score: 15.2%                  │ │
│  │ • Confidence: high                   │ │
│  │                                       │ │
│  │ 💡 Recommendations:                  │ │
│  │ • ✅ Student is performing well      │ │
│  │   - continue monitoring              │ │
│  │                              10:30 AM│ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### 5. Input Area with Suggestions
```
┌────────────────────────────────────────────┐
│  [Report of...] [Show attendance...] [...] │
│                                            │
│  Ask about a student... (e.g., 'Report    │
│  of John Doe 8A')                          │
│  [_________________________________] [Ask] │
└────────────────────────────────────────────┘
```

## Color Scheme

### AI Assistant Mode
- **Header**: Blue-purple gradient background
- **Robot Icon**: White on gradient circle
- **User Messages**: Blue background, white text
- **AI Messages**: White background, dark text
- **Suggestions**: Light gray pills with hover effect

### Visual Indicators
- 🤖 Robot icon for AI Assistant
- 👤 User icon for teachers
- 📊 Chart icon for reports
- 📅 Calendar for attendance
- 📚 Books for academics
- 🎭 Masks for behavior
- ⚠️ Warning for risk
- 🎯 Target for interventions
- 💡 Bulb for recommendations
- ✅ Checkmark for positive
- ❌ Cross for negative

## Interaction Flow

```
1. Click "AI Assistant" in sidebar
   ↓
2. See welcome screen with suggestions
   ↓
3. Type query or click suggestion
   ↓
4. Click "Ask" button or press Enter
   ↓
5. See "AI is thinking..." animation
   ↓
6. Receive formatted report
   ↓
7. Ask another question or switch to faculty chat
```

## Mobile View

On mobile devices:
- Sidebar becomes a dropdown
- Messages stack vertically
- Suggestions scroll horizontally
- Touch-friendly buttons

## Accessibility

- ✅ Keyboard navigation supported
- ✅ Screen reader friendly
- ✅ High contrast mode compatible
- ✅ Focus indicators visible
- ✅ ARIA labels on interactive elements

## Animation Effects

1. **Message Appearance**: Slide in from bottom
2. **Typing Indicator**: Bouncing dots
3. **Suggestions**: Fade in on load
4. **Button Hover**: Scale up slightly
5. **Scroll**: Smooth auto-scroll to new messages

## Tips for Best UX

1. **Clear Prompts**: Placeholder text shows example format
2. **Quick Actions**: Suggestion buttons for common queries
3. **Visual Feedback**: Loading states and animations
4. **Error Handling**: Friendly error messages
5. **Responsive**: Works on all screen sizes

---

**Pro Tip**: Use the suggestion buttons to learn the query format, then customize your own queries!
