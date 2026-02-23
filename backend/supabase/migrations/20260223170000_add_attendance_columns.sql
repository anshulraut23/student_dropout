-- Add missing columns to attendance table
-- Migration to fix attendance schema

-- Add notes column
ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add updated_at column
ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add updated_by column (references users table)
ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS updated_by TEXT REFERENCES users(id);

-- Create index for updated_at for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_updated_at ON attendance(updated_at);

-- Add comment to document the columns
COMMENT ON COLUMN attendance.notes IS 'Optional notes about the attendance record';
COMMENT ON COLUMN attendance.updated_at IS 'Timestamp when the attendance was last updated';
COMMENT ON COLUMN attendance.updated_by IS 'User ID who last updated the attendance record';
