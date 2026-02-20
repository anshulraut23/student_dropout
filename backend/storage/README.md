# Storage Directory

This directory contains the SQLite database file for persistent data storage.

## Database File

- **File**: `education_assistant.db`
- **Type**: SQLite3 database
- **Location**: `student_dropout/backend/storage/`

## Features

✅ **Persistent Storage**: All data persists across server restarts
✅ **No Setup Required**: Database is automatically created on first run
✅ **Local File**: Database stored in project directory
✅ **Easy Backup**: Simply copy the .db file

## Tables

The database contains the following tables:

1. **schools** - School information
2. **users** - Admin and teacher accounts
3. **teacher_requests** - Teacher approval requests
4. **classes** - Class information with incharge assignments
5. **subjects** - Subject information with teacher assignments

## Data Persistence

- Data is saved immediately on every operation
- No data loss on server restart
- Database file is excluded from git (see .gitignore)

## Backup

To backup your data:
```bash
cp storage/education_assistant.db storage/education_assistant_backup.db
```

## Reset Database

To start fresh (delete all data):
```bash
rm storage/education_assistant.db
```

The database will be recreated automatically on next server start.

## Migration from In-Memory

The system has been migrated from in-memory storage to SQLite.
All previous functionality remains the same, but now data persists!
