import google.generativeai as genai
from typing import Dict, Optional
import json

class GeminiExplainer:
    """
    Uses Google Gemini to generate explainable AI recommendations
    for dropout risk predictions.
    """
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def generate_explanation(self, student_data: Dict, risk_result: Dict) -> Dict:
        """
        Generate human-readable explanation and recommendations.
        
        Args:
            student_data: Student features and metadata
            risk_result: Risk calculation results
        
        Returns:
            Dict with explanation, recommendations, and priority_actions
        """
        prompt = self._build_prompt(student_data, risk_result)
        
        try:
            response = self.model.generate_content(prompt)
            explanation_text = response.text
            
            # Parse structured response
            parsed = self._parse_gemini_response(explanation_text)
            
            return {
                'success': True,
                'explanation': parsed.get('explanation', explanation_text),
                'recommendations': parsed.get('recommendations', []),
                'priority_actions': parsed.get('priority_actions', []),
                'raw_response': explanation_text
            }
        
        except Exception as e:
            # Fallback to rule-based explanation
            return self._fallback_explanation(student_data, risk_result, str(e))
    
    def _build_prompt(self, student_data: Dict, risk_result: Dict) -> str:
        """Build structured prompt for Gemini with ML feature importance"""
        features = student_data.get('features', {})
        risk_score = risk_result.get('risk_score', 0)
        risk_level = risk_result.get('risk_level', 'unknown')
        feature_importance = student_data.get('feature_importance', {})
        
        # Get top 3 most important features
        top_features = sorted(
            feature_importance.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
        
        top_features_text = "\n".join([
            f"- {feat.replace('_', ' ').title()}: {imp:.2%} importance"
            for feat, imp in top_features
        ])
        
        prompt = f"""You are an educational counselor analyzing student dropout risk using a Machine Learning model.

STUDENT PROFILE:
- Attendance Rate: {features.get('attendance_rate', 0) * 100:.1f}%
- Average Marks: {features.get('avg_marks_percentage', 0):.1f}%
- Behavior Score: {features.get('behavior_score', 100):.1f}/100
- Days Tracked: {features.get('days_tracked', 0)}
- Exams Completed: {features.get('exams_completed', 0)}

ML MODEL PREDICTION:
- Risk Score: {risk_score * 100:.1f}% probability of dropout
- Risk Level: {risk_level.upper()}
- Model Type: Random Forest Classifier

TOP RISK FACTORS (by ML feature importance):
{top_features_text}

Please provide:
1. A brief explanation (2-3 sentences) of why the ML model predicts {risk_level} risk, referencing the top risk factors
2. 3-5 specific, actionable recommendations for teachers/counselors based on the key risk factors
3. Top 2 priority actions to take immediately

Format your response as JSON:
{{
  "explanation": "Brief explanation here",
  "recommendations": ["Recommendation 1", "Recommendation 2", ...],
  "priority_actions": ["Priority 1", "Priority 2"]
}}
"""
        return prompt
    
    def _parse_gemini_response(self, response_text: str) -> Dict:
        """Attempt to parse JSON from Gemini response"""
        try:
            # Try to extract JSON from markdown code blocks
            if '```json' in response_text:
                json_start = response_text.find('```json') + 7
                json_end = response_text.find('```', json_start)
                json_str = response_text[json_start:json_end].strip()
            elif '```' in response_text:
                json_start = response_text.find('```') + 3
                json_end = response_text.find('```', json_start)
                json_str = response_text[json_start:json_end].strip()
            else:
                json_str = response_text
            
            return json.loads(json_str)
        except:
            # Return raw text if parsing fails
            return {'explanation': response_text}
    
    def _fallback_explanation(self, student_data: Dict, risk_result: Dict, error: str) -> Dict:
        """Generate rule-based explanation if Gemini fails"""
        features = student_data.get('features', {})
        risk_level = risk_result.get('risk_level', 'unknown')
        feature_importance = student_data.get('feature_importance', {})
        
        # Identify top risk factors from ML model
        if feature_importance:
            top_features = sorted(
                feature_importance.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:2]
            top_factors = [f[0].replace('_', ' ').title() for f in top_features]
            explanation = f"ML model predicts {risk_level} risk. Key factors: {', '.join(top_factors)}."
        else:
            explanation = f"Student is at {risk_level} risk based on ML model analysis."
        
        recommendations = []
        
        # Generate recommendations based on features
        if features.get('attendance_rate', 1) < 0.75:
            recommendations.append("Monitor and improve attendance through parent engagement")
        if features.get('avg_marks_percentage', 100) < 50:
            recommendations.append("Provide intensive academic support and tutoring")
        if features.get('behavior_score', 100) < 60:
            recommendations.append("Implement behavior intervention and counseling")
        if features.get('exams_completed', 10) < 3:
            recommendations.append("Ensure regular exam participation")
        
        if not recommendations:
            recommendations.append("Continue monitoring student progress")
        
        return {
            'success': False,
            'explanation': explanation,
            'recommendations': recommendations,
            'priority_actions': recommendations[:2],
            'error': f"Gemini API unavailable: {error}",
            'fallback': True
        }
