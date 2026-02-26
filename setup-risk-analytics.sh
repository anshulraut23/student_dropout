#!/bin/bash
# Risk Analytics System - Automated Setup Script
# Sets up ML service, trains model, and verifies system health

echo "🚀 Risk Analytics System - Setup & Verification"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1${NC}"
  else
    echo -e "${RED}❌ $1${NC}"
  fi
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Verify Python
echo "Step 1: Checking Python environment..."
python --version
print_status "Python found"
echo ""

# Step 2: Install ML dependencies
echo "Step 2: Installing ML service dependencies..."
cd ml-service
pip install -q -r requirements.txt
print_status "ML dependencies installed"
echo ""

# Step 3: Train ML model
echo "Step 3: Training ML model..."
python generate_and_train.py | tail -20
if [ -f "models/dropout_model.pkl" ]; then
  print_status "ML model trained successfully"
else
  print_warning "ML model training may have issues"
fi
echo ""

# Step 4: Verify Gemini configuration
echo "Step 4: Checking Gemini API configuration..."
if grep -q "GEMINI_API_KEY=AIza" .env; then
  print_status "Gemini API key configured"
else
  print_warning "Gemini API key not found - explanations will use fallback mode"
fi
echo ""

# Step 5: Test ML service
echo "Step 5: Testing ML service in background (30 seconds)..."
python app.py > /tmp/ml-service.log 2>&1 &
ML_PID=$!
sleep 5

# Test health endpoint
if curl -s http://localhost:5001/health > /dev/null; then
  print_status "ML service healthy"
  
  # Test prediction
  print_info "Testing prediction endpoint..."
  curl -s -X POST http://localhost:5001/predict \
    -H "Content-Type: application/json" \
    -d '{
      "student_id": "test-123",
      "features": {
        "attendance_rate": 0.85,
        "avg_marks_percentage": 72.5,
        "behavior_score": 80,
        "data_tier": 2,
        "days_tracked": 45,
        "exams_completed": 4,
        "days_present": 38,
        "days_absent": 7,
        "total_incidents": 2,
        "positive_incidents": 1,
        "negative_incidents": 1
      },
      "metadata": {"student_name": "Test", "class_name": "10-A"}
    }' | python -m json.tool > /tmp/prediction.json 2>&1
  
  if grep -q "risk_score" /tmp/prediction.json; then
    print_status "Prediction endpoint working"
    print_info "Sample prediction: $(grep 'risk_level' /tmp/prediction.json)"
  else
    print_warning "Prediction endpoint returned unexpected response"
  fi
else
  print_warning "ML service health check failed"
fi

# Kill ML service
kill $ML_PID 2>/dev/null
wait $ML_PID 2>/dev/null
echo ""

# Step 6: Database schema check
echo "Step 6: Verifying database tables..."
print_info "Ensure following tables exist in Supabase:"
echo "  • risk_predictions"
echo "  • attendance"
echo "  • marks"
echo "  • behavior_observations"
echo ""

# Summary
echo "=================================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Email in terminal 1: python app.py (keep running)"
echo "2. Start backend in terminal 2: npm run dev"
echo "3. Start frontend in terminal 3: npm run dev"
echo "4. Visit: http://localhost:5173"
echo ""
echo "For more info, see: RISK_ANALYTICS_README.md"
