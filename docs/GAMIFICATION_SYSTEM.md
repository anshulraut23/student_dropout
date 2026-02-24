# Gamification System

## Overview
Teacher engagement system with XP points, levels, badges, and leaderboards to motivate consistent platform usage and reward quality teaching practices.

## Features
- XP (Experience Points) system
- Level progression (1-5)
- Achievement badges
- Leaderboards with multiple timeframes
- Daily task tracking
- Login streak monitoring

## XP Earning Actions

### Data Entry Actions
| Action | XP Earned | Description |
|--------|-----------|-------------|
| Mark Attendance | +20 XP | Per attendance session |
| Enter Marks | +30 XP | Per exam marks entry |
| Log Behavior | +20 XP | Per behavior record |
| Create Intervention | +40 XP | Per intervention created |
| Daily Login | +10 XP | First login of the day |

### Automatic XP Awards
- XP is awarded automatically after successful actions
- Success message shows "+XX XP earned!"
- XP updates in real-time on progress page
- No manual claiming required

## Level System

### Level Thresholds
- **Level 1**: 0 - 299 XP (Beginner)
- **Level 2**: 300 - 999 XP (Intermediate)
- **Level 3**: 1000 - 1999 XP (Advanced)
- **Level 4**: 2000 - 3999 XP (Expert)
- **Level 5**: 4000+ XP (Master)

### Level Benefits
- Visual recognition on profile
- Leaderboard ranking boost
- Achievement unlocks
- School-wide recognition

## Badge System

### Available Badges

#### 👥 First 10 Students
- **Criteria**: Add 10 students to the system
- **Reward**: Recognition for onboarding efforts

#### 🔥 7 Day Streak
- **Criteria**: Log in for 7 consecutive days
- **Reward**: Consistency recognition

#### 📊 100 Attendance Records
- **Criteria**: Mark 100 attendance sessions
- **Reward**: Dedication to attendance tracking

#### 💙 Student Supporter
- **Criteria**: Help 5 high-risk students
- **Reward**: Recognition for intervention efforts

#### ⭐ Consistency Star
- **Criteria**: Complete all daily tasks for a week
- **Reward**: Excellence in daily engagement

### Badge Display
- Shown on teacher profile
- Displayed on progress page
- Visible in leaderboard
- Shareable achievements

## Leaderboard System

### Timeframe Filters
1. **All Time** - Total XP since account creation
2. **This Month** - XP earned in current month
3. **This Week** - XP earned in current week
4. **Today** - XP earned today

### Ranking Display
- **Top 3**: Special podium display with medals 🥇🥈🥉
- **Full Rankings**: Complete table with all teachers
- **Your Rank**: Highlighted row showing your position
- **Statistics**: Total teachers, average level, highest XP

### Leaderboard Features
- Real-time updates
- School-wide competition
- Filter by timeframe
- Export rankings
- View teacher profiles

## Progress Page

### Dashboard Sections

#### 1. XP Overview
- Total XP earned
- Current level
- Progress to next level
- XP progress bar

#### 2. Statistics
- Login streak count
- Tasks completed
- Students helped
- Attendance records tracked

#### 3. Daily Tasks
- Attendance marking ✓
- Marks entry ✓
- Behavior logging ✓
- Intervention creation ✓
- Daily login ✓

#### 4. Badges Earned
- Badge icons with titles
- Earned date
- Progress to next badge
- Locked badges preview

#### 5. Recent Activity
- Latest XP gains
- Recent achievements
- Level ups
- Badge unlocks

## Database Schema

### Tables

#### teacher_gamification
```sql
- teacher_id (PK)
- total_xp
- current_level
- login_streak
- tasks_completed
- students_helped
- students_added
- attendance_records
- high_risk_students_helped
- weekly_task_completion
- last_active_date
```

#### xp_logs
```sql
- id (PK)
- teacher_id (FK)
- action_type
- xp_earned
- created_at
```

#### badges
```sql
- badge_id (PK)
- title
- description
- icon
- criteria
```

#### teacher_badges
```sql
- id (PK)
- teacher_id (FK)
- badge_id (FK)
- earned_at
```

## API Endpoints

### Gamification Stats
```
GET /api/gamification/stats
Response: {
  totalXP, currentLevel, loginStreak,
  tasksCompleted, badges, dailyTasksCompleted
}
```

### Award XP
```
POST /api/gamification/award-xp
Body: { actionType, xpEarned }
Response: { success, stats }
```

### Update Login Streak
```
POST /api/gamification/update-streak
Response: { success, streak, stats }
```

### Check Badges
```
POST /api/gamification/check-badges
Response: { success, newBadges, stats }
```

### Leaderboard
```
GET /api/gamification/leaderboard?filter=all-time
Response: { leaderboard, totalTeachers }
```

### Teacher Rank
```
GET /api/gamification/rank?filter=all-time
Response: { rank, totalTeachers }
```

## Integration Points

### Data Entry Tabs
- **AttendanceTab**: Awards +20 XP after marking
- **ScoresTab**: Awards +30 XP after entering marks
- **BehaviourTab**: Awards +20 XP after logging

### Dashboard
- Shows current rank
- Quick link to leaderboard
- Recent XP gains
- Level progress

### Profile
- Displays badges
- Shows total XP
- Level indicator
- Achievement history

## Setup Instructions

### 1. Database Migration
```bash
cd backend
node scripts/apply-gamification-migration.js
```

### 2. Verify Tables
```bash
node scripts/verify-gamification-tables.js
```

### 3. Test System
```bash
node scripts/test-gamification-api.js
```

## Usage Flow

### For Teachers
1. Log in to platform
2. Perform daily tasks (attendance, marks, behavior)
3. Earn XP automatically
4. View progress on Progress page
5. Check rank on Leaderboard
6. Unlock badges through achievements
7. Compete with colleagues

### For Admins
1. Monitor teacher engagement
2. View leaderboard statistics
3. Recognize top performers
4. Export engagement reports
5. Adjust XP values if needed

## Gamification Psychology

### Motivation Elements
- **Progress**: Visual XP and level progression
- **Achievement**: Badges for milestones
- **Competition**: Leaderboard rankings
- **Recognition**: Public acknowledgment
- **Consistency**: Daily streak rewards

### Engagement Strategies
- Immediate feedback (XP notifications)
- Clear goals (badge criteria)
- Social proof (leaderboard)
- Incremental rewards (level ups)
- Variety (multiple earning methods)

## Best Practices

### For Teachers
- Log in daily to maintain streak
- Complete all daily tasks
- Focus on quality over quantity
- Help at-risk students for bonus XP
- Check progress regularly

### For Admins
- Celebrate top performers
- Share leaderboard updates
- Recognize badge earners
- Encourage healthy competition
- Monitor engagement trends

## Troubleshooting

### XP Not Awarded
- Check backend server is running
- Verify database connection
- Check browser console for errors
- Ensure action completed successfully

### Leaderboard Not Loading
- Verify API endpoint is accessible
- Check database has gamification tables
- Ensure teacher has gamification record
- Refresh page and retry

### Badges Not Unlocking
- Verify criteria is met
- Check badge definitions in database
- Run check-badges endpoint manually
- Review badge logic in controller

## Future Enhancements
- Team competitions
- Monthly challenges
- Seasonal events
- Custom badges
- XP multipliers
- Achievement sharing
- Email notifications
- Mobile app integration
