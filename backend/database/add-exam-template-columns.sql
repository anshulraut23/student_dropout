-- Add missing columns to exam_templates table for marks and weightage

-- Add total_marks column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exam_templates' AND column_name = 'total_marks') THEN
        ALTER TABLE exam_templates ADD COLUMN total_marks INTEGER NOT NULL DEFAULT 100;
    END IF;
END $$;

-- Add passing_marks column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exam_templates' AND column_name = 'passing_marks') THEN
        ALTER TABLE exam_templates ADD COLUMN passing_marks INTEGER NOT NULL DEFAULT 40;
    END IF;
END $$;

-- Add weightage column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exam_templates' AND column_name = 'weightage') THEN
        ALTER TABLE exam_templates ADD COLUMN weightage DECIMAL(4, 3) NOT NULL DEFAULT 0.1;
    END IF;
END $$;

-- Add order_sequence column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exam_templates' AND column_name = 'order_sequence') THEN
        ALTER TABLE exam_templates ADD COLUMN order_sequence INTEGER NOT NULL DEFAULT 1;
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'exam_templates' AND column_name = 'updated_at') THEN
        ALTER TABLE exam_templates ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for exam_templates updated_at
DROP TRIGGER IF EXISTS update_exam_templates_updated_at ON exam_templates;
CREATE TRIGGER update_exam_templates_updated_at
    BEFORE UPDATE ON exam_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Output confirmation
DO $$
BEGIN
    RAISE NOTICE 'Exam template columns added successfully!';
END $$;
