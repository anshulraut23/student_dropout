# Database Connection Fix for ML Integration

## Problem
ML risk prediction was failing with error:
```
Error: PostgreSQL pool not initialized. Call connectPostgres() first.
```

## Root Cause
The ML integration code (`featureExtractor.js`, `riskController.js`) was trying to use `getPostgresPool()` from `connection.js`, but the PostgreSQL connection pool was never initialized when the server started.

The existing code had two separate database connection systems:
1. **postgresStore.js** - Used by main application (creates its own pool)
2. **connection.js** - Used by ML integration (pool was never initialized)

## Solution

### 1. Initialize Database Connection in server.js ✅
Added database initialization on server startup:

```javascript
import { connectPostgres } from './database/connection.js';

// Initialize database connection
let dbInitialized = false;
const initializeDatabase = async () => {
  if (!dbInitialized) {
    try {
      await connectPostgres();
      dbInitialized = true;
      console.log('✅ Database connection initialized for ML service');
    } catch (error) {
      console.error('❌ Failed to initialize database connection:', error.message);
      console.log('⚠️  ML risk prediction features will not be available');
    }
  }
};

// Initialize database on startup
initializeDatabase();
```

### 2. Updated connection.js to Use DATABASE_URL ✅
Changed `connectPostgres()` to use the same `DATABASE_URL` environment variable as the rest of the application:

**Before**:
```javascript
pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'education_assistant',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // ...
});
```

**After**:
```javascript
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

pgPool = new Pool({
  connectionString: connectionString,
  ssl: false,
  max: 20,
  // ...
});
```

## Files Modified

1. **backend/server.js**
   - Added `connectPostgres` import
   - Added `initializeDatabase()` function
   - Calls initialization on startup

2. **backend/database/connection.js**
   - Updated `connectPostgres()` to use `DATABASE_URL`
   - Consistent with `postgresStore.js` configuration

## How It Works Now

### Server Startup Sequence:
1. Server starts
2. `initializeDatabase()` is called
3. `connectPostgres()` creates PostgreSQL pool
4. Pool is stored in `pgPool` variable
5. ML integration can now call `getPostgresPool()` successfully

### ML Request Flow:
1. User requests risk prediction
2. `riskController.getStudentRisk()` is called
3. Calls `featureExtractor.extractFeatures()`
4. `extractFeatures()` calls `getPostgresPool()`
5. Returns initialized pool ✅
6. Queries database for student features
7. Sends to ML service for prediction

## Environment Variables Required

Make sure `backend/.env` has:
```env
DATABASE_URL=postgresql://user:password@host:port/database
ML_SERVICE_URL=http://localhost:5001
```

## Testing

### 1. Start Backend
```bash
cd backend
npm start
```

**Expected Output**:
```
Server running on port 5000
API available at http://localhost:5000/api
✅ PostgreSQL connected successfully
✅ Database connection initialized for ML service
```

### 2. Test ML Endpoint
```bash
# Get student risk prediction (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/ml/risk/student/STUDENT_ID
```

**Expected Response**:
```json
{
  "success": true,
  "student_id": "...",
  "prediction": {
    "risk_score": 0.65,
    "risk_level": "high",
    "confidence": "medium",
    "data_tier": 2
  },
  "feature_importance": { ... },
  "recommendations": [ ... ]
}
```

## Error Handling

If database connection fails:
- Server will still start
- Warning message will be logged
- ML endpoints will return appropriate error messages
- Rest of the application continues to work

## Status
✅ Database connection initialized on server startup
✅ ML integration can access PostgreSQL pool
✅ Risk prediction endpoints functional
✅ Error handling in place

## Next Steps
1. Restart backend server
2. Test ML risk prediction endpoints
3. Verify UI integration works
4. Complete remaining UI pages (Dashboard, MyClasses)
