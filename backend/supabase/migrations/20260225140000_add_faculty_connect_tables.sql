-- Faculty Connect Tables for Teacher Communication

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

-- Faculty Messages Table
CREATE TABLE IF NOT EXISTS faculty_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    text TEXT,
    attachment_name TEXT,
    attachment_type TEXT,
    attachment_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faculty_invites
CREATE INDEX IF NOT EXISTS idx_faculty_invites_sender ON faculty_invites(sender_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_recipient ON faculty_invites(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_school ON faculty_invites(school_id);
CREATE INDEX IF NOT EXISTS idx_faculty_invites_status ON faculty_invites(status);

-- Indexes for faculty_messages
CREATE INDEX IF NOT EXISTS idx_faculty_messages_sender ON faculty_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_recipient ON faculty_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_school ON faculty_messages(school_id);
CREATE INDEX IF NOT EXISTS idx_faculty_messages_created ON faculty_messages(created_at);

-- Composite index for conversation queries
CREATE INDEX IF NOT EXISTS idx_faculty_messages_conversation ON faculty_messages(sender_id, recipient_id, created_at DESC);
