"""
ML Predictor using trained Random Forest model
Loads model from disk and provides predictions with feature importance
"""

import joblib
import numpy as np
import json
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report, accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

class MLPredictor:
    """
    Wrapper for trained Random Forest model
    Provides predictions and feature importance
    """
    
    def __init__(self, model_path='models/dropout_model.pkl'):
        """Load trained model from disk"""
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model file not found: {model_path}\n"
                "Please run 'python generate_and_train.py' first"
            )
        
        self.model = joblib.load(model_path)
        
        # Load metadata if available
        metadata_path = 'models/model_metadata.json'
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.metadata = {}
        
        # Define feature columns (must match training data)
        self.feature_columns = [
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
    
    def predict(self, features):
        """
        Predict dropout risk for a student
        
        Args:
            features: Dict with student features
        
        Returns:
            Dict with risk_score, risk_level, and feature_importance
        """
        import pandas as pd
        
        # Extract features in correct order
        feature_values = []
        for col in self.feature_columns:
            value = features.get(col, 0)
            feature_values.append(value)
        
        # Convert to pandas DataFrame with proper column names to avoid sklearn warning
        X = pd.DataFrame([feature_values], columns=self.feature_columns)
        
        # Get prediction probability
        proba = self.model.predict_proba(X)[0]
        risk_score = proba[1]  # Probability of dropout (class 1)
        
        # Classify risk level
        risk_level = self._classify_risk(risk_score)
        
        # Get feature importance for this prediction
        feature_importance = self._get_feature_importance()
        
        return {
            'risk_score': round(float(risk_score), 3),
            'risk_level': risk_level,
            'feature_importance': feature_importance,
            'model_type': 'RandomForestClassifier'
        }
    
    def _classify_risk(self, risk_score):
        """Classify risk score into categorical level"""
        if risk_score < 0.3:
            return 'low'
        elif risk_score < 0.6:
            return 'medium'
        elif risk_score < 0.8:
            return 'high'
        else:
            return 'critical'
    
    def _get_feature_importance(self):
        """
        Get feature importance from the trained model
        Returns dict mapping feature names to importance scores
        """
        importances = self.model.feature_importances_
        
        # Create dict of feature: importance
        feature_importance = {}
        for feature, importance in zip(self.feature_columns, importances):
            feature_importance[feature] = round(float(importance), 4)
        
        return feature_importance
    
    def get_top_features(self, n=5):
        """Get top N most important features"""
        importance = self._get_feature_importance()
        sorted_features = sorted(
            importance.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        return sorted_features[:n]


def train_new_model(df, model_path='models/dropout_model.pkl'):
    """
    Train a new Random Forest model on provided data
    Used by the /retrain endpoint
    
    Args:
        df: pandas DataFrame with training data
        model_path: Path to save the trained model
    
    Returns:
        Dict with training metrics
    """
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
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        class_weight='balanced'
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    
    # Feature importance
    feature_importance = dict(zip(feature_columns, model.feature_importances_))
    
    # Save model
    joblib.dump(model, model_path)
    
    # Save metadata
    metadata = {
        'feature_columns': feature_columns,
        'n_estimators': model.n_estimators,
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'dropout_rate': float(y.mean()),
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'roc_auc': float(roc_auc),
        'confusion_matrix': {
            'tn': int(tn),
            'fp': int(fp),
            'fn': int(fn),
            'tp': int(tp)
        },
        'feature_importance': {k: float(v) for k, v in feature_importance.items()}
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    return {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'roc_auc': float(roc_auc),
        'confusion_matrix': {
            'tn': int(tn),
            'fp': int(fp),
            'fn': int(fn),
            'tp': int(tp)
        },
        'feature_importance': {k: float(v) for k, v in feature_importance.items()},
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'dropout_rate': float(y.mean())
    }
