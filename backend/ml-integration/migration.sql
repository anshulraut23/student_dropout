-- Migration: Add risk_predictions table for ML dropout prediction system
-- Run this migration to enable ML risk tracking

-- Create risk_predictions table
CREATE TABLE IF NOT EXISTS risk_predictions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Risk scores
  risk_score DECIMAL(5,3) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  confidence VARCHAR(20) NOT NULL CHECK (confidence IN ('insufficient', 'low', 'medium', 'high')),
  data_tier INTEGER NOT NULL CHECK (data_tier >= 0 AND data_tier <= 3),
  
  -- Detailed scores (stored as JSONB)
  component_scores JSONB,
  recommendations JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one prediction per student per school
  UNIQUE(student_id, school_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_predictions_school 
  ON risk_predictions(school_id);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_level 
  ON risk_predictions(risk_level);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_student 
  ON risk_predictions(student_id);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_created 
  ON risk_predictions(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_risk_predictions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_risk_predictions_updated_at
  BEFORE UPDATE ON risk_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_risk_predictions_updated_at();

-- Add comments
COMMENT ON TABLE risk_predictions IS 'ML-based dropout risk predictions for students';
COMMENT ON COLUMN risk_predictions.risk_score IS 'Composite risk score (0-1, higher = more risk)';
COMMENT ON COLUMN risk_predictions.risk_level IS 'Categorical risk level: low, medium, high, critical';
COMMENT ON COLUMN risk_predictions.confidence IS 'Prediction confidence based on data completeness';
COMMENT ON COLUMN risk_predictions.data_tier IS 'Data completeness tier (0=insufficient, 1=low, 2=medium, 3=high)';
COMMENT ON COLUMN risk_predictions.component_scores IS 'JSON: attendance_risk, academic_risk, behavior_risk';
COMMENT ON COLUMN risk_predictions.recommendations IS 'JSON: AI-generated recommendations and priority actions';
