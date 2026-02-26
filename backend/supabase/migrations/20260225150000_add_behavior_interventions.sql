-- Add Behavior and Interventions Tables
-- Migration for behavior tracking and intervention management

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
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_plan TEXT,
    expected_outcome TEXT,
    start_date DATE NOT NULL,
    target_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    outcome TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_behaviors_student_id ON behaviors(student_id);
CREATE INDEX IF NOT EXISTS idx_behaviors_school_id ON behaviors(school_id);
CREATE INDEX IF NOT EXISTS idx_behaviors_date ON behaviors(date);
CREATE INDEX IF NOT EXISTS idx_behaviors_type ON behaviors(behavior_type);

CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_school_id ON interventions(school_id);
CREATE INDEX IF NOT EXISTS idx_interventions_initiated_by ON interventions(initiated_by);
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
