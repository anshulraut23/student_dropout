# 🎮 Gamification System Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEACHER ACTIONS                          │
│  Mark Attendance │ Enter Marks │ Log Behavior │ Add Students   │
└────────┬────────────────┬────────────┬──────────────┬───────────┘
         │                │            │              │
         ▼                ▼            ▼              ▼
    ┌────────────────────────────────────────────────────┐
    │              XP AWARD SYSTEM                       │
    │  +20 XP      │  +30 XP    │  +20 XP   │  Metric   │
    └────────┬───────────┬───────────┬────────────┬──────┘
             │           │           │            │
             ▼           ▼           ▼            ▼
        ┌────────────────────────────────────────────┐
        │         GAMIFICATION ENGINE                │
        │  • Calculate Total XP                      │
        │  • Determine Level (1-5)                   │
        │  • Check Badge Criteria                    │
        │  • Update Login Streak                     │
        │  • Track Daily Tasks                       │
        └────────┬───────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────────┐
        │           DATABASE STORAGE                 │
        │  • teacher_gamification (stats)            │
        │  • xp_logs (history)                       │
        │  • badges (definitions)                    │
        │  • teacher_badges (earned)                 │
        └────────┬───────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────────────┐
        │          FRONTEND DISPLAY                  │
        │  • Progress Page (stats, levels, badges)   │
        │  • Leaderboard (rankings, competition)     │
        │  • Daily Tasks (checklist)                 │
        │  • Certificates (achievements)             │
        └────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Teacher Performs Action
```
Teacher marks attendance for 5 students
↓
Frontend: AttendanceTab.jsx
↓
API Call: POST /api/attendance/bulk
↓
Success Response
```

### 2. XP Award Triggered
```
useGameification hook: awardAttendanceXP()
↓
API Call: POST /api/gamification/award-xp
Body: { actionType: "attendance", xpEarned: 20 }
↓
Backend: gamificationController.awardXP()
```

### 3. Gamification Engine Processing
```
1. Fetch current teacher stats from database
2. Add XP log entry (teacher_id, action_type, xp_earned)
3. Calculate new total XP (old + 20)
4. Determine new level from XP (getLevelFromXP)
5. Update teacher_gamification table
6. Check badge criteria (evaluateBadges)
7. Award new badges if criteria met
8. Return updated stats to frontend
```

### 4. Frontend Updates
```
Receive updated stats
↓
Update GamificationContext state
↓
Show toast notification: "+20 XP earned!"
↓
If leveled up: Show "Level Up!" animation
↓
If badge earned: Show "Badge Unlocked!" notification
```

---

## Database Schema

### teacher_gamification
```sql
CREATE TABLE teacher_gamification (
    teacher_id UUID PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,           -- Total XP earned
    current_level INTEGER DEFAULT 1,      -- Current level (1-5)
    login_streak INTEGER DEFAULT 0,       -- Consecutive login days
    tasks_completed INTEGER DEFAULT 0,    -- Total tasks completed
    students_helped INTEGER DEFAULT 0,    -- Students helped
    students_added INTEGER DEFAULT 0,     -- Students added
    attendance_records INTEGER DEFAULT 0, -- Attendance marked
    high_risk_students_helped INTEGER DEFAULT 0, -- High-risk helped
    weekly_task_completion INTEGER DEFAULT 0,    -- Weekly tasks done
    last_active_date DATE,                -- Last login date
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### xp_logs
```sql
CREATE TABLE xp_logs (
    id UUID PRIMARY KEY,
    teacher_id UUID REFERENCES users(id),
    action_type VARCHAR(50),  -- 'attendance', 'marks', 'behaviour', etc.
    xp_earned INTEGER,        -- XP amount for this action
    created_at TIMESTAMP      -- When XP was earned
);
```

### badges
```sql
CREATE TABLE badges (
    badge_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255),       -- "First 10 Students"
    description TEXT,         -- "Added your first 10 students"
    icon VARCHAR(20),         -- "👥"
    criteria TEXT             -- "studentsAdded >= 10"
);
```

### teacher_badges
```sql
CREATE TABLE teacher_badges (
    id UUID PRIMARY KEY,
    teacher_id UUID REFERENCES users(id),
    badge_id VARCHAR(100) REFERENCES badges(badge_id),
    earned_at TIMESTAMP,
    UNIQUE(teacher_id, badge_id)
);
```

---

## XP System Details

### XP Awards
| Action | XP | Frequency | Total Potential |
|--------|-----|-----------|-----------------|
| Daily Login | +10 | Once/day | 300/month |
| Mark Attendance | +20 | Per record | Unlimited |
| Enter Marks | +30 | Per exam | Unlimited |
| Log Behavior | +20 | Per incident | Unlimited |
| Complete Intervention | +40 | Per intervention | Unlimited |

### Level Progression
```
Level 1: Newcomer
├─ 0 XP required
├─ No certificate
└─ Starting level

Level 2: Helper
├─ 300 XP required (15 attendance records)
├─ Certificate: "Emerging Educator"
└─ ~2 weeks of daily activity

Level 3: Student Champion
├─ 1,000 XP required (50 attendance records)
├─ Certificate: "Student Champion"
└─ ~1 month of consistent activity

Level 4: Mentor
├─ 2,000 XP required (100 attendance records)
├─ Certificate: "Certified Mentor"
└─ ~2 months of consistent activity

Level 5: Master Educator
├─ 4,000 XP required (200 attendance records)
├─ Certificate: "Master Educator"
└─ ~4 months of consistent activity
```

---

## Badge System

### Badge Definitions

#### 1. First 10 Students 👥
- **Criteria:** Add 10 students to your classes
- **Difficulty:** Easy
- **Time to Earn:** 1-2 days
- **Metric:** `studentsAdded >= 10`

#### 2. 7 Day Streak 🔥
- **Criteria:** Login for 7 consecutive days
- **Difficulty:** Medium
- **Time to Earn:** 1 week
- **Metric:** `loginStreak >= 7`

#### 3. 100 Attendance Records 📊
- **Criteria:** Mark 100 attendance records
- **Difficulty:** Medium
- **Time to Earn:** 2-3 weeks
- **Metric:** `attendanceRecords >= 100`

#### 4. Student Supporter 💙
- **Criteria:** Help 5 high-risk students
- **Difficulty:** Hard
- **Time to Earn:** 1-2 months
- **Metric:** `highRiskStudentsHelped >= 5`

#### 5. Consistency Star ⭐
- **Criteria:** Complete all daily tasks for a week
- **Difficulty:** Hard
- **Time to Earn:** 1 week of perfect completion
- **Metric:** `weeklyTaskCompletion >= 7`

---

## Daily Tasks System

### Task Types
```javascript
const DAILY_TASKS = [
  {
    id: 'attendance',
    label: 'Mark Attendance',
    xp: 20,
    icon: '📋',
    description: 'Mark attendance for at least one class'
  },
  {
    id: 'marks',
    label: 'Enter Marks',
    xp: 30,
    icon: '📝',
    description: 'Enter exam marks for students'
  },
  {
    id: 'behaviour',
    label: 'Log Behavior',
    xp: 20,
    icon: '⭐',
    description: 'Log a behavior incident (positive or negative)'
  },
  {
    id: 'intervention',
    label: 'Complete Intervention',
    xp: 40,
    icon: '🎯',
    description: 'Mark an intervention as complete'
  },
  {
    id: 'login',
    label: 'Daily Login',
    xp: 10,
    icon: '🔐',
    description: 'Login to the system (auto-completed)'
  }
];
```

### Daily Task Tracking
- Tasks reset at midnight (00:00)
- Completion tracked in `xp_logs` table
- Weekly completion tracked for "Consistency Star" badge
- Progress bar shows daily completion percentage

---

## Leaderboard System

### Ranking Algorithm
```javascript
// Teachers ranked by total XP (descending)
SELECT 
  u.id as teacher_id,
  u.full_name as name,
  s.name as school_name,
  tg.total_xp,
  tg.current_level,
  COUNT(tb.badge_id) as badges_count
FROM teacher_gamification tg
JOIN users u ON tg.teacher_id = u.id
JOIN schools s ON u.school_id = s.id
LEFT JOIN teacher_badges tb ON tg.teacher_id = tb.teacher_id
GROUP BY u.id, u.full_name, s.name, tg.total_xp, tg.current_level
ORDER BY tg.total_xp DESC;
```

### Time Filters
- **Today:** XP earned in last 24 hours
- **This Week:** XP earned since Monday 00:00
- **This Month:** XP earned since 1st of month
- **All Time:** Total XP ever earned

### Leaderboard Features
- Top 3 podium display (🥇 🥈 🥉)
- Full rankings table
- "Your Rank" card highlighting teacher's position
- Real-time updates
- School-wide competition

---

## Frontend Components

### 1. GamificationPage
**Path:** `src/pages/teacher/GamificationPage.jsx`

**Sections:**
- Teacher Stats (4 cards: XP, Achievements, Streak, Students Helped)
- Level Progress (current level, roadmap, XP to next level)
- Badges Section (earned badges, available badges)
- Certificates Section (unlocked certificates, download)
- Daily Tasks (interactive checklist with XP rewards)
- How It Works (explanation section)

### 2. LeaderboardPage
**Path:** `src/pages/teacher/LeaderboardPage.jsx`

**Sections:**
- Time Filters (Today, Week, Month, All-time)
- Your Rank Card (current position, XP, level, badges)
- Top 3 Podium (highlighted winners)
- Full Rankings Table (all teachers)

### 3. Reusable Components
**Path:** `src/components/gamification/`

- `TeacherStats.jsx` - Stat cards
- `LevelProgress.jsx` - Level visualization
- `BadgesSection.jsx` - Badge display
- `CertificatesSection.jsx` - Certificate management
- `DailyTasks.jsx` - Task checklist
- `LeaderboardTable.jsx` - Rankings table
- `LeaderboardFilters.jsx` - Time filters

---

## API Endpoints

### GET /api/gamification/stats
**Purpose:** Fetch teacher's gamification stats
**Auth:** Required (teacher/admin)
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalXP": 450,
    "currentLevel": 2,
    "loginStreak": 5,
    "badges": ["first_10_students"],
    "dailyTasksCompleted": {
      "attendance": true,
      "marks": false,
      "behaviour": false,
      "intervention": false,
      "login": true
    }
  }
}
```

### POST /api/gamification/award-xp
**Purpose:** Award XP for an action
**Auth:** Required (teacher/admin)
**Body:**
```json
{
  "actionType": "attendance",
  "xpEarned": 20
}
```
**Response:**
```json
{
  "success": true,
  "stats": { /* updated stats */ }
}
```

### POST /api/gamification/update-streak
**Purpose:** Update daily login streak
**Auth:** Required (teacher/admin)
**Response:**
```json
{
  "success": true,
  "streak": 6,
  "stats": { /* updated stats */ }
}
```

### GET /api/gamification/leaderboard?filter=week
**Purpose:** Get leaderboard rankings
**Auth:** Required (teacher/admin)
**Query Params:** `filter` (today|week|month|all-time)
**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "teacherId": "abc123",
      "name": "John Doe",
      "schoolName": "ABC School",
      "totalXP": 2500,
      "level": 4,
      "badgesCount": 3
    }
  ],
  "totalTeachers": 25
}
```

### GET /api/gamification/rank?filter=month
**Purpose:** Get teacher's current rank
**Auth:** Required (teacher/admin)
**Response:**
```json
{
  "success": true,
  "rank": 5,
  "totalTeachers": 25
}
```

---

## Integration Points

### Where to Award XP

1. **AttendanceTab.jsx** → After marking attendance
2. **ScoresTab.jsx** → After entering marks
3. **BehaviorTab.jsx** → After logging behavior
4. **InterventionTab.jsx** → After completing intervention
5. **AddStudentPage.jsx** → After adding student (update metrics)
6. **App.jsx** → On login (update streak)

### Where to Update Metrics

1. **studentController.js** → Increment `studentsAdded`
2. **attendanceController.js** → Increment `attendanceRecords`
3. **interventionController.js** → Increment `highRiskStudentsHelped`

---

## Success Metrics

### Teacher Engagement
- **Daily Active Users:** Track teachers logging in daily
- **XP Earned per Day:** Average XP earned by active teachers
- **Badge Completion Rate:** % of teachers earning each badge
- **Leaderboard Participation:** % of teachers with XP > 0

### System Health
- **API Response Time:** < 200ms for gamification endpoints
- **Database Query Performance:** < 50ms for leaderboard queries
- **Error Rate:** < 1% for XP award operations
- **Data Consistency:** 100% accuracy in XP calculations

---

## Future Enhancements

### Phase 2 Features
- [ ] Team challenges (department vs department)
- [ ] Monthly competitions with prizes
- [ ] Custom school-specific badges
- [ ] Achievement milestones (1000 XP, 5000 XP, etc.)
- [ ] XP multipliers for special events

### Phase 3 Features
- [ ] Student gamification system
- [ ] Parent engagement rewards
- [ ] School-wide leaderboards
- [ ] Mobile app with push notifications
- [ ] Analytics dashboard for admins

---

## Maintenance

### Daily Tasks
- Monitor XP award success rate
- Check for badge unlock errors
- Verify leaderboard accuracy

### Weekly Tasks
- Review top performers
- Analyze engagement metrics
- Check for gaming/abuse

### Monthly Tasks
- Reset monthly leaderboards
- Generate engagement reports
- Plan competitions/challenges

---

**Status:** 90% Complete - Ready for Integration
**Documentation:** Complete
**Testing:** Required
**Deployment:** Ready
