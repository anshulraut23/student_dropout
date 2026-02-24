"""
Test script for ML Dropout Prediction Service
Run this to verify the ML service is working correctly
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_health():
    """Test health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        data = response.json()
        if data.get('model_loaded'):
            print("✓ ML model is loaded")
        else:
            print("✗ ML model not loaded - run generate_and_train.py first")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_prediction():
    """Test prediction endpoint with sample data"""
    print("\nTesting ML prediction endpoint...")
    
    # Sample student data with all required features
    payload = {
        "student_id": "test-student-123",
        "features": {
            "attendance_rate": 0.75,
            "avg_marks_percentage": 65.5,
            "behavior_score": 70,
            "data_tier": 2,
            "days_tracked": 45,
            "exams_completed": 4,
            "days_present": 34,
            "days_absent": 11,
            "total_incidents": 3,
            "positive_incidents": 1,
            "negative_incidents": 2
        },
        "metadata": {
            "student_name": "Test Student",
            "class_name": "10-A"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            print(f"\n✓ Risk Score: {data['prediction']['risk_score']}")
            print(f"✓ Risk Level: {data['prediction']['risk_level']}")
            print(f"✓ Model Type: {data['prediction']['model_type']}")
            print(f"✓ Top Features: {list(data['feature_importance'].keys())[:3]}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_insufficient_data():
    """Test prediction with insufficient data (should fail)"""
    print("\nTesting insufficient data handling...")
    
    payload = {
        "student_id": "test-student-456",
        "features": {
            "attendance_rate": 0.85,
            "avg_marks_percentage": 70,
            "behavior_score": 80,
            "data_tier": 0,  # Insufficient data
            "days_tracked": 5,
            "exams_completed": 0,
            "days_present": 4,
            "days_absent": 1,
            "total_incidents": 0,
            "positive_incidents": 0,
            "negative_incidents": 0
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 400:
            print("✓ Correctly rejected insufficient data")
        
        return response.status_code == 400  # Should return 400
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_batch_prediction():
    """Test batch prediction endpoint"""
    print("\nTesting batch prediction...")
    
    payload = {
        "students": [
            {
                "student_id": "student-1",
                "features": {
                    "attendance_rate": 0.90,
                    "avg_marks_percentage": 85,
                    "behavior_score": 95,
                    "data_tier": 3,
                    "days_tracked": 70,
                    "exams_completed": 6,
                    "days_present": 63,
                    "days_absent": 7,
                    "total_incidents": 1,
                    "positive_incidents": 1,
                    "negative_incidents": 0
                }
            },
            {
                "student_id": "student-2",
                "features": {
                    "attendance_rate": 0.60,
                    "avg_marks_percentage": 45,
                    "behavior_score": 50,
                    "data_tier": 2,
                    "days_tracked": 40,
                    "exams_completed": 3,
                    "days_present": 24,
                    "days_absent": 16,
                    "total_incidents": 8,
                    "positive_incidents": 2,
                    "negative_incidents": 6
                }
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/batch-predict",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200:
            predictions = data.get('predictions', [])
            print(f"\n✓ Generated {len(predictions)} predictions")
            for pred in predictions:
                if 'risk_level' in pred:
                    print(f"  - {pred['student_id']}: {pred['risk_level']} risk")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_feature_importance():
    """Test that feature importance is returned"""
    print("\nTesting feature importance...")
    
    payload = {
        "student_id": "test-importance",
        "features": {
            "attendance_rate": 0.80,
            "avg_marks_percentage": 70,
            "behavior_score": 75,
            "data_tier": 2,
            "days_tracked": 50,
            "exams_completed": 4,
            "days_present": 40,
            "days_absent": 10,
            "total_incidents": 2,
            "positive_incidents": 1,
            "negative_incidents": 1
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            importance = data.get('feature_importance', {})
            
            if importance:
                print("✓ Feature importance returned")
                sorted_features = sorted(
                    importance.items(), 
                    key=lambda x: x[1], 
                    reverse=True
                )[:5]
                print("\nTop 5 Features:")
                for feat, imp in sorted_features:
                    print(f"  - {feat}: {imp:.4f}")
                return True
            else:
                print("✗ No feature importance in response")
                return False
        else:
            print(f"✗ Request failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("ML Dropout Prediction Service - Test Suite")
    print("=" * 60)
    print()
    
    results = {
        "Health Check": test_health(),
        "ML Prediction": test_prediction(),
        "Insufficient Data": test_insufficient_data(),
        "Batch Prediction": test_batch_prediction(),
        "Feature Importance": test_feature_importance()
    }
    
    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    print("\n" + ("All tests passed!" if all_passed else "Some tests failed."))
    
    if not all_passed:
        print("\nNote: If 'ML model not loaded' error, run: python generate_and_train.py")

