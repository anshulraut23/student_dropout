# Backend Tests

This folder contains automated test scripts for verifying system functionality.

## Available Tests

### Attendance System Tests

#### `test-attendance-postgres.js`
Comprehensive test suite for the attendance system (35+ tests).

```bash
node tests/test-attendance-postgres.js
```

**Tests Include:**
- Daily attendance marking
- Subject-wise attendance marking
- Updating existing attendance
- Multiple dates handling
- Attendance statistics
- Date-specific queries
- Edge cases and error handling

**Expected Output:**
```
Total Tests: 35
Passed: 35
Failed: 0
Pass Rate: 100.0%
```

#### `test-subject-wise-attendance.js`
Focused tests for subject-wise attendance functionality.

```bash
node tests/test-subject-wise-attendance.js
```

#### `test-attendance-endpoint.js`
API endpoint tests for attendance routes.

```bash
node tests/test-attendance-endpoint.js
```

### Exam System Tests

#### `test-exam-templates.js`
Tests for exam template creation and management.

```bash
node tests/test-exam-templates.js
```

**Tests Include:**
- Template creation
- Template validation
- Subject configuration
- Template activation/deactivation

### Behavior & Intervention Tests

#### `test-behavior-interventions.js`
Tests for behavior tracking and intervention systems.

```bash
node tests/test-behavior-interventions.js
```

**Tests Include:**
- Behavior record creation
- Intervention plan creation
- Status updates
- Filtering and queries

## Running All Tests

```bash
# Run all tests sequentially
node tests/test-attendance-postgres.js
node tests/test-exam-templates.js
node tests/test-behavior-interventions.js
```

## Test Data Setup

Before running tests, ensure you have test data loaded:

```bash
# Load demo data
node scripts/load-demo-data.js

# Or load minimal data
node scripts/load-demo-data-simple.js
```

## Test Results

### Interpreting Results

✅ **All Passed**: System is working correctly
```
Total Tests: 35
Passed: 35
Failed: 0
Pass Rate: 100.0%
```

❌ **Some Failed**: Issues detected
```
Total Tests: 35
Passed: 32
Failed: 3
Pass Rate: 91.4%

Failed Tests:
- Test 5: Update existing attendance
- Test 12: Subject-wise filtering
- Test 18: Date validation
```

### Common Failure Reasons

1. **Database Connection Issues**
   - Check `.env` configuration
   - Verify Supabase is accessible

2. **Missing Test Data**
   - Run `load-demo-data.js` first
   - Ensure required records exist

3. **Schema Mismatch**
   - Run pending migrations
   - Verify table structure

4. **Timing Issues**
   - Some tests may fail due to timing
   - Re-run to confirm

## Writing New Tests

### Test Structure

```javascript
// Test template
async function testFeatureName() {
  console.log('\n=== Test: Feature Name ===');
  
  try {
    // Setup
    const testData = { ... };
    
    // Execute
    const result = await someFunction(testData);
    
    // Verify
    if (result.success) {
      console.log('✅ Test passed');
      return true;
    } else {
      console.log('❌ Test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Test error:', error.message);
    return false;
  }
}
```

### Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after tests
3. **Assertions**: Verify all expected outcomes
4. **Error Handling**: Catch and report errors clearly
5. **Documentation**: Comment complex test logic

## Continuous Integration

### Pre-Commit Tests

Run these tests before committing:
```bash
node tests/test-attendance-postgres.js
```

### Pre-Deployment Tests

Run all tests before deploying:
```bash
# Run all test suites
for test in tests/test-*.js; do
  node "$test"
done
```

## Troubleshooting

### "Cannot find module"
```bash
# Install dependencies
cd backend
npm install
```

### "Database connection failed"
```bash
# Check environment
cat .env

# Verify Supabase connection
node -e "require('./storage/dataStore.js')"
```

### "Test data not found"
```bash
# Load test data
node scripts/load-demo-data.js
```

### "Tests timing out"
- Check network connection
- Verify database performance
- Increase timeout values if needed

## Test Coverage

### Current Coverage

- ✅ Attendance System: 100%
- ✅ Exam Templates: 90%
- ✅ Behavior & Interventions: 80%
- 🚧 Authentication: 60%
- 🚧 Student Management: 50%
- 🚧 Class Management: 50%

### Planned Tests

- [ ] Authentication flow tests
- [ ] Student CRUD tests
- [ ] Class management tests
- [ ] Subject management tests
- [ ] Marks entry tests
- [ ] Profile system tests
- [ ] Integration tests
- [ ] Performance tests

## Performance Benchmarks

### Expected Performance

- Attendance marking: < 100ms per student
- Bulk operations: < 500ms for 50 students
- Statistics calculation: < 200ms
- Report generation: < 1s for 100 students

### Monitoring

Run tests with timing:
```bash
time node tests/test-attendance-postgres.js
```

---

**Last Updated**: February 24, 2026
**Test Coverage**: 75%
