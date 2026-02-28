# Scalability Improvements Roadmap

## Current System Limitations

### What Works Well:
- ✅ PostgreSQL database (scales to millions of records)
- ✅ Stateless backend API (horizontal scaling ready)
- ✅ React frontend (CDN-ready, infinite scaling)

### Bottlenecks:
- ❌ Single ML model for all schools (not multi-tenant)
- ❌ Training runs on single server (blocks for 5-30 min)
- ❌ Cron scheduler not distributed (race conditions with multiple instances)
- ❌ Model stored as single file (no versioning/rollback)

## Scalability Roadmap

### Phase 1: Quick Wins (1-2 days)

#### 1.1 Per-School Models
**Problem:** One model for all schools doesn't account for different demographics
**Solution:** Train separate model per school

```python
# In generate_and_train.py
def train_per_school_models():
    schools = fetch_schools()
    for school in schools:
        train_model_for_school(school.id)
        save_model(f'models/school_{school.id}_model.pkl')
```

**Benefits:**
- Better accuracy per school
- Parallel training possible
- Isolated failures

#### 1.2 Distributed Locking for Cron
**Problem:** Multiple backend instances trigger same cron job
**Solution:** Use Redis for distributed locking

```javascript
// In modelRetrainingService.js
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async retrainModel() {
  const lock = await redis.set('retrain_lock', '1', 'EX', 3600, 'NX');
  if (!lock) {
    console.log('Another instance is retraining');
    return;
  }
  try {
    // Retrain model
  } finally {
    await redis.del('retrain_lock');
  }
}
```

**Benefits:**
- No duplicate training
- Safe for multiple instances
- Prevents race conditions

#### 1.3 Model Versioning
**Problem:** No rollback if new model performs worse
**Solution:** Version models with timestamps

```python
# Save with version
model_version = datetime.now().strftime('%Y%m%d_%H%M%S')
joblib.dump(model, f'models/dropout_model_{model_version}.pkl')

# Keep last 5 versions
cleanup_old_versions(keep=5)
```

**Benefits:**
- Rollback capability
- A/B testing possible
- Audit trail

### Phase 2: Medium Improvements (1 week)

#### 2.1 Background Job Queue
**Problem:** Training blocks the main thread
**Solution:** Use Bull/BullMQ for job queue

```javascript
import Queue from 'bull';
const retrainQueue = new Queue('model-retraining', process.env.REDIS_URL);

// Schedule job
retrainQueue.add('retrain', { schoolId }, {
  repeat: { cron: '0 2 * * *' }
});

// Process job
retrainQueue.process('retrain', async (job) => {
  await trainModel(job.data.schoolId);
});
```

**Benefits:**
- Non-blocking
- Retry on failure
- Progress tracking
- Distributed workers

#### 2.2 Model Caching
**Problem:** Loading model from disk on every prediction
**Solution:** Cache in memory with TTL

```python
from functools import lru_cache
import time

@lru_cache(maxsize=100)
def load_model_cached(school_id, version):
    return joblib.load(f'models/school_{school_id}_{version}.pkl')

# Invalidate cache after retraining
```

**Benefits:**
- 10-100x faster predictions
- Reduced disk I/O
- Better response times

#### 2.3 Database Query Optimization
**Problem:** Slow queries with large datasets
**Solution:** Add indexes and optimize queries

```sql
-- Add composite indexes
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_marks_student_exam ON marks(student_id, exam_id);
CREATE INDEX idx_behavior_student_date ON behavior(student_id, created_at);

-- Materialized view for features
CREATE MATERIALIZED VIEW student_features AS
SELECT 
  s.id,
  COUNT(DISTINCT a.id) as attendance_count,
  AVG(m.marks_obtained) as avg_marks
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
LEFT JOIN marks m ON s.id = m.student_id
GROUP BY s.id;

-- Refresh nightly
REFRESH MATERIALIZED VIEW student_features;
```

**Benefits:**
- 5-10x faster queries
- Reduced database load
- Better user experience

### Phase 3: Advanced Scaling (2-4 weeks)

#### 3.1 Microservices Architecture
**Current:** Monolithic backend + ML service
**Future:** Separate services

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   API       │────▶│   ML        │────▶│  Training   │
│  Gateway    │     │  Service    │     │  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Auth       │     │  Prediction │     │   Model     │
│  Service    │     │   Cache     │     │   Store     │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Benefits:**
- Independent scaling
- Technology flexibility
- Fault isolation
- Team autonomy

#### 3.2 Cloud ML Platform
**Problem:** Managing ML infrastructure manually
**Solution:** Use AWS SageMaker / Google AI Platform

```python
# Deploy to SageMaker
from sagemaker.sklearn import SKLearnModel

model = SKLearnModel(
    model_data='s3://bucket/model.tar.gz',
    role=role,
    entry_point='predict.py'
)

predictor = model.deploy(
    instance_type='ml.t2.medium',
    initial_instance_count=2
)

# Auto-scaling
predictor.update_endpoint(
    initial_instance_count=2,
    instance_type='ml.t2.medium',
    auto_scaling_enabled=True
)
```

**Benefits:**
- Auto-scaling
- Managed infrastructure
- Built-in monitoring
- A/B testing support

#### 3.3 Real-time Feature Store
**Problem:** Calculating features on-demand is slow
**Solution:** Pre-compute and cache features

```python
# Feature store (Redis/DynamoDB)
class FeatureStore:
    def get_student_features(self, student_id):
        # Check cache
        cached = redis.get(f'features:{student_id}')
        if cached:
            return json.loads(cached)
        
        # Calculate and cache
        features = calculate_features(student_id)
        redis.setex(f'features:{student_id}', 3600, json.dumps(features))
        return features
```

**Benefits:**
- Sub-millisecond predictions
- Reduced database load
- Real-time updates

#### 3.4 CDN for Model Distribution
**Problem:** Downloading models from server is slow
**Solution:** Distribute via CDN

```javascript
// Store models in S3/CloudFront
const modelUrl = `https://cdn.example.com/models/school_${schoolId}_latest.pkl`;

// Client-side prediction (TensorFlow.js)
const model = await tf.loadLayersModel(modelUrl);
const prediction = model.predict(features);
```

**Benefits:**
- Global distribution
- Faster downloads
- Reduced server load
- Edge computing ready

### Phase 4: Enterprise Scale (1-3 months)

#### 4.1 Multi-Region Deployment
```
Region 1 (US)          Region 2 (EU)          Region 3 (Asia)
┌──────────┐          ┌──────────┐          ┌──────────┐
│ Backend  │          │ Backend  │          │ Backend  │
│ ML Svc   │          │ ML Svc   │          │ ML Svc   │
│ Database │          │ Database │          │ Database │
└──────────┘          └──────────┘          └──────────┘
      │                     │                     │
      └─────────────────────┴─────────────────────┘
                    Global Load Balancer
```

#### 4.2 Kubernetes Orchestration
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-service
spec:
  replicas: 5
  template:
    spec:
      containers:
      - name: ml-service
        image: ml-service:latest
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ml-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### 4.3 Streaming Data Pipeline
```python
# Apache Kafka for real-time data
from kafka import KafkaProducer, KafkaConsumer

# Producer (when attendance marked)
producer.send('attendance-events', {
    'student_id': student_id,
    'status': 'present',
    'timestamp': datetime.now()
})

# Consumer (update features in real-time)
for message in consumer:
    update_student_features(message.value)
    trigger_prediction_if_needed(message.value['student_id'])
```

## Cost vs Scale Trade-offs

### Current Setup (Phase 0)
- **Cost:** $50-100/month
- **Capacity:** 1-50 schools, 5K-50K students
- **Latency:** 100-500ms predictions
- **Availability:** 95-99%

### Phase 1 Improvements
- **Cost:** $100-200/month (+Redis)
- **Capacity:** 50-200 schools, 50K-200K students
- **Latency:** 50-200ms predictions
- **Availability:** 99-99.5%

### Phase 2 Improvements
- **Cost:** $300-500/month (+Job queue, caching)
- **Capacity:** 200-1000 schools, 200K-1M students
- **Latency:** 10-50ms predictions
- **Availability:** 99.5-99.9%

### Phase 3 Improvements
- **Cost:** $1000-3000/month (+Cloud ML, microservices)
- **Capacity:** 1000-10K schools, 1M-10M students
- **Latency:** 5-20ms predictions
- **Availability:** 99.9-99.95%

### Phase 4 (Enterprise)
- **Cost:** $5000-20K/month (+Multi-region, K8s)
- **Capacity:** 10K+ schools, 10M+ students
- **Latency:** 1-10ms predictions
- **Availability:** 99.95-99.99%

## Immediate Action Items

### For Current Scale (1-50 schools):
1. ✅ Keep current architecture
2. ✅ Add model versioning (1 day)
3. ✅ Add database indexes (1 day)
4. ✅ Monitor performance metrics

### When Reaching 50+ schools:
1. Implement per-school models
2. Add Redis for distributed locking
3. Set up job queue for training
4. Add model caching

### When Reaching 200+ schools:
1. Move to microservices
2. Use cloud ML platform
3. Implement feature store
4. Add CDN for models

### When Reaching 1000+ schools:
1. Multi-region deployment
2. Kubernetes orchestration
3. Streaming data pipeline
4. Advanced monitoring/alerting

## Monitoring & Metrics

### Key Metrics to Track:
- **Training time** (should be <30 min)
- **Prediction latency** (should be <100ms)
- **Model accuracy** (should be >80%)
- **API response time** (should be <200ms)
- **Database query time** (should be <50ms)
- **Error rate** (should be <1%)

### When to Scale:
- Training time >30 minutes → Add workers
- Prediction latency >200ms → Add caching
- API response >500ms → Add instances
- Database queries >100ms → Add indexes
- Error rate >5% → Investigate bottlenecks

## Conclusion

**Current system is scalable for:**
- ✅ Small to medium deployments (1-50 schools)
- ✅ MVP and early growth phase
- ✅ Proof of concept

**Needs improvements for:**
- ⚠️ Large deployments (100+ schools)
- ⚠️ High concurrency (1000+ users)
- ⚠️ Real-time requirements (<10ms)
- ⚠️ Enterprise SLAs (99.9%+ uptime)

**Recommendation:** Start with Phase 1 improvements when you reach 20-30 schools or 10K+ students.

---

**Developed by Team GPPians**
**Date**: March 1, 2026
