-- Add Behavior and Interventions tables
-- Run this migration to add behavior tracking and enhanced interventions

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

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
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(255),
    description TEXT NOT NULL,
    action_plan TEXT,
    expected_outcome TEXT,
    start_date DATE,
    target_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    outcome TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_behavior_student_id ON behavior(student_id);
CREATE INDEX IF NOT EXISTS idx_behavior_teacher_id ON behavior(teacher_id);
CREATE INDEX IF NOT EXISTS idx_behavior_date ON behavior(date);
CREATE INDEX IF NOT EXISTS idx_behavior_type ON behavior(behavior_type);
CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_initiated_by ON interventions(initiated_by);
CREATE INDEX IF NOT EXISTS idx_interventions_priority ON interventions(priority);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);

-- Add triggers for updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_behavior_updated_at') THEN
        CREATE TRIGGER update_behavior_updated_at 
        BEFORE UPDATE ON behavior 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_interventions_updated_at') THEN
        CREATE TRIGGER update_interventions_updated_at 
        BEFORE UPDATE ON interventions 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
