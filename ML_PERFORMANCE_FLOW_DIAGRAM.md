# ML Performance Tracking - Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ML PERFORMANCE TRACKING SYSTEM                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        AUTOMATED FLOW (2 AM)                         │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ Windows Task         │
    │ Scheduler            │
    │ (2:00 AM Daily)      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ schedule_retrain.bat │
    │ (Wrapper Script)     │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ auto_retrain.py      │
    │ (Orchestrator)       │
    └──────────┬───────────┘
               │
               ├─────────────────────────────────┐
               │                                 │
               ▼                                 ▼
    ┌──────────────────────┐         ┌──────────────────────┐
    │ generate_and_train.py│         │ Logs to:             │
    │                      │         │ ml-service/logs/     │
    │ 1. Load student data │         │ retrain_YYYYMMDD.log │
    │ 2. Train RF model    │         └──────────────────────┘
    │ 3. Calculate metrics │
    │ 4. Save to JSON      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ models/model_metadata.json   │
    │                              │
    │ {                            │
    │   "model_version": "v...",   │
    │   "accuracy": 0.69,          │
    │   "precision": 0.5967,       │
    │   "recall": 0.5,             │
    │   "f1_score": 0.5441,        │
    │   "confusion_matrix": {...}, │
    │   "feature_importance": [...] │
    │ }                            │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ save_performance_    │
    │ to_db.py             │
    │                      │
    │ 1. Read JSON         │
    │ 2. Format payload    │
    │ 3. Send to API       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Backend API                  │
    │ POST /api/dropout/           │
    │      model-performance       │
    │                              │
    │ Headers:                     │
    │   Authorization: Bearer ...  │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ PostgreSQL Database          │
    │                              │
    │ INSERT INTO                  │
    │   model_performance          │
    │ VALUES (...)                 │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Admin Dashboard              │
    │ /admin/model-performance     │
    │                              │
    │ GET /api/dropout/            │
    │     model-performance        │
    │                              │
    │ Displays:                    │
    │ - Latest metrics             │
    │ - Confusion matrix           │
    │ - Performance trends         │
    └──────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                          MANUAL FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ Admin runs:          │
    │ sync_performance_    │
    │ to_db.bat            │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ save_performance_    │
    │ to_db.py             │
    │                      │
    │ Reads existing       │
    │ model_metadata.json  │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Backend API          │
    │ (same as above)      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Database             │
    │ (same as above)      │
    └──────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────┘

Student Data (DB)
    │
    ├─> Attendance Records
    ├─> Exam Results
    ├─> Behavior Incidents
    └─> Dropout Outcomes
         │
         ▼
    ML Training Process
         │
         ├─> Feature Extraction
         ├─> Model Training (Random Forest)
         └─> Performance Evaluation
              │
              ▼
         Performance Metrics
              │
              ├─> Accuracy
              ├─> Precision
              ├─> Recall
              ├─> F1-Score
              ├─> Confusion Matrix
              └─> Feature Importance
                   │
                   ▼
              Database Storage
                   │
                   ▼
              Admin Dashboard
                   │
                   └─> Visualizations & Insights


┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐
│   ML Service    │         │   Backend API   │
│   (Python)      │◄───────►│   (Node.js)     │
│                 │  HTTP   │                 │
│ - Training      │  POST   │ - Auth          │
│ - Metrics       │         │ - Validation    │
│ - Sync Script   │         │ - DB Insert     │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │ SQL
                                     ▼
                            ┌─────────────────┐
                            │   PostgreSQL    │
                            │   Database      │
                            │                 │
                            │ - model_        │
                            │   performance   │
                            └────────┬────────┘
                                     │
                                     │ Query
                                     ▼
                            ┌─────────────────┐
                            │   Frontend      │
                            │   (React)       │
                            │                 │
                            │ - Dashboard     │
                            │ - Charts        │
                            │ - Metrics       │
                            └─────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      TIMELINE VIEW                                   │
└─────────────────────────────────────────────────────────────────────┘

Day 1 - 2:00 AM
    │
    ├─> Model trains with 1000 samples
    ├─> Accuracy: 69%
    └─> Saved to database
         │
         └─> Admin sees: 1 entry in history

Day 2 - 2:00 AM
    │
    ├─> Model retrains with 1050 samples (new data)
    ├─> Accuracy: 71%
    └─> Saved to database
         │
         └─> Admin sees: 2 entries, trend line appears

Day 3 - 2:00 AM
    │
    ├─> Model retrains with 1100 samples
    ├─> Accuracy: 73%
    └─> Saved to database
         │
         └─> Admin sees: 3 entries, clear upward trend

...and so on, building historical performance data


┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

1. Admin Login
   │
   ├─> POST /api/auth/login
   │   { email, password }
   │
   └─> Response: { token: "eyJ..." }
        │
        └─> Stored in browser localStorage

2. ML Service Configuration
   │
   ├─> Admin copies token from browser
   │
   └─> Adds to ml-service/.env
        ADMIN_AUTH_TOKEN=eyJ...

3. API Request
   │
   ├─> POST /api/dropout/model-performance
   │   Headers: { Authorization: "Bearer eyJ..." }
   │   Body: { modelVersion, accuracy, ... }
   │
   └─> Backend validates token
        │
        ├─> Valid: Save to database
        └─> Invalid: Return 401 Unauthorized


┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

save_performance_to_db.py
    │
    ├─> Try: Read model_metadata.json
    │   ├─> Success: Continue
    │   └─> Fail: Log error, exit
    │
    ├─> Try: Send to backend API
    │   ├─> Success (200): Log success
    │   ├─> Auth Error (401): Log "Invalid token"
    │   ├─> Server Error (500): Log "Backend error"
    │   └─> Network Error: Log "Connection failed"
    │
    └─> Return: Success/Failure status
         │
         └─> Logged to console and log file
```

## Key Points

### Automatic Operation
- Runs every night at 2 AM
- No manual intervention needed
- Logs all operations
- Handles errors gracefully

### Data Flow
- Student data → ML training → Metrics → Database → Dashboard
- One-way flow, no circular dependencies
- Each step is logged and traceable

### Security
- Requires admin authentication token
- Token validated by backend
- Only admins can save/view performance data

### Reliability
- Retries on transient failures
- Comprehensive error logging
- Manual sync available as backup
- Database transactions ensure consistency

### Scalability
- Handles growing dataset sizes
- Efficient database queries
- Indexed for fast retrieval
- Pagination ready for large histories
