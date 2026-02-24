-- Gamification tables

CREATE TABLE IF NOT EXISTS teacher_gamification (
    teacher_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    login_streak INTEGER NOT NULL DEFAULT 0,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    students_helped INTEGER NOT NULL DEFAULT 0,
    students_added INTEGER NOT NULL DEFAULT 0,
    attendance_records INTEGER NOT NULL DEFAULT 0,
    high_risk_students_helped INTEGER NOT NULL DEFAULT 0,
    weekly_task_completion INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS xp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badges (
    badge_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(20),
    criteria TEXT
);

CREATE TABLE IF NOT EXISTS teacher_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(100) NOT NULL REFERENCES badges(badge_id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_xp_logs_teacher_id ON xp_logs(teacher_id);
CREATE INDEX IF NOT EXISTS idx_xp_logs_created_at ON xp_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_teacher_badges_teacher_id ON teacher_badges(teacher_id);

-- Update trigger for teacher_gamification
CREATE TRIGGER update_teacher_gamification_updated_at
BEFORE UPDATE ON teacher_gamification
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed badges (idempotent)
INSERT INTO badges (badge_id, title, description, icon, criteria)
VALUES
  ('first_10_students', 'First 10 Students', 'Added your first 10 students', '👥', 'studentsAdded >= 10'),
  ('7_day_streak', '7 Day Streak', 'Logged in for 7 consecutive days', '🔥', 'loginStreak >= 7'),
  ('100_records', '100 Attendance Records', 'Tracked 100 attendance records', '📊', 'attendanceRecords >= 100'),
  ('risk_saver', 'Student Supporter', 'Helped 5 high-risk students', '💙', 'highRiskStudentsHelped >= 5'),
  ('consistency_star', 'Consistency Star', 'Completed all daily tasks for a week', '⭐', 'weeklyTaskCompletion >= 7')
ON CONFLICT (badge_id) DO NOTHING;
