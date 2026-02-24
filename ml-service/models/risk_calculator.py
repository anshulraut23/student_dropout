import numpy as np
from typing import Dict, Tuple

class RiskCalculator:
    """
    Rule-based risk calculator for dropout prediction.
    Uses weighted scoring across attendance, academic, and behavior dimensions.
    """
    
    def __init__(self):
        # Feature weights (must sum to 1.0)
        self.weights = {
            'attendance': 0.40,
            'academic': 0.40,
            'behavior': 0.20
        }
    
    def calculate_risk(self, features: Dict) -> Dict:
        """
        Calculate dropout risk score and classification.
        
        Args:
            features: Dict with keys:
                - attendance_rate: float (0-1)
                - avg_marks_percentage: float (0-100)
                - behavior_score: float (0-100, higher is better)
                - data_tier: int (0-3)
                - days_tracked: int
                - exams_completed: int
        
        Returns:
            Dict with risk_score, risk_level, confidence, and component_scores
        """
        # Extract features
        attendance_rate = features.get('attendance_rate', 0)
        avg_marks = features.get('avg_marks_percentage', 0)
        behavior_score = features.get('behavior_score', 100)  # Default: no issues
        data_tier = features.get('data_tier', 0)
        
        # Calculate component risk scores (0-1, higher = more risk)
        attendance_risk = self._calculate_attendance_risk(attendance_rate)
        academic_risk = self._calculate_academic_risk(avg_marks)
        behavior_risk = self._calculate_behavior_risk(behavior_score)
        
        # Weighted composite risk score
        risk_score = (
            self.weights['attendance'] * attendance_risk +
            self.weights['academic'] * academic_risk +
            self.weights['behavior'] * behavior_risk
        )
        
        # Classify risk level
        risk_level = self._classify_risk(risk_score)
        
        # Calculate confidence based on data tier
        confidence = self._calculate_confidence(data_tier)
        
        return {
            'risk_score': round(risk_score, 3),
            'risk_level': risk_level,
            'confidence': confidence,
            'component_scores': {
                'attendance_risk': round(attendance_risk, 3),
                'academic_risk': round(academic_risk, 3),
                'behavior_risk': round(behavior_risk, 3)
            },
            'weights': self.weights
        }
    
    def _calculate_attendance_risk(self, attendance_rate: float) -> float:
        """
        Convert attendance rate to risk score.
        90%+ = low risk, <75% = high risk
        """
        if attendance_rate >= 0.90:
            return 0.1
        elif attendance_rate >= 0.80:
            return 0.3
        elif attendance_rate >= 0.75:
            return 0.5
        elif attendance_rate >= 0.60:
            return 0.7
        else:
            return 0.95
    
    def _calculate_academic_risk(self, avg_marks: float) -> float:
        """
        Convert average marks percentage to risk score.
        75%+ = low risk, <40% = high risk
        """
        if avg_marks >= 75:
            return 0.1
        elif avg_marks >= 60:
            return 0.3
        elif avg_marks >= 50:
            return 0.5
        elif avg_marks >= 40:
            return 0.7
        else:
            return 0.95
    
    def _calculate_behavior_risk(self, behavior_score: float) -> float:
        """
        Convert behavior score to risk score.
        Higher behavior score = better behavior = lower risk
        """
        if behavior_score >= 80:
            return 0.1
        elif behavior_score >= 60:
            return 0.3
        elif behavior_score >= 40:
            return 0.6
        else:
            return 0.9
    
    def _classify_risk(self, risk_score: float) -> str:
        """Classify risk score into categorical level"""
        if risk_score < 0.3:
            return 'low'
        elif risk_score < 0.6:
            return 'medium'
        elif risk_score < 0.8:
            return 'high'
        else:
            return 'critical'
    
    def _calculate_confidence(self, data_tier: int) -> str:
        """Map data tier to confidence level"""
        confidence_map = {
            0: 'insufficient',
            1: 'low',
            2: 'medium',
            3: 'high'
        }
        return confidence_map.get(data_tier, 'insufficient')
