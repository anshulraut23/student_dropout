// SQLite Database Schema
// Mirrors Supabase schema for offline-first functionality

export const DATABASE_NAME = 'proactive_edu.db';
export const DATABASE_VERSION = 1;

export const SCHEMA = {
  // Users table
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'teacher')),
      school_id TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
  `,

  // Schools table
  schools: `
    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Classes table
  classes: `
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      school_id TEXT NOT NULL,
      grade INTEGER,
      section TEXT,
      attendance_mode TEXT DEFAULT 'daily' CHECK(attendance_mode IN ('daily', 'subject-wise')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
  `,

  // Subjects table
  subjects: `
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class_id TEXT NOT NULL,
      school_id TEXT NOT NULL,
      teacher_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (school_id) REFERENCES schools(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_subjects_class ON subjects(class_id);
    CREATE INDEX IF NOT EXISTS idx_subjects_teacher ON subjects(teacher_id);
  `,

  // Students table
  students: `
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      roll_number TEXT,
      class_id TEXT NOT NULL,
      school_id TEXT NOT NULL,
      date_of_birth TEXT,
      gender TEXT CHECK(gender IN ('male', 'female', 'other')),
      parent_name TEXT,
      parent_phone TEXT,
      parent_email TEXT,
      address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
    CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
  `,

  // Attendance table
  attendance: `
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      subject_id TEXT,
      teacher_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late', 'excused')),
      remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
    CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
  `,

  // Exams table
  exams: `
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      school_id TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      total_marks INTEGER NOT NULL,
      passing_marks INTEGER,
      status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id),
      FOREIGN KEY (school_id) REFERENCES schools(id)
    );
    CREATE INDEX IF NOT EXISTS idx_exams_class ON exams(class_id);
    CREATE INDEX IF NOT EXISTS idx_exams_subject ON exams(subject_id);
  `,

  // Marks table
  marks: `
    CREATE TABLE IF NOT EXISTS marks (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      exam_id TEXT NOT NULL,
      marks_obtained REAL NOT NULL,
      remarks TEXT,
      teacher_id TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (exam_id) REFERENCES exams(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(student_id);
    CREATE INDEX IF NOT EXISTS idx_marks_exam ON marks(exam_id);
  `,

  // Behavior table
  behavior: `
    CREATE TABLE IF NOT EXISTS behavior (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('positive', 'negative', 'neutral')),
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT CHECK(severity IN ('low', 'medium', 'high')),
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_behavior_student ON behavior(student_id);
    CREATE INDEX IF NOT EXISTS idx_behavior_date ON behavior(date);
  `,

  // Interventions table
  interventions: `
    CREATE TABLE IF NOT EXISTS interventions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      teacher_id TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      action_taken TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
      date TEXT NOT NULL,
      follow_up_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_interventions_student ON interventions(student_id);
    CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
  `,

  // Risk Predictions table (cached from ML service)
  risk_predictions: `
    CREATE TABLE IF NOT EXISTS risk_predictions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL UNIQUE,
      risk_level TEXT NOT NULL CHECK(risk_level IN ('low', 'medium', 'high')),
      risk_score REAL NOT NULL,
      factors TEXT,
      last_updated TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
    CREATE INDEX IF NOT EXISTS idx_risk_student ON risk_predictions(student_id);
    CREATE INDEX IF NOT EXISTS idx_risk_level ON risk_predictions(risk_level);
  `,

  // Leaderboard table (cached)
  leaderboard: `
    CREATE TABLE IF NOT EXISTS leaderboard (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      class_id TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      rank INTEGER,
      badges TEXT,
      achievements TEXT,
      last_updated TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (class_id) REFERENCES classes(id)
    );
    CREATE INDEX IF NOT EXISTS idx_leaderboard_class ON leaderboard(class_id);
    CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(rank);
  `,

  // Sync Queue table (tracks pending changes)
  sync_queue: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      entity TEXT NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('CREATE', 'UPDATE', 'DELETE')),
      payload TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      retry_count INTEGER DEFAULT 0,
      error TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      synced_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON sync_queue(entity);
  `,

  // Sync Metadata table (tracks last sync times)
  sync_metadata: `
    CREATE TABLE IF NOT EXISTS sync_metadata (
      entity TEXT PRIMARY KEY,
      last_sync TEXT NOT NULL,
      last_full_sync TEXT,
      sync_count INTEGER DEFAULT 0
    );
  `,
};

// Initial data seeds
export const SEEDS = {
  sync_metadata: `
    INSERT OR IGNORE INTO sync_metadata (entity, last_sync, last_full_sync, sync_count)
    VALUES
      ('students', datetime('now'), datetime('now'), 0),
      ('attendance', datetime('now'), datetime('now'), 0),
      ('marks', datetime('now'), datetime('now'), 0),
      ('behavior', datetime('now'), datetime('now'), 0),
      ('interventions', datetime('now'), datetime('now'), 0),
      ('risk_predictions', datetime('now'), datetime('now'), 0),
      ('leaderboard', datetime('now'), datetime('now'), 0);
  `,
};

export default { DATABASE_NAME, DATABASE_VERSION, SCHEMA, SEEDS };
