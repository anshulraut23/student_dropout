-- Add missing columns to exams table to match documentation

-- Add template_id column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS template_id TEXT REFERENCES exam_templates(id) ON DELETE SET NULL;

-- Add weightage column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS weightage DECIMAL(3,2);

-- Add duration column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Add instructions column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS instructions TEXT;

-- Add syllabus_topics column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS syllabus_topics JSONB;

-- Add is_auto_generated column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS is_auto_generated BOOLEAN DEFAULT false;

-- Add created_by column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS created_by TEXT REFERENCES users(id);

-- Add updated_at column
ALTER TABLE exams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exams_template ON exams(template_id);
