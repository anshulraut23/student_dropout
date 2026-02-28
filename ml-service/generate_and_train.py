"""
Generate synthetic student data and train Random Forest model
This script creates realistic training data and trains the dropout prediction model
Can also use real dropout data from database for better accuracy
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, accuracy_score, precision_score, recall_score, f1_score
import joblib
import json
import requests
import os
from datetime import datetime

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

def fetch_real_training_data(backend_url='http://localhost:5000'):
    """
    Fetch real training data from backend API
    Returns DataFrame with real student outcomes
    """
    try:
        print(f"\nFetching real training data from {backend_url}...")
        
        # Note: In production, you'd need authentication token
        # For now, assuming internal service-to-service call
        response = requests.get(
            f'{backend_url}/api/dropout/training-data',
            headers={'Authorization': 'Bearer YOUR_TOKEN_HERE'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('training_data'):
                df = pd.DataFrame(data['training_data'])
                print(f"✅ Fetched {len(df)} real student records")
                print(f"   - Dropped out: {data.get('dropped_out_count', 0)}")
                print(f"   - Active: {data.get('active_count', 0)}")
                return df
        
        print(f"⚠️  Failed to fetch real data (status {response.status_code})")
        return None
        
    except Exception as e:
        print(f"⚠️  Error fetching real data: {e}")
        return None

def train_model(df, model_path='models/dropout_model.pkl', use_real_data=False):
    """
    Train Random Forest classifier on the data
    Includes comprehensive validation metrics
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
    
    # Check if we have enough data
    if len(df) < 10:
        print("⚠️  Warning: Very small dataset. Results may not be reliable.")
    
    dropout_count = y.sum()
    if dropout_count < 2:
        print("⚠️  Warning: Too few dropout cases for proper training.")
        print("   Consider using synthetic data or collecting more outcomes.")
    
    # Split data (80/20 train/test split)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if dropout_count >= 2 else None
    )
    
    print(f"\n📊 Dataset Split:")
    print(f"   Training set: {len(X_train)} samples")
    print(f"   Test set: {len(X_test)} samples")
    print(f"   Overall dropout rate: {y.mean():.2%}")
    
    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        class_weight='balanced'  # Handle class imbalance
    )
    
    print("\n🔄 Training Random Forest model...")
    model.fit(X_train, y_train)
    
    # Evaluate on test set
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Calculate comprehensive metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    try:
        roc_auc = roc_auc_score(y_test, y_pred_proba)
    except:
        roc_auc = 0.0
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)
    
    print("\n" + "="*60)
    print("📈 MODEL EVALUATION METRICS")
    print("="*60)
    
    print(f"\n✅ Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"✅ Precision: {precision:.4f} ({precision*100:.2f}%)")
    print(f"✅ Recall:    {recall:.4f} ({recall*100:.2f}%)")
    print(f"✅ F1-Score:  {f1:.4f} ({f1*100:.2f}%)")
    print(f"✅ ROC-AUC:   {roc_auc:.4f}")
    
    print("\n📊 Confusion Matrix:")
    print(f"   True Negatives:  {tn} (Correctly predicted no dropout)")
    print(f"   False Positives: {fp} (Incorrectly predicted dropout)")
    print(f"   False Negatives: {fn} (Missed actual dropouts)")
    print(f"   True Positives:  {tp} (Correctly predicted dropout)")
    
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Dropout', 'Dropout']))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🎯 Feature Importance:")
    print(feature_importance.to_string(index=False))
    
    # Save model
    joblib.dump(model, model_path)
    print(f"\n💾 Model saved to: {model_path}")
    
    # Save comprehensive metadata
    metadata = {
        'model_version': f'v{datetime.now().strftime("%Y%m%d_%H%M%S")}',
        'training_date': datetime.now().isoformat(),
        'data_source': 'real_data' if use_real_data else 'synthetic_data',
        'feature_columns': feature_columns,
        'n_estimators': model.n_estimators,
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'total_samples': len(df),
        'dropout_rate': float(y.mean()),
        'metrics': {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1),
            'roc_auc': float(roc_auc)
        },
        'confusion_matrix': {
            'true_negatives': int(tn),
            'false_positives': int(fp),
            'false_negatives': int(fn),
            'true_positives': int(tp)
        },
        'feature_importance': feature_importance.to_dict('records')
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("💾 Model metadata saved to: models/model_metadata.json")
    
    return model, feature_importance, metadata

def main():
    print("="*60)
    print("🎓 DROPOUT PREDICTION MODEL TRAINING")
    print("="*60)
    
    # Try to fetch real data first
    use_real_data = False
    backend_url = os.getenv('BACKEND_URL', 'http://localhost:5000')
    
    print("\n🔍 Checking for real training data...")
    real_df = fetch_real_training_data(backend_url)
    
    if real_df is not None and len(real_df) >= 10:
        print("✅ Using REAL student outcome data for training")
        df = real_df
        use_real_data = True
    else:
        print("⚠️  Real data not available or insufficient")
        print("📝 Generating synthetic student records...")
        df = generate_synthetic_data(n_samples=1000)
        use_real_data = False
    
    # Save training data
    df.to_csv('models/training_data.csv', index=False)
    print(f"💾 Training data saved to: models/training_data.csv")
    
    print("\n📊 Data Summary:")
    print(df.describe())
    
    # Train model with validation
    model, feature_importance, metadata = train_model(df, use_real_data=use_real_data)
    
    print("\n" + "="*60)
    print("✅ TRAINING COMPLETE")
    print("="*60)
    
    if use_real_data:
        print("\n🎯 Model trained on REAL student outcomes")
        print("   This model should provide more accurate predictions!")
    else:
        print("\n📝 Model trained on synthetic data")
        print("   For better accuracy, mark actual dropout outcomes in the system")
    
    print("\n📋 Next steps:")
    print("1. Start the Flask server: python app.py")
    print("2. The model will be loaded automatically")
    print("3. Use POST /predict to get ML-based predictions")
    print("4. Use POST /retrain to update the model with new data")
    print("\n💡 To improve model accuracy:")
    print("   - Mark students who dropped out in the admin panel")
    print("   - Retrain the model periodically with updated outcomes")
    print("   - Monitor model performance metrics in the dashboard")

if __name__ == "__main__":
    main()
