"""
Generate synthetic student data and train Random Forest model
This script creates realistic training data and trains the dropout prediction model
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import json

def generate_synthetic_data(n_samples=1000, random_state=42):
    """
    Generate synthetic student data with realistic correlations
    Features match the Node.js feature extractor output
    """
    np.random.seed(random_state)
    
    data = []
    
    for i in range(n_samples):
        # Generate base features with realistic distributions
        
        # Attendance rate (0-1, skewed towards higher values)
        attendance_rate = np.clip(np.random.beta(8, 2), 0, 1)
        
        # Average marks percentage (0-100, normal distribution)
        avg_marks_percentage = np.clip(np.random.normal(65, 20), 0, 100)
        
        # Behavior score (0-100, skewed towards higher values)
        behavior_score = np.clip(np.random.beta(8, 2) * 100, 0, 100)
        
        # Days tracked (14-100)
        days_tracked = np.random.randint(14, 101)
        
        # Exams completed (1-10)
        exams_completed = np.random.randint(1, 11)
        
        # Days present/absent (derived from attendance_rate)
        days_present = int(days_tracked * attendance_rate)
        days_absent = days_tracked - days_present
        
        # Behavior incidents (derived from behavior_score)
        total_incidents = np.random.poisson(max(0, (100 - behavior_score) / 10))
        negative_incidents = int(total_incidents * 0.7)
        positive_incidents = total_incidents - negative_incidents
        
        # Calculate dropout probability based on realistic correlations
        dropout_prob = calculate_dropout_probability(
            attendance_rate,
            avg_marks_percentage,
            behavior_score,
            days_tracked,
            exams_completed
        )
        
        # Generate binary outcome
        dropped_out = 1 if np.random.random() < dropout_prob else 0
        
        data.append({
            'attendance_rate': round(attendance_rate, 3),
            'avg_marks_percentage': round(avg_marks_percentage, 2),
            'behavior_score': round(behavior_score, 2),
            'days_tracked': days_tracked,
            'exams_completed': exams_completed,
            'days_present': days_present,
            'days_absent': days_absent,
            'total_incidents': total_incidents,
            'positive_incidents': positive_incidents,
            'negative_incidents': negative_incidents,
            'dropped_out': dropped_out
        })
    
    return pd.DataFrame(data)

def calculate_dropout_probability(attendance_rate, avg_marks, behavior_score, 
                                  days_tracked, exams_completed):
    """
    Calculate realistic dropout probability based on features
    Uses domain knowledge to create realistic correlations
    """
    # Base probability
    prob = 0.1
    
    # Attendance impact (40% weight)
    if attendance_rate < 0.60:
        prob += 0.40
    elif attendance_rate < 0.75:
        prob += 0.25
    elif attendance_rate < 0.85:
        prob += 0.10
    
    # Academic performance impact (40% weight)
    if avg_marks < 40:
        prob += 0.40
    elif avg_marks < 50:
        prob += 0.25
    elif avg_marks < 60:
        prob += 0.10
    
    # Behavior impact (20% weight)
    if behavior_score < 40:
        prob += 0.20
    elif behavior_score < 60:
        prob += 0.10
    elif behavior_score < 80:
        prob += 0.05
    
    # Data quality impact (less data = more uncertainty, slight increase)
    if days_tracked < 30:
        prob += 0.05
    if exams_completed < 3:
        prob += 0.05
    
    # Interaction effects (combined risk factors)
    if attendance_rate < 0.70 and avg_marks < 50:
        prob += 0.15  # Double jeopardy
    
    if behavior_score < 50 and avg_marks < 50:
        prob += 0.10  # Behavior + academic issues
    
    # Cap probability
    return min(prob, 0.95)

def train_model(df, model_path='models/dropout_model.pkl'):
    """
    Train Random Forest classifier on the data
    """
    # Define features (match Node.js feature extractor)
    feature_columns = [
        'attendance_rate',
        'avg_marks_percentage',
        'behavior_score',
        'days_tracked',
        'exams_completed',
        'days_present',
        'days_absent',
        'total_incidents',
        'positive_incidents',
        'negative_incidents'
    ]
    
    X = df[feature_columns]
    y = df['dropped_out']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    print(f"Dropout rate: {y.mean():.2%}")
    
    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        class_weight='balanced'  # Handle class imbalance
    )
    
    print("\nTraining Random Forest model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    print("\n" + "="*60)
    print("MODEL EVALUATION")
    print("="*60)
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Dropout', 'Dropout']))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    print(f"\nROC-AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(feature_importance.to_string(index=False))
    
    # Save model
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")
    
    # Save feature columns for reference
    metadata = {
        'feature_columns': feature_columns,
        'n_estimators': model.n_estimators,
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'dropout_rate': float(y.mean()),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba))
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("Model metadata saved to: models/model_metadata.json")
    
    return model, feature_importance

def main():
    print("="*60)
    print("DROPOUT PREDICTION MODEL TRAINING")
    print("="*60)
    
    # Generate synthetic data
    print("\nGenerating 1,000 synthetic student records...")
    df = generate_synthetic_data(n_samples=1000)
    
    # Save training data
    df.to_csv('models/training_data.csv', index=False)
    print(f"Training data saved to: models/training_data.csv")
    
    print("\nData Summary:")
    print(df.describe())
    
    # Train model
    model, feature_importance = train_model(df)
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE")
    print("="*60)
    print("\nNext steps:")
    print("1. Start the Flask server: python app.py")
    print("2. The model will be loaded automatically")
    print("3. Use POST /predict to get ML-based predictions")
    print("4. Use POST /retrain to update the model with new data")

if __name__ == "__main__":
    main()
