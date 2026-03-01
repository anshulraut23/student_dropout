-- Complete Supabase Schema for Education Assistant
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Faculty Chat Messages Table
CREATE TABLE IF NOT EXISTS faculty_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    text TEXT,
    attachment_name VARCHAR(255),
    attachment_type VARCHAR(100),
    attachment_data BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Behaviors Table
CREATE TABLE IF NOT EXISTS behaviors (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    recorded_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    behavior_type VARCHAR(50) NOT NULL CHECK (behavior_type IN ('positive', 'negative', 'neutral')),
    category VARCHAR(100),
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    action_taken TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interventions Table
CREATE TABLE IF NOT EXISTS interventions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    initiated_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    intervention_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20),
    trigger_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_plan TEXT,
    expected_outcome TEXT,
    start_date DATE NOT NULL,
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

-- Create indexes for better performance
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
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_exams_class_id ON exams(class_id);
CREATE INDEX IF NOT EXISTS idx_marks_exam_id ON marks(exam_id);
CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);CREATE INDEX IF NOT EXISTS idx_faculty_invites_sender_id ON faculty_invites(sender_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_recipient_id ON faculty_invites(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_school_id ON faculty_invites(school_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_status ON faculty_invites(status);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_sender_id ON faculty_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_recipient_id ON faculty_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_school_id ON faculty_messages(school_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_created_at ON faculty_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_behaviors_student_id ON behaviors(student_id);
CREATE INDEX IF NOT EXISTS idx_behaviors_school_id ON behaviors(school_id);
CREATE INDEX IF NOT EXISTS idx_behaviors_date ON behaviors(date);
CREATE INDEX IF NOT EXISTS idx_behaviors_type ON behaviors(behavior_type);

CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_school_id ON interventions(school_id);
CREATE INDEX IF NOT EXISTS idx_interventions_initiated_by ON interventions(initiated_by);
CREATE INDEX IF NOT EXISTS idx_intervention_messages_intervention_id ON intervention_messages(intervention_id);
CREATE INDEX IF NOT EXISTS idx_intervention_messages_delivery_status ON intervention_messages(delivery_status);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_interventions_start_date ON interventions(start_date);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for behaviors table
DROP TRIGGER IF EXISTS update_behaviors_updated_at ON behaviors;
CREATE TRIGGER update_behaviors_updated_at
    BEFORE UPDATE ON behaviors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for interventions table
DROP TRIGGER IF EXISTS update_interventions_updated_at ON interventions;
CREATE TRIGGER update_interventions_updated_at
    BEFORE UPDATE ON interventions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();