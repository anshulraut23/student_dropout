-- Add super_admin role support and school activation flag
-- No new relationships added

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check CHECK (role IN ('super_admin', 'admin', 'teacher'));

-- Make school_id nullable for super_admin (who don't belong to any specific school)
ALTER TABLE users
ALTER COLUMN school_id DROP NOT NULL;

ALTER TABLE schools
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
