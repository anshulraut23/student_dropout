# Backend Implementation Plan

## Current Status: 70% Complete

### ✅ Completed Features (70%)

#### 1. Authentication & Authorization
- [x] User registration (Admin, Teacher)
- [x] Login with JWT tokens
- [x] Role-based access control
- [x] Password hashing (bcrypt)
- [x] Token validation middleware
- [x] Session management

#### 2. School Management
- [x] Create school
- [x] Get school details
- [x] Update school information
- [x] School-based data isolation

#### 3. User Management
- [x] Admin registration
- [x] Teacher registration
- [x] Teacher approval workflow
- [x] Get pending requests
- [x] Approve/reject teachers
- [x] User profile management

#### 4. Class Management
- [x] Create class
- [x] Update class
- [x] Delete class
- [x] Get classes by school
- [x] Assign class incharge
- [x] Set attendance mode (daily/subject-wise)

#### 5. Subject Management
- [x] Create subject
- [x] Update subject
- [x] Delete subject
- [x] Get subjects by class
- [x] Assign subject teacher
- [x] Subject-class mapping

#### 6. Student Management
- [x] Add student
- [x] Update student
- [x] Delete student
- [x] Get students by class
- [x] Bulk student import
- [x] Student enrollment

#### 7. Attendance System (Complete)
- [x] Mark single attendance
- [x] Mark bulk attendance
- [x] Update attendance
- [x] Delete attendance
- [x] Get class attendance
- [x] Get student attendance
- [x] Attendance statistics
- [x] Attendance reports
- [x] Daily attendance mode
- [x] Subject-wise attendance mode
- [x] Date validation
- [x] Duplicate detection
- [x] Authorization checks

#### 8. Data Storage
- [x] SQLite database
- [x] Persistent storage
- [x] CRUD operations for all entities
- [x] Data relationships
- [x] Query optimization

---

## ❌ Remaining Features (30%)

### 1. Performance/Exam Management (10%)

#### Database Schema
```sql
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,           -- 'unit_test', 'midterm', 'final', 'assignment'
  classId TEXT NOT NULL,
  subjectId TEXT,
  totalMarks INTEGER NOT NULL,
  passingMarks INTEGER NOT NULL,
  examDate TEXT NOT NULL,
  duration INTEGER,              -- in minutes
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE exam_results (
  id TEXT PRIMARY KEY,
  examId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  marksObtained REAL NOT NULL,
  grade TEXT,
  remarks TEXT,
  submittedAt TEXT,
  evaluatedBy TEXT,
  evaluatedAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

#### API Endpoints Needed

**Exam Management**
```
POST   /api/exams                    # Create exam
GET    /api/exams                    # Get all exams (with filters)
GET    /api/exams/:examId            # Get exam details
PUT    /api/exams/:examId            # Update exam
DELETE /api/exams/:examId            # Delete exam
GET    /api/exams/class/:classId     # Get exams for class
GET    /api/exams/upcoming           # Get upcoming exams
```

**Exam Results**
```
POST   /api/exams/:examId/results           # Add exam results
POST   /api/exams/:examId/results/bulk      # Bulk add results
GET    /api/exams/:examId/results           # Get all results for exam
GET    /api/exams/:examId/results/:studentId # Get student result
PUT    /api/exams/results/:resultId         # Update result
DELETE /api/exams/results/:resultId         # Delete result
GET    /api/students/:studentId/results     # Get all results for student
```

**Performance Analytics**
```
GET    /api/performance/student/:studentId  # Student performance summary
GET    /api/performance/class/:classId      # Class performance summary
GET    /api/performance/subject/:subjectId  # Subject-wise performance
GET    /api/performance/trends              # Performance trends
```

#### Implementation Priority: HIGH
**Estimated Time**: 2-3 days
**Dependencies**: None (all prerequisites complete)

---

### 2. Behavioral Records (8%)

#### Database Schema
```sql
CREATE TABLE behavior_records (
  id TEXT PRIMARY KEY,
  studentId TEXT NOT NULL,
  classId TEXT NOT NULL,
  recordedBy TEXT NOT NULL,      -- teacher userId
  date TEXT NOT NULL,
  type TEXT NOT NULL,             -- 'positive', 'negative', 'neutral'
  category TEXT NOT NULL,         -- 'discipline', 'participation', 'conduct', 'attitude'
  severity TEXT,                  -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  actionTaken TEXT,
  followUpRequired BOOLEAN DEFAULT 0,
  followUpDate TEXT,
  parentNotified BOOLEAN DEFAULT 0,
  notifiedAt TEXT,
  attachments TEXT,               -- JSON array of file paths
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE behavior_categories (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,             -- 'positive', 'negative'
  points INTEGER DEFAULT 0,       -- for point-based system
  description TEXT,
  active BOOLEAN DEFAULT 1,
  createdAt TEXT NOT NULL
);
```

#### API Endpoints Needed

**Behavior Records**
```
POST   /api/behavior                        # Create behavior record
GET    /api/behavior                        # Get all records (with filters)
GET    /api/behavior/:recordId              # Get record details
PUT    /api/behavior/:recordId              # Update record
DELETE /api/behavior/:recordId              # Delete record
GET    /api/behavior/student/:studentId     # Get student behavior history
GET    /api/behavior/class/:classId         # Get class behavior records
POST   /api/behavior/:recordId/notify       # Notify parents
```

**Behavior Categories**
```
POST   /api/behavior/categories             # Create category
GET    /api/behavior/categories             # Get all categories
PUT    /api/behavior/categories/:id         # Update category
DELETE /api/behavior/categories/:id         # Delete category
```

**Behavior Analytics**
```
GET    /api/behavior/summary/student/:studentId  # Student behavior summary
GET    /api/behavior/summary/class/:classId      # Class behavior summary
GET    /api/behavior/trends                      # Behavior trends
GET    /api/behavior/alerts                      # Students needing attention
```

#### Implementation Priority: HIGH
**Estimated Time**: 2 days
**Dependencies**: None

---

### 3. Intervention System (7%)

#### Database Schema
```sql
CREATE TABLE interventions (
  id TEXT PRIMARY KEY,
  studentId TEXT NOT NULL,
  classId TEXT NOT NULL,
  initiatedBy TEXT NOT NULL,     -- teacher/admin userId
  type TEXT NOT NULL,             -- 'academic', 'behavioral', 'attendance', 'social'
  priority TEXT NOT NULL,         -- 'low', 'medium', 'high', 'urgent'
  status TEXT NOT NULL,           -- 'planned', 'in_progress', 'completed', 'cancelled'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT,
  targetOutcome TEXT,
  actualOutcome TEXT,
  assignedTo TEXT,                -- teacher userId
  parentInvolved BOOLEAN DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE intervention_actions (
  id TEXT PRIMARY KEY,
  interventionId TEXT NOT NULL,
  actionDate TEXT NOT NULL,
  actionType TEXT NOT NULL,       -- 'meeting', 'counseling', 'tutoring', 'parent_contact'
  description TEXT NOT NULL,
  performedBy TEXT NOT NULL,
  outcome TEXT,
  nextSteps TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE intervention_notes (
  id TEXT PRIMARY KEY,
  interventionId TEXT NOT NULL,
  noteDate TEXT NOT NULL,
  note TEXT NOT NULL,
  addedBy TEXT NOT NULL,
  private BOOLEAN DEFAULT 0,
  createdAt TEXT NOT NULL
);
```

#### API Endpoints Needed

**Interventions**
```
POST   /api/interventions                   # Create intervention
GET    /api/interventions                   # Get all interventions
GET    /api/interventions/:id               # Get intervention details
PUT    /api/interventions/:id               # Update intervention
DELETE /api/interventions/:id               # Delete intervention
GET    /api/interventions/student/:studentId # Get student interventions
GET    /api/interventions/active            # Get active interventions
POST   /api/interventions/:id/complete      # Mark as completed
```

**Intervention Actions**
```
POST   /api/interventions/:id/actions       # Add action
GET    /api/interventions/:id/actions       # Get all actions
PUT    /api/interventions/actions/:actionId # Update action
DELETE /api/interventions/actions/:actionId # Delete action
```

**Intervention Notes**
```
POST   /api/interventions/:id/notes         # Add note
GET    /api/interventions/:id/notes         # Get all notes
PUT    /api/interventions/notes/:noteId     # Update note
DELETE /api/interventions/notes/:noteId     # Delete note
```

**Intervention Analytics**
```
GET    /api/interventions/summary           # Overall summary
GET    /api/interventions/effectiveness     # Effectiveness metrics
GET    /api/interventions/recommendations   # AI recommendations
```

#### Implementation Priority: MEDIUM
**Estimated Time**: 3 days
**Dependencies**: Performance and Behavior systems

---

### 4. Alert & Notification System (5%)

#### Database Schema
```sql
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  classId TEXT NOT NULL,
  type TEXT NOT NULL,             -- 'attendance', 'performance', 'behavior', 'intervention'
  severity TEXT NOT NULL,         -- 'info', 'warning', 'critical'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  triggerData TEXT,               -- JSON with trigger details
  status TEXT NOT NULL,           -- 'active', 'acknowledged', 'resolved', 'dismissed'
  acknowledgedBy TEXT,
  acknowledgedAt TEXT,
  resolvedBy TEXT,
  resolvedAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE alert_rules (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,        -- JSON with rule conditions
  severity TEXT NOT NULL,
  enabled BOOLEAN DEFAULT 1,
  notifyTeachers BOOLEAN DEFAULT 1,
  notifyParents BOOLEAN DEFAULT 0,
  notifyAdmin BOOLEAN DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  alertId TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT 0,
  readAt TEXT,
  actionUrl TEXT,
  createdAt TEXT NOT NULL
);
```

#### API Endpoints Needed

**Alerts**
```
GET    /api/alerts                          # Get all alerts
GET    /api/alerts/:id                      # Get alert details
POST   /api/alerts/:id/acknowledge          # Acknowledge alert
POST   /api/alerts/:id/resolve              # Resolve alert
POST   /api/alerts/:id/dismiss              # Dismiss alert
GET    /api/alerts/student/:studentId       # Get student alerts
GET    /api/alerts/active                   # Get active alerts
```

**Alert Rules**
```
POST   /api/alerts/rules                    # Create rule
GET    /api/alerts/rules                    # Get all rules
GET    /api/alerts/rules/:id                # Get rule details
PUT    /api/alerts/rules/:id                # Update rule
DELETE /api/alerts/rules/:id                # Delete rule
POST   /api/alerts/rules/:id/toggle         # Enable/disable rule
```

**Notifications**
```
GET    /api/notifications                   # Get user notifications
GET    /api/notifications/unread            # Get unread count
POST   /api/notifications/:id/read          # Mark as read
POST   /api/notifications/read-all          # Mark all as read
DELETE /api/notifications/:id               # Delete notification
```

**Alert Generation (Background)**
```
POST   /api/alerts/generate                 # Manually trigger alert generation
GET    /api/alerts/preview                  # Preview alerts for rules
```

#### Implementation Priority: MEDIUM
**Estimated Time**: 2-3 days
**Dependencies**: All other systems (generates alerts based on data)

---

## Implementation Timeline

### Phase 1: Core Academic Features (Week 1-2)
**Priority: HIGH**

1. **Performance/Exam Management** (3 days)
   - Day 1: Database schema, basic CRUD
   - Day 2: Exam results, bulk operations
   - Day 3: Performance analytics, testing

2. **Behavioral Records** (2 days)
   - Day 1: Database schema, CRUD operations
   - Day 2: Categories, analytics, testing

### Phase 2: Intervention & Alerts (Week 3)
**Priority: MEDIUM**

3. **Intervention System** (3 days)
   - Day 1: Database schema, basic CRUD
   - Day 2: Actions and notes
   - Day 3: Analytics, recommendations, testing

4. **Alert & Notification System** (3 days)
   - Day 1: Database schema, alert CRUD
   - Day 2: Alert rules, notification system
   - Day 3: Background jobs, testing

### Phase 3: Integration & Testing (Week 4)
**Priority: HIGH**

5. **System Integration** (2 days)
   - Integrate all systems
   - Cross-feature workflows
   - End-to-end testing

6. **Performance Optimization** (2 days)
   - Query optimization
   - Caching implementation
   - Load testing

7. **Documentation & Deployment** (2 days)
   - API documentation
   - Deployment guides
   - Production setup

---

## Technical Specifications

### Common Patterns

#### Authorization Middleware
```javascript
// Check if user has access to student data
const checkStudentAccess = async (req, res, next) => {
  const { studentId } = req.params;
  const { userId, role, schoolId } = req.user;
  
  const student = dataStore.getStudentById(studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  const classData = dataStore.getClassById(student.classId);
  if (classData.schoolId !== schoolId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};
```

#### Validation Pattern
```javascript
// Validate exam data
const validateExamData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Exam name is required');
  }
  
  if (!data.totalMarks || data.totalMarks <= 0) {
    errors.push('Total marks must be greater than 0');
  }
  
  if (data.passingMarks > data.totalMarks) {
    errors.push('Passing marks cannot exceed total marks');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

#### Statistics Calculation Pattern
```javascript
// Calculate performance statistics
const calculatePerformanceStats = (results) => {
  const stats = {
    totalStudents: results.length,
    averageMarks: 0,
    highestMarks: 0,
    lowestMarks: 0,
    passCount: 0,
    failCount: 0,
    passPercentage: 0
  };
  
  if (results.length === 0) return stats;
  
  const marks = results.map(r => r.marksObtained);
  stats.averageMarks = marks.reduce((a, b) => a + b, 0) / marks.length;
  stats.highestMarks = Math.max(...marks);
  stats.lowestMarks = Math.min(...marks);
  stats.passCount = results.filter(r => r.marksObtained >= r.passingMarks).length;
  stats.failCount = results.length - stats.passCount;
  stats.passPercentage = (stats.passCount / results.length) * 100;
  
  return stats;
};
```

---

## Testing Strategy

### Unit Tests
- Test each API endpoint independently
- Test validation functions
- Test calculation functions
- Test authorization logic

### Integration Tests
- Test cross-feature workflows
- Test data relationships
- Test cascade operations
- Test transaction handling

### Performance Tests
- Load testing with 1000+ students
- Concurrent request handling
- Query performance benchmarks
- Memory usage monitoring

### Test Scripts Pattern
```javascript
// Example test for exam creation
async function testExamCreation() {
  const examData = {
    name: 'Midterm Exam',
    type: 'midterm',
    classId: 'class-123',
    subjectId: 'subject-456',
    totalMarks: 100,
    passingMarks: 40,
    examDate: '2026-03-15',
    duration: 120
  };
  
  const result = await examService.createExam(examData, teacherId);
  
  assert(result.id, 'Exam created with ID');
  assert(result.name === examData.name, 'Exam name matches');
  assert(result.totalMarks === examData.totalMarks, 'Total marks match');
}
```

---

## Database Migrations

### Migration Strategy
1. Create new tables without affecting existing data
2. Add indexes for performance
3. Create foreign key relationships
4. Populate with default data if needed
5. Test thoroughly before production

### Example Migration Script
```javascript
// migrations/004_add_exams.js
export const up = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      schoolId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      classId TEXT NOT NULL,
      subjectId TEXT,
      totalMarks INTEGER NOT NULL,
      passingMarks INTEGER NOT NULL,
      examDate TEXT NOT NULL,
      duration INTEGER,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    
    CREATE INDEX idx_exams_school ON exams(schoolId);
    CREATE INDEX idx_exams_class ON exams(classId);
    CREATE INDEX idx_exams_date ON exams(examDate);
  `);
};

export const down = (db) => {
  db.exec('DROP TABLE IF EXISTS exams');
};
```

---

## API Documentation Template

### Endpoint Documentation Format
```markdown
#### Create Exam

**Endpoint**: `POST /api/exams`

**Authentication**: Required (Teacher/Admin)

**Request Body**:
```json
{
  "name": "Midterm Exam",
  "type": "midterm",
  "classId": "class-123",
  "subjectId": "subject-456",
  "totalMarks": 100,
  "passingMarks": 40,
  "examDate": "2026-03-15",
  "duration": 120,
  "description": "Mathematics midterm exam"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Exam created successfully",
  "exam": {
    "id": "exam-789",
    "name": "Midterm Exam",
    ...
  }
}
```

**Error Responses**:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Class/Subject not found
```

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All exam management endpoints working
- ✅ Exam results can be added and retrieved
- ✅ Performance analytics calculated correctly
- ✅ Behavioral records can be created and managed
- ✅ Behavior analytics working
- ✅ All tests passing (100%)

### Phase 2 Complete When:
- ✅ Intervention system fully functional
- ✅ Intervention actions and notes working
- ✅ Alert system generating alerts correctly
- ✅ Notification system delivering notifications
- ✅ Alert rules can be configured
- ✅ All tests passing (100%)

### Phase 3 Complete When:
- ✅ All systems integrated
- ✅ Cross-feature workflows tested
- ✅ Performance benchmarks met
- ✅ Documentation complete
- ✅ Production deployment successful
- ✅ All tests passing (100%)

---

## Risk Assessment

### High Risk Items
1. **Performance with large datasets**: Mitigate with indexing and caching
2. **Alert generation load**: Implement background jobs
3. **Data consistency**: Use transactions where needed
4. **Authorization complexity**: Thorough testing of access control

### Medium Risk Items
1. **Complex analytics queries**: Optimize with materialized views
2. **Notification delivery**: Implement retry mechanism
3. **File uploads**: Implement size limits and validation

### Low Risk Items
1. **CRUD operations**: Well-established patterns
2. **Validation**: Reuse existing validators
3. **Testing**: Automated test suite in place

---

## Next Steps

1. **Review and approve this plan**
2. **Set up development environment for new features**
3. **Create feature branches**
4. **Begin Phase 1 implementation**
5. **Daily progress reviews**
6. **Weekly integration testing**

---

**Document Version**: 1.0
**Last Updated**: February 21, 2026
**Status**: Ready for Implementation
