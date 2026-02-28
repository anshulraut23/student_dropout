-- ============================================================================
-- Migration: Add Dropout Tracking Fields
-- Purpose: Enable tracking of student outcomes for ML model training
-- Date: 2024-11-20
-- ============================================================================

-- Add dropout tracking columns to students table
DO $$ 
BEGIN
    -- Add dropout_status column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'dropout_status'
    ) THEN
        ALTER TABLE students 
        ADD COLUMN dropout_status VARCHAR(20) DEFAULT 'active' 
        CHECK (dropout_status IN ('active', 'dropped_out', 'graduated', 'transferred'));
        
        RAISE NOTICE 'Added dropout_status column to students table';
    END IF;

    -- Add dropout_date column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'dropout_date'
    ) THEN
        ALTER TABLE students 
        ADD COLUMN dropout_date DATE;
        
        RAISE NOTICE 'Added dropout_date column to students table';
    END IF;

    -- Add dropout_reason column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'dropout_reason'
    ) THEN
        ALTER TABLE students 
        ADD COLUMN dropout_reason VARCHAR(100);
        
        RAISE NOTICE 'Added dropout_reason column to students table';
    END IF;

    -- Add dropout_notes column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'dropout_notes'
    ) THEN
        ALTER TABLE students 
        ADD COLUMN dropout_notes TEXT;
        
        RAISE NOTICE 'Added dropout_notes column to students table';
    END IF;

    -- Add last_attendance_date column (helpful for tracking)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'last_attendance_date'
    ) THEN
        ALTER TABLE students 
        ADD COLUMN last_attendance_date DATE;
        
        RAISE NOTICE 'Added last_attendance_date column to students table';
    END IF;
END $$;

-- Create index for faster queries on dropout_status
CREATE INDEX IF NOT EXISTS idx_students_dropout_status ON students(dropout_status);
CREATE INDEX IF NOT EXISTS idx_students_dropout_date ON students(dropout_date);

-- Update existing students to have 'active' status if NULL
UPDATE students 
SET dropout_status = 'active' 
WHERE dropout_status IS NULL;

-- ============================================================================
-- Create Dropout Tracking History Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS dropout_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    previous_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    dropout_date DATE,
    dropout_reason VARCHAR(100),
    dropout_notes TEXT,
    changed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dropout_history_student ON dropout_history(student_id);
CREATE INDEX IF NOT EXISTS idx_dropout_history_date ON dropout_history(changed_at);

-- ============================================================================
-- Create Model Performance Tracking Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS model_performance (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    training_date TIMESTAMP NOT NULL,
    training_samples INTEGER NOT NULL,
    test_samples INTEGER NOT NULL,
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    confusion_matrix JSONB,
    feature_importance JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_model_performance_school ON model_performance(school_id);
CREATE INDEX IF NOT EXISTS idx_model_performance_date ON model_performance(training_date DESC);

COMMENT ON TABLE model_performance IS 'Tracks ML model performance metrics over time';
COMMENT ON COLUMN model_performance.confusion_matrix IS 'JSON: {tp, fp, tn, fn}';
COMMENT ON COLUMN model_performance.feature_importance IS 'JSON: {feature_name: importance_score}';

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ Dropout tracking migration completed successfully!';
    RAISE NOTICE 'Added columns: dropout_status, dropout_date, dropout_reason, dropout_notes, last_attendance_date';
    RAISE NOTICE 'Created tables: dropout_history, model_performance';
END $$;
