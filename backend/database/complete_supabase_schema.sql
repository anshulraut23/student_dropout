-- ============================================================================
-- COMPLETE SUPABASE SCHEMA - Education Assistant Platform
-- ============================================================================
-- This is a unified, idempotent schema that can be run multiple times safely.
-- It will create missing tables/columns and skip existing ones.
-- 
-- Features included:
-- - Core system (schools, users, classes, students)
-- - Attendance tracking
-- - Exam management
-- - Marks management
-- - Behavior tracking
-- - Interventions
-- - ML Risk Predictions
-- - Gamification system
-- - Faculty Connect (teacher chat)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Schools Table
CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    admin_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher')),
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL,
    section VARCHAR(10),
    academic_year VARCHAR(20) NOT NULL,
    teacher_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    attendance_mode VARCHAR(20) NOT NULL DEFAULT 'daily' CHECK (attendance_mode IN ('daily', 'subject')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50),
    enrollment_no VARCHAR(50) UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(20),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    contact_number VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ATTENDANCE SYSTEM
-- ============================================================================

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by TEXT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT REFERENCES users(id)
);

-- Add missing attendance columns (idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='attendance' AND column_name='notes') THEN
        ALTER TABLE attendance ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='attendance' AND column_name='updated_at') THEN
        ALTER TABLE attendance ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='attendance' AND column_name='updated_by') THEN
        ALTER TABLE attendance ADD COLUMN updated_by TEXT REFERENCES users(id);
    END IF;
END $$;

-- ============================================================================
-- EXAM MANAGEMENT SYSTEM
-- ============================================================================

-- Exam Templates Table
CREATE TABLE IF NOT EXISTS exam_templates (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    subjects JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam Periods Table
CREATE TABLE IF NOT EXISTS exam_periods (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_id TEXT REFERENCES exam_templates(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed')),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    exam_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing exam columns (idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='template_id') THEN
        ALTER TABLE exams ADD COLUMN template_id TEXT REFERENCES exam_templates(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='weightage') THEN
        ALTER TABLE exams ADD COLUMN weightage DECIMAL(3,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='duration') THEN
        ALTER TABLE exams ADD COLUMN duration INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='instructions') THEN
        ALTER TABLE exams ADD COLUMN instructions TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='syllabus_topics') THEN
        ALTER TABLE exams ADD COLUMN syllabus_topics JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='is_auto_generated') THEN
        ALTER TABLE exams ADD COLUMN is_auto_generated BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='created_by') THEN
        ALTER TABLE exams ADD COLUMN created_by TEXT REFERENCES users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exams' AND column_name='updated_at') THEN
        ALTER TABLE exams ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Marks Table
CREATE TABLE IF NOT EXISTS marks (
    id TEXT PRIMARY KEY,
    exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'verified')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BEHAVIOR & INTERVENTIONS SYSTEM
-- ============================================================================

-- Behavior Table
CREATE TABLE IF NOT EXISTS behavior (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id TEXT NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    behavior_type VARCHAR(20) NOT NULL CHECK (behavior_type IN ('positive', 'negative')),
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    description TEXT NOT NULL,
    action_taken TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interventions Table
CREATE TABLE IF NOT EXISTS interventions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    initiated_by TEXT NOT NULL REFERENCES users(id),
    intervention_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20),
    trigger_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(255),
    description TEXT NOT NULL,
    action_plan TEXT,
    expected_outcome TEXT,
    start_date DATE,
    target_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'pending', 'sent', 'failed')),
    outcome TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Intervention Messages Table
CREATE TABLE IF NOT EXISTS intervention_messages (
    id TEXT PRIMARY KEY,
    intervention_id TEXT NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sent_date TIMESTAMP,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed', 'read')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ML RISK PREDICTION SYSTEM
-- ============================================================================

-- Risk Predictions Table
CREATE TABLE IF NOT EXISTS risk_predictions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    risk_score DECIMAL(5,3) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    confidence VARCHAR(20) NOT NULL CHECK (confidence IN ('insufficient', 'low', 'medium', 'high')),
    data_tier INTEGER NOT NULL CHECK (data_tier >= 0 AND data_tier <= 3),
    component_scores JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, school_id)
);

-- ============================================================================
-- GAMIFICATION SYSTEM
-- ============================================================================

-- Teacher Gamification Table
CREATE TABLE IF NOT EXISTS teacher_gamification (
    teacher_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
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

-- XP Logs Table
CREATE TABLE IF NOT EXISTS xp_logs (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
    badge_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(20),
    criteria TEXT
);

-- Teacher Badges Table
CREATE TABLE IF NOT EXISTS teacher_badges (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(100) NOT NULL REFERENCES badges(badge_id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (teacher_id, badge_id)
);

-- Seed badges (idempotent)
INSERT INTO badges (badge_id, title, description, icon, criteria)
VALUES
    ('first_10_students', 'First 10 Students', 'Added your first 10 students', '👥', 'studentsAdded >= 10'),
    ('7_day_streak', '7 Day Streak', 'Logged in for 7 consecutive days', '🔥', 'loginStreak >= 7'),
    ('100_records', '100 Attendance Records', 'Tracked 100 attendance records', '📊', 'attendanceRecords >= 100'),
    ('risk_saver', 'Student Supporter', 'Helped 5 high-risk students', '💙', 'highRiskStudentsHelped >= 5'),
    ('consistency_star', 'Consistency Star', 'Completed all daily tasks for a week', '⭐', 'weeklyTaskCompletion >= 7')
ON CONFLICT (badge_id) DO NOTHING;

-- ============================================================================
-- FACULTY CONNECT SYSTEM (Teacher Chat)
-- ============================================================================

-- Faculty Invites Table
CREATE TABLE IF NOT EXISTS faculty_invites (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Messages Table
CREATE TABLE IF NOT EXISTS faculty_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    text TEXT,
    attachment_name TEXT,
    attachment_type TEXT,
    attachment_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Core tables indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_school_id ON requests(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subjects_class_id ON subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_updated_at ON attendance(updated_at);

-- Exam indexes
CREATE INDEX IF NOT EXISTS idx_exams_class_id ON exams(class_id);
CREATE INDEX IF NOT EXISTS idx_exams_template ON exams(template_id);
CREATE INDEX IF NOT EXISTS idx_marks_exam_id ON marks(exam_id);
CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);

-- Behavior & Interventions indexes
CREATE INDEX IF NOT EXISTS idx_behavior_student_id ON behavior(student_id);
CREATE INDEX IF NOT EXISTS idx_behavior_teacher_id ON behavior(teacher_id);
CREATE INDEX IF NOT EXISTS idx_behavior_date ON behavior(date);
CREATE INDEX IF NOT EXISTS idx_behavior_type ON behavior(behavior_type);
CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_initiated_by ON interventions(initiated_by);
CREATE INDEX IF NOT EXISTS idx_interventions_priority ON interventions(priority);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);

-- ML Risk Predictions indexes
CREATE INDEX IF NOT EXISTS idx_risk_predictions_school ON risk_predictions(school_id);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_level ON risk_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_student ON risk_predictions(student_id);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_created ON risk_predictions(created_at DESC);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_xp_logs_teacher_id ON xp_logs(teacher_id);
CREATE INDEX IF NOT EXISTS idx_xp_logs_created_at ON xp_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_teacher_badges_teacher_id ON teacher_badges(teacher_id);

-- Faculty Connect indexes
CREATE INDEX IF NOT EXISTS idx_faculty_invites_sender ON faculty_invites(sender_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_recipient ON faculty_invites(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_school ON faculty_invites(school_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_status ON faculty_invites(status);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_sender ON faculty_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_recipient ON faculty_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_school ON faculty_messages(school_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_created ON faculty_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_conversation ON faculty_messages(sender_id, recipient_id, created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Behavior updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_behavior_updated_at') THEN
        CREATE TRIGGER update_behavior_updated_at 
        BEFORE UPDATE ON behavior 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Interventions updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_interventions_updated_at') THEN
        CREATE TRIGGER update_interventions_updated_at 
        BEFORE UPDATE ON interventions 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Risk Predictions updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_risk_predictions_updated_at') THEN
        CREATE TRIGGER trigger_update_risk_predictions_updated_at
        BEFORE UPDATE ON risk_predictions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE risk_predictions IS 'ML-based dropout risk predictions for students';
COMMENT ON COLUMN risk_predictions.risk_score IS 'Composite risk score (0-1, higher = more risk)';
COMMENT ON COLUMN risk_predictions.risk_level IS 'Categorical risk level: low, medium, high, critical';
COMMENT ON COLUMN risk_predictions.confidence IS 'Prediction confidence based on data completeness';
COMMENT ON COLUMN risk_predictions.data_tier IS 'Data completeness tier (0=insufficient, 1=low, 2=medium, 3=high)';
COMMENT ON COLUMN risk_predictions.component_scores IS 'JSON: attendance_risk, academic_risk, behavior_risk';
COMMENT ON COLUMN risk_predictions.recommendations IS 'JSON: AI-generated recommendations and priority actions';
COMMENT ON COLUMN attendance.notes IS 'Optional notes about the attendance record';
COMMENT ON COLUMN attendance.updated_at IS 'Timestamp when the attendance was last updated';
COMMENT ON COLUMN attendance.updated_by IS 'User ID who last updated the attendance record';

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- All tables, indexes, and triggers have been created.
-- This schema is idempotent and can be run multiple times safely.
-- ============================================================================
