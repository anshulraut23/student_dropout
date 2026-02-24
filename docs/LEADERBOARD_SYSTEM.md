# Leaderboard System

## Overview
Competitive ranking system displaying teacher performance based on gamification metrics, fostering healthy competition and recognizing top performers.

## Features
- Real-time rankings
- Multiple timeframe filters
- Top 3 podium display
- Full rankings table
- Personal rank tracking
- Statistics dashboard

## Ranking Criteria

### Primary Metric: Total XP
Teachers are ranked by total XP earned through:
- Attendance marking (+20 XP)
- Marks entry (+30 XP)
- Behavior logging (+20 XP)
- Interventions (+40 XP)
- Daily logins (+10 XP)

### Tie-Breaking Rules
1. **Primary**: Total XP (highest wins)
2. **Secondary**: Current Level (highest wins)
3. **Tertiary**: Badges Count (most wins)

## Timeframe Filters

### 1. All Time
- **Data Source**: teacher_gamification.total_xp
- **Description**: Total XP since account creation
- **Use Case**: Overall performance ranking
- **Updates**: Real-time with XP awards

### 2. This Month
- **Data Source**: xp_logs (current month)
- **Description**: XP earned in current calendar month
- **Use Case**: Monthly competition
- **Resets**: First day of each month

### 3. This Week
- **Data Source**: xp_logs (current week)
- **Description**: XP earned Monday-Sunday
- **Use Case**: Weekly challenges
- **Resets**: Every Monday

### 4. Today
- **Data Source**: xp_logs (current day)
- **Description**: XP earned today
- **Use Case**: Daily activity tracking
- **Resets**: Midnight each day

## User Interface

### Leaderboard Page Layout

#### 1. Header Section
- Page title and description
- "Open Chat" button
- Filter buttons
- Your rank card

#### 2. Your Rank Card
- Current rank with medal (if top 3)
- Total XP display
- Current level
- Badges count
- Highlighted in blue gradient

#### 3. Top 3 Podium
- **1st Place**: Gold styling, larger card, 🥇
- **2nd Place**: Silver styling, 🥈
- **3rd Place**: Bronze styling, 🥉
- Teacher name and school
- XP and level display

#### 4. Full Rankings Table
- Rank number
- Teacher name
- School name
- Total XP
- Current level
- Badges count
- Highlighted row for current user

#### 5. Statistics Panel
- Total teachers participating
- Average level across all
- Highest XP achieved
- Purple gradient styling

### Visual Hierarchy

#### Medal Icons
- 🥇 1st Place (Gold)
- 🥈 2nd Place (Silver)
- 🥉 3rd Place (Bronze)
- 🎖️ 4th+ Place

#### Color Coding
- **Top 3**: Special gradient backgrounds
- **Current User**: Blue highlight
- **Others**: White background

## Database Queries

### All-Time Leaderboard
```sql
SELECT 
  u.id, u.full_name, s.name as school_name,
  g.total_xp, g.current_level,
  COUNT(tb.badge_id) as badges_count
FROM users u
LEFT JOIN teacher_gamification g ON g.teacher_id = u.id
LEFT JOIN schools s ON s.id = u.school_id
LEFT JOIN teacher_badges tb ON tb.teacher_id = u.id
WHERE u.role = 'teacher'
GROUP BY u.id, s.name, g.total_xp, g.current_level
ORDER BY g.total_xp DESC
```

### Time-Filtered Leaderboard
```sql
SELECT 
  u.id, u.full_name, s.name as school_name,
  SUM(xl.xp_earned) as total_xp,
  g.current_level,
  COUNT(tb.badge_id) as badges_count
FROM users u
LEFT JOIN xp_logs xl ON xl.teacher_id = u.id
  AND xl.created_at >= $start
  AND xl.created_at <= $end
LEFT JOIN teacher_gamification g ON g.teacher_id = u.id
LEFT JOIN schools s ON s.id = u.school_id
LEFT JOIN teacher_badges tb ON tb.teacher_id = u.id
WHERE u.role = 'teacher'
GROUP BY u.id, s.name, g.current_level
ORDER BY total_xp DESC
```

## API Endpoints

### Get Leaderboard
```
GET /api/gamification/leaderboard?filter=all-time

Query Parameters:
- filter: all-time | month | week | today

Response:
{
  success: true,
  leaderboard: [
    {
      teacherId, name, schoolName,
      totalXP, level, badgesCount
    }
  ],
  totalTeachers: number
}
```

### Get Teacher Rank
```
GET /api/gamification/rank?filter=all-time

Query Parameters:
- filter: all-time | month | week | today

Response:
{
  success: true,
  rank: number,
  totalTeachers: number
}
```

## Ranking Logic

### Calculation Process
1. Fetch all teachers with gamification data
2. Calculate XP based on selected timeframe
3. Sort by XP (descending)
4. Apply tie-breaking rules
5. Assign rank numbers (1, 2, 3, ...)
6. Return ranked list

### Rank Assignment
```javascript
const ranked = leaderboard.map((entry, index) => ({
  ...entry,
  rank: index + 1
}));
```

### Finding User Rank
```javascript
const userRank = ranked.find(
  entry => entry.teacherId === currentUserId
);
```

## Competitive Features

### Motivation Elements

#### 1. Visual Recognition
- Top 3 get special podium display
- Medal icons for top performers
- Gradient backgrounds
- Larger cards for winners

#### 2. Social Proof
- See what top performers are doing
- Compare with colleagues
- School-wide visibility
- Public acknowledgment

#### 3. Progress Tracking
- Watch rank improve over time
- See XP gap to next rank
- Track weekly/monthly progress
- Historical rank data

#### 4. Multiple Competitions
- All-time: Long-term achievement
- Monthly: Fresh start each month
- Weekly: Short-term goals
- Daily: Immediate feedback

### Gamification Psychology

#### Achievement
- Clear ranking system
- Visible progress
- Milestone recognition
- Status symbols (medals)

#### Competition
- Friendly rivalry
- Peer comparison
- School pride
- Team spirit

#### Recognition
- Public leaderboard
- Top performer spotlight
- Achievement celebration
- Social validation

## Statistics Dashboard

### Metrics Displayed

#### Total Teachers
- Count of all participating teachers
- Shows competition size
- Indicates engagement level

#### Average Level
- Mean level across all teachers
- Benchmark for comparison
- Shows overall progress

#### Highest XP
- Maximum XP achieved
- Goal for others
- Shows what's possible

## Usage Scenarios

### For Teachers

#### Daily Check
1. Log in to platform
2. Navigate to Leaderboard
3. Check current rank
4. View XP gap to next rank
5. Plan activities to earn more XP

#### Weekly Review
1. Switch to "This Week" filter
2. See weekly performance
3. Compare with last week
4. Adjust strategy for next week

#### Monthly Goals
1. View "This Month" leaderboard
2. Set monthly XP target
3. Track progress daily
4. Push for top 10 finish

### For Admins

#### Engagement Monitoring
1. View total teachers count
2. Check average level
3. Identify inactive teachers
4. Encourage participation

#### Recognition Programs
1. Announce top 3 monthly
2. Reward high performers
3. Share success stories
4. Celebrate achievements

## Best Practices

### For Teachers
- Check leaderboard daily
- Set realistic rank goals
- Focus on quality work
- Maintain consistency
- Celebrate small wins

### For Admins
- Update leaderboard regularly
- Recognize top performers
- Share rankings in meetings
- Create monthly challenges
- Reward participation

## Performance Optimization

### Caching Strategy
- Cache leaderboard for 5 minutes
- Invalidate on XP award
- Separate cache per filter
- Reduce database load

### Query Optimization
- Indexed columns (teacher_id, created_at)
- Efficient JOINs
- Limit result set
- Aggregate at database level

### Frontend Optimization
- Lazy load full table
- Virtual scrolling for large lists
- Debounced filter changes
- Optimistic UI updates

## Troubleshooting

### Leaderboard Not Loading
- Check API endpoint
- Verify database connection
- Check browser console
- Refresh page

### Rank Not Updating
- Verify XP was awarded
- Check filter selection
- Wait for cache refresh
- Force reload page

### Missing Teachers
- Ensure teacher has gamification record
- Check role is 'teacher'
- Verify school_id matches
- Check database data

## Future Enhancements
- Historical rank tracking
- Rank change indicators (↑↓)
- School vs school leaderboards
- Subject-specific rankings
- Grade-level rankings
- Export leaderboard as PDF
- Email rank updates
- Push notifications
- Achievement milestones
- Seasonal competitions
