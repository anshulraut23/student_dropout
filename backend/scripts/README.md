# Backend Scripts

This folder contains utility scripts for database management, data loading, and migrations.

## Available Scripts

### Data Management

#### `load-demo-data.js`
Loads comprehensive demo data for testing and development.

```bash
node scripts/load-demo-data.js
```

Creates:
- Schools
- Admin and teacher users
- Classes and subjects
- Students
- Sample attendance records
- Sample exam data

#### `load-demo-data-simple.js`
Loads minimal demo data for quick testing.

```bash
node scripts/load-demo-data-simple.js
```

#### `clear-all-data.js`
Clears all data from the database (use with caution!).

```bash
node scripts/clear-all-data.js
```

#### `check-loaded-data.js`
Verifies what data is currently in the database.

```bash
node scripts/check-loaded-data.js
```

### Database Scripts

#### `check-data.sql`
SQL script to check database contents.

```bash
# Run in Supabase SQL Editor or psql
psql -f scripts/check-data.sql
```

#### `clear-supabase-data.sql`
SQL script to clear all data from Supabase.

```bash
# Run in Supabase SQL Editor
# WARNING: This will delete all data!
```

### Migration Scripts

#### `run-migration.js`
Runs database migrations.

```bash
node scripts/run-migration.js
```

#### `run-behavior-intervention-migration.js`
Runs the behavior and intervention tables migration.

```bash
node scripts/run-behavior-intervention-migration.js
```

## Usage Guidelines

### Development Workflow

1. **Initial Setup**
   ```bash
   node scripts/load-demo-data.js
   ```

2. **Check Data**
   ```bash
   node scripts/check-loaded-data.js
   ```

3. **Clear and Reload** (if needed)
   ```bash
   node scripts/clear-all-data.js
   node scripts/load-demo-data.js
   ```

### Testing Workflow

1. **Load Test Data**
   ```bash
   node scripts/load-demo-data-simple.js
   ```

2. **Run Tests**
   ```bash
   cd tests
   node test-attendance-postgres.js
   ```

3. **Clean Up**
   ```bash
   node scripts/clear-all-data.js
   ```

## Safety Notes

⚠️ **Warning**: Scripts that clear data are destructive!

- Always backup your database before running clear scripts
- Use `load-demo-data-simple.js` for testing
- Use `load-demo-data.js` for development
- Never run clear scripts on production databases

## Environment Requirements

All scripts require:
- Node.js installed
- `.env` file configured with database credentials
- Database connection available

## Troubleshooting

### "Cannot connect to database"
- Check your `.env` file
- Verify Supabase credentials
- Ensure database is running

### "Data already exists"
- Run `clear-all-data.js` first
- Or manually delete conflicting records

### "Migration failed"
- Check database schema
- Verify migration hasn't already been run
- Check console for specific errors

---

**Last Updated**: February 24, 2026
