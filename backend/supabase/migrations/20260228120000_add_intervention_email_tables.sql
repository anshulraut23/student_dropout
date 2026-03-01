-- Add intervention email delivery support

-- Add new metadata columns to interventions
ALTER TABLE interventions
  ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20),
  ADD COLUMN IF NOT EXISTS trigger_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Expand intervention status values to include pending/sent/failed
DO $$
DECLARE
  status_constraint_name TEXT;
BEGIN
  SELECT con.conname
  INTO status_constraint_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
  WHERE rel.relname = 'interventions'
    AND con.contype = 'c'
    AND pg_get_constraintdef(con.oid) ILIKE '%status%';

  IF status_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE interventions DROP CONSTRAINT %I', status_constraint_name);
  END IF;
END $$;

ALTER TABLE interventions
  ADD CONSTRAINT interventions_status_check
  CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'pending', 'sent', 'failed'));

-- Message log table for all intervention notifications
CREATE TABLE IF NOT EXISTS intervention_messages (
  id TEXT PRIMARY KEY,
  intervention_id TEXT NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  sent_date TIMESTAMP,
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'sent', 'failed', 'read')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_intervention_messages_intervention_id ON intervention_messages(intervention_id);
CREATE INDEX IF NOT EXISTS idx_intervention_messages_delivery_status ON intervention_messages(delivery_status);
CREATE INDEX IF NOT EXISTS idx_intervention_messages_sent_date ON intervention_messages(sent_date);
