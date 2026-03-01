from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models.ml_predictor import MLPredictor
from models.gemini_explainer import GeminiExplainer
import logging
import os

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize ML predictor
ml_predictor = None
try:
    model_path = 'models/dropout_model.pkl'
    if os.path.exists(model_path):
        ml_predictor = MLPredictor(model_path)
        logger.info("ML model loaded successfully")
    else:
        logger.error(f"Model file not found: {model_path}")
        logger.error("Please run 'python generate_and_train.py' first to train the model")
except Exception as e:
    logger.error(f"Failed to load ML model: {e}")

# Initialize Gemini explainer
gemini_explainer = None
if Config.GEMINI_API_KEY:
    try:
        gemini_explainer = GeminiExplainer(Config.GEMINI_API_KEY)
        logger.info("Gemini AI initialized successfully")
    except Exception as e:
        logger.warning(f"Gemini AI initialization failed: {e}")
else:
    logger.warning("GEMINI_API_KEY not set - using fallback explanations")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy' if ml_predictor is not None else 'degraded',
        'service': 'ml-dropout-prediction',
        'model_loaded': ml_predictor is not None,
        'gemini_available': gemini_explainer is not None,
        'model_type': 'RandomForestClassifier' if ml_predictor else None
    })

@app.route('/predict', methods=['POST'])
def predict_risk():
    """
    Main prediction endpoint using trained ML model.
    
    Expected payload:
    {
        "student_id": "uuid",
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
        "metadata": {
            "student_name": "John Doe",
            "class_name": "10-A"
        }
    }
    """
    try:
        # Check if model is loaded
        if ml_predictor is None:
            return jsonify({
                'error': 'ML model not loaded',
                'message': 'Please run generate_and_train.py to train the model first'
            }), 503
        
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({
                'error': 'Missing required field: features'
            }), 400
        
        features = data['features']
        student_id = data.get('student_id')
        metadata = data.get('metadata', {})
        
        # Validate data tier
        data_tier = features.get('data_tier', 0)
        if data_tier == 0:
            return jsonify({
                'error': 'Insufficient data for prediction',
                'message': 'Student needs at least 3 days of attendance and 1 completed exam',
                'data_tier': 0,
                'confidence': 'insufficient'
            }), 400
        
        # Get ML prediction
        prediction_result = ml_predictor.predict(features)
        
        # Map confidence based on data tier
        confidence_map = {1: 'low', 2: 'medium', 3: 'high'}
        confidence = confidence_map.get(data_tier, 'low')
        
        # Generate explanation with feature importance
        explanation_result = None
        if gemini_explainer:
            explanation_result = gemini_explainer.generate_explanation(
                {
                    'student_id': student_id, 
                    'features': features, 
                    'metadata': metadata,
                    'feature_importance': prediction_result['feature_importance']
                },
                {
                    'risk_score': prediction_result['risk_score'],
                    'risk_level': prediction_result['risk_level'],
                    'confidence': confidence
                }
            )
        else:
            explanation_result = _generate_fallback_explanation(
                features, 
                prediction_result,
                prediction_result['feature_importance']
            )
        
        # Build response
        response = {
            'student_id': student_id,
            'prediction': {
                'risk_score': prediction_result['risk_score'],
                'risk_level': prediction_result['risk_level'],
                'confidence': confidence,
                'data_tier': data_tier,
                'model_type': 'RandomForest'
            },
            'feature_importance': prediction_result['feature_importance'],
            'explanation': explanation_result.get('explanation', ''),
            'recommendations': explanation_result.get('recommendations', []),
            'priority_actions': explanation_result.get('priority_actions', []),
            'metadata': metadata
        }
        
        logger.info(f"ML prediction for student {student_id}: {prediction_result['risk_level']} risk ({prediction_result['risk_score']:.3f})")
        
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Batch prediction endpoint for multiple students using ML model.
    
    Expected payload:
    {
        "students": [
            {"student_id": "uuid1", "features": {...}},
            {"student_id": "uuid2", "features": {...}}
        ]
    }
    """
    try:
        if ml_predictor is None:
            return jsonify({
                'error': 'ML model not loaded',
                'message': 'Please run generate_and_train.py first'
            }), 503
        
        data = request.get_json()
        students = data.get('students', [])
        
        if not students:
            return jsonify({'error': 'No students provided'}), 400
        
        results = []
        for student_data in students:
            features = student_data.get('features', {})
            data_tier = features.get('data_tier', 0)
            
            if data_tier == 0:
                results.append({
                    'student_id': student_data.get('student_id'),
                    'error': 'Insufficient data',
                    'data_tier': 0
                })
                continue
            
            try:
                prediction = ml_predictor.predict(features)
                confidence_map = {1: 'low', 2: 'medium', 3: 'high'}
                
                results.append({
                    'student_id': student_data.get('student_id'),
                    'risk_score': prediction['risk_score'],
                    'risk_level': prediction['risk_level'],
                    'confidence': confidence_map.get(data_tier, 'low'),
                    'data_tier': data_tier
                })
            except Exception as e:
                results.append({
                    'student_id': student_data.get('student_id'),
                    'error': str(e)
                })
        
        return jsonify({'predictions': results}), 200
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain_model():
    """
    Retrain the ML model with new data (Continuous Learning).
    
    Expected payload:
    {
        "training_data": [
            {
                "attendance_rate": 0.85,
                "avg_marks_percentage": 72.5,
                "behavior_score": 80,
                "days_tracked": 45,
                "exams_completed": 4,
                "days_present": 38,
                "days_absent": 7,
                "total_incidents": 2,
                "positive_incidents": 1,
                "negative_incidents": 1,
                "dropped_out": 0
            },
            ...
        ]
    }
    """
    global ml_predictor
    
    try:
        data = request.get_json()
        training_data = data.get('training_data', [])
        
        if not training_data:
            return jsonify({'error': 'No training data provided'}), 400
        
        if len(training_data) < 10:
            return jsonify({
                'error': 'Insufficient training data',
                'message': 'Need at least 10 samples to retrain the model'
            }), 400
        
        logger.info(f"Retraining model with {len(training_data)} samples...")
        
        # Retrain the model
        import pandas as pd
        from models.ml_predictor import train_new_model
        
        df = pd.DataFrame(training_data)
        
        # Validate required columns
        required_cols = [
            'attendance_rate', 'avg_marks_percentage', 'behavior_score',
            'days_tracked', 'exams_completed', 'days_present', 'days_absent',
            'total_incidents', 'positive_incidents', 'negative_incidents',
            'dropped_out'
        ]
        
        missing_cols = set(required_cols) - set(df.columns)
        if missing_cols:
            return jsonify({
                'error': 'Missing required columns',
                'missing': list(missing_cols)
            }), 400
        
        # Train new model
        model_path = 'models/dropout_model.pkl'
        metrics = train_new_model(df, model_path)
        
        # Reload model into memory
        ml_predictor = MLPredictor(model_path)
        
        logger.info("Model retrained and reloaded successfully")
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully',
            'training_samples': len(training_data),
            'metrics': metrics
        }), 200
    
    except Exception as e:
        logger.error(f"Retraining error: {str(e)}")
        return jsonify({
            'error': 'Retraining failed',
            'message': str(e)
        }), 500

def _generate_fallback_explanation(features, risk_result, feature_importance=None):
    """Generate rule-based explanation with feature importance"""
    risk_level = risk_result['risk_level']
    
    # Identify top risk factors
    top_factors = []
    if feature_importance:
        sorted_features = sorted(
            feature_importance.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
        top_factors = [f[0].replace('_', ' ').title() for f in sorted_features]
    
    if top_factors:
        explanation = f"Student is at {risk_level} risk. Key factors: {', '.join(top_factors)}."
    else:
        explanation = f"Student is at {risk_level} risk based on ML model analysis."
    
    recommendations = []
    
    # Generate recommendations based on features
    if features.get('attendance_rate', 1) < 0.75:
        recommendations.append("Improve attendance through parent engagement and monitoring")
    if features.get('avg_marks_percentage', 100) < 50:
        recommendations.append("Provide intensive academic tutoring and remedial classes")
    if features.get('behavior_score', 100) < 60:
        recommendations.append("Implement behavior intervention and counseling support")
    if features.get('exams_completed', 10) < 3:
        recommendations.append("Ensure regular exam participation and assessment")
    
    if not recommendations:
        recommendations.append("Continue monitoring student progress regularly")
    
    return {
        'explanation': explanation,
        'recommendations': recommendations,
        'priority_actions': recommendations[:2],
        'fallback': True
    }

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=Config.FLASK_PORT,
        debug=(Config.FLASK_ENV == 'development')
    )
