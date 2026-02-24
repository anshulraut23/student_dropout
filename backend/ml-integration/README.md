# ML Integration Layer

Node.js orchestration layer for ML dropout prediction system.

## Architecture

```
Client Request
    ↓
riskController (Orchestration)
    ↓
featureExtractor (SQL Feature Engineering)
    ↓
mlClient (Python ML Service Communication)
    ↓
Database (Store Predictions)
```

## Components

### featureExtractor.js
- Extracts student features from PostgreSQL using raw SQL
- Enforces business rules (NULL vs ZERO handling)
- Calculates data tier (0-3)
- Supports batch extraction

### mlClient.js
- HTTP client for Python Flask ML service
- Handles health checks and predictions
- Error handling and fallbacks

### riskController.js
- Main orchestration logic
- Validates data tier before prediction
- Stores predictions in database
- Provides dashboard endpoints

### routes.js
- Express routes for ML endpoints
- Authentication middleware integration

## API Endpoints

All endpoints require authentication token.

### Get Student Risk
```
GET /api/ml/risk/:studentId
Authorization: Bearer <token>
```

### Get Class Risk
```
GET /api/ml/risk/class/:classId
Authorization: Bearer <token>
```

### Get Risk Dashboard
```
GET /api/ml/risk/dashboard
Authorization: Bearer <token>
```

## Database Schema

Required table (add via migration):

```sql
CREATE TABLE risk_predictions (
  prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(student_id),
  school_id UUID NOT NULL REFERENCES schools(school_id),
  risk_score DECIMAL(5,3) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  confidence VARCHAR(20) NOT NULL,
  data_tier INTEGER NOT NULL,
  component_scores JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, school_id)
);

CREATE INDEX idx_risk_predictions_school ON risk_predictions(school_id);
CREATE INDEX idx_risk_predictions_level ON risk_predictions(risk_level);
```

## Environment Variables

Add to `backend/.env`:

```
ML_SERVICE_URL=http://localhost:5001
```

## Integration with Main Server

Add to `backend/server.js`:

```javascript
const mlRoutes = require('./ml-integration/routes');
app.use('/api/ml', mlRoutes);
```
