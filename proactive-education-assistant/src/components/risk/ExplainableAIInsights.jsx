import React from 'react';
import { Brain, TrendingDown, TrendingUp, AlertCircle, Info } from 'lucide-react';

/**
 * Explainable AI Insights Component
 * Provides clear numerical explanations about why predictions may be uncertain
 * Explains data sufficiency, consistency, and impact on predictions
 */
const ExplainableAIInsights = ({ features, prediction, dataQualityScore }) => {
  const insights = generateInsights(features, prediction, dataQualityScore);
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Brain className="w-6 h-6 text-purple-600 mt-1" />
        <div className="flex-1">
          <h4 className="font-semibold text-purple-900 mb-3">AI Prediction Insights</h4>
          
          <div className="space-y-4">
            {/* Data Sufficiency */}
            <InsightCard
              title="Data Sufficiency"
              icon={<Info className="w-4 h-4" />}
              status={insights.dataSufficiency.status}
              metrics={insights.dataSufficiency.metrics}
              explanation={insights.dataSufficiency.explanation}
            />
            
            {/* Prediction Confidence */}
            <InsightCard
              title="Prediction Confidence"
              icon={prediction.confidence === 'high' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              status={insights.confidence.status}
              metrics={insights.confidence.metrics}
              explanation={insights.confidence.explanation}
            />
            
            {/* Data Consistency Impact */}
            <InsightCard
              title="Data Consistency Impact"
              icon={<AlertCircle className="w-4 h-4" />}
              status={insights.consistency.status}
              metrics={insights.consistency.metrics}
              explanation={insights.consistency.explanation}
            />
            
            {/* Model Reliability */}
            <InsightCard
              title="Model Reliability"
              icon={<Brain className="w-4 h-4" />}
              status={insights.reliability.status}
              metrics={insights.reliability.metrics}
              explanation={insights.reliability.explanation}
            />
          </div>
          
          {/* Overall Assessment */}
          <div className="mt-4 pt-3 border-t border-purple-300">
            <p className="text-sm font-semibold text-purple-900 mb-2">Overall Assessment:</p>
            <p className="text-sm text-purple-800 leading-relaxed">
              {insights.overallAssessment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ title, icon, status, metrics, explanation }) => {
  const statusColors = {
    excellent: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    good: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    poor: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  };
  
  const colors = statusColors[status] || statusColors.moderate;
  
  return (
    <div className={`${colors.bg} border ${colors.border} rounded-md p-3`}>
      <div className="flex items-start gap-2 mb-2">
        <div className={colors.text}>{icon}</div>
        <div className="flex-1">
          <h5 className={`text-sm font-semibold ${colors.text}`}>{title}</h5>
        </div>
        <span className={`text-xs font-bold ${colors.text} uppercase`}>{status}</span>
      </div>
      
      {/* Numerical Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-xs text-gray-700">{metric.label}:</span>
            <span className={`text-xs font-bold ${colors.text}`}>{metric.value}</span>
          </div>
        ))}
      </div>
      
      {/* Explanation */}
      <p className="text-xs text-gray-700 leading-relaxed">{explanation}</p>
    </div>
  );
};

/**
 * Generate AI insights based on features and prediction
 */
function generateInsights(features, prediction, dataQualityScore) {
  const insights = {
    dataSufficiency: {
      status: 'moderate',
      metrics: [],
      explanation: ''
    },
    confidence: {
      status: 'moderate',
      metrics: [],
      explanation: ''
    },
    consistency: {
      status: 'moderate',
      metrics: [],
      explanation: ''
    },
    reliability: {
      status: 'moderate',
      metrics: [],
      explanation: ''
    },
    overallAssessment: ''
  };
  
  if (!features || !prediction) return insights;
  
  const daysTracked = features.days_tracked || 0;
  const daysPresent = features.days_present || 0;
  const daysAbsent = features.days_absent || 0;
  const examsCompleted = features.exams_completed || 0;
  const totalIncidents = features.total_incidents || 0;
  
  const totalAttendance = daysPresent + daysAbsent;
  const attendanceRate = totalAttendance > 0 ? (daysPresent / totalAttendance) * 100 : 0;
  
  // 1. Data Sufficiency Analysis
  const minDaysRecommended = 30;
  const minExamsRecommended = 3;
  
  insights.dataSufficiency.metrics = [
    { label: 'Days Recorded', value: `${totalAttendance}/${minDaysRecommended}` },
    { label: 'Exams Completed', value: `${examsCompleted}/${minExamsRecommended}` },
    { label: 'Behavior Records', value: totalIncidents },
    { label: 'Data Coverage', value: `${Math.round((totalAttendance / minDaysRecommended) * 100)}%` }
  ];
  
  if (totalAttendance >= minDaysRecommended && examsCompleted >= minExamsRecommended) {
    insights.dataSufficiency.status = 'excellent';
    insights.dataSufficiency.explanation = `Excellent data coverage with ${totalAttendance} days and ${examsCompleted} exams. This provides a strong foundation for accurate predictions.`;
  } else if (totalAttendance >= 14 && examsCompleted >= 2) {
    insights.dataSufficiency.status = 'good';
    insights.dataSufficiency.explanation = `Good data coverage with ${totalAttendance} days and ${examsCompleted} exams. Predictions are reliable but would improve with ${minDaysRecommended - totalAttendance} more days of data.`;
  } else if (totalAttendance >= 7 && examsCompleted >= 1) {
    insights.dataSufficiency.status = 'moderate';
    insights.dataSufficiency.explanation = `Moderate data coverage with ${totalAttendance} days and ${examsCompleted} exams. Need ${minDaysRecommended - totalAttendance} more days and ${minExamsRecommended - examsCompleted} more exams for higher confidence.`;
  } else {
    insights.dataSufficiency.status = 'poor';
    insights.dataSufficiency.explanation = `Limited data with only ${totalAttendance} days and ${examsCompleted} exams. Predictions may be less accurate. Minimum ${minDaysRecommended} days and ${minExamsRecommended} exams recommended.`;
  }
  
  // 2. Prediction Confidence Analysis
  const confidenceLevel = prediction.confidence || 'medium';
  const riskScore = (prediction.risk_score * 100).toFixed(1);
  
  insights.confidence.metrics = [
    { label: 'Confidence Level', value: confidenceLevel.toUpperCase() },
    { label: 'Risk Score', value: `${riskScore}%` },
    { label: 'Data Points', value: totalAttendance + examsCompleted },
    { label: 'Model Certainty', value: confidenceLevel === 'high' ? '85%+' : confidenceLevel === 'medium' ? '60-85%' : '<60%' }
  ];
  
  if (confidenceLevel === 'high') {
    insights.confidence.status = 'excellent';
    insights.confidence.explanation = `High confidence prediction based on ${totalAttendance} days of consistent data. The model is 85%+ certain about this ${riskScore}% risk assessment.`;
  } else if (confidenceLevel === 'medium') {
    insights.confidence.status = 'good';
    insights.confidence.explanation = `Medium confidence prediction with 60-85% certainty. More data would increase confidence in the ${riskScore}% risk score.`;
  } else {
    insights.confidence.status = 'moderate';
    insights.confidence.explanation = `Lower confidence (<60%) due to limited data. The ${riskScore}% risk score should be interpreted cautiously until more data is collected.`;
  }
  
  // 3. Data Consistency Impact
  const consistencyScore = dataQualityScore || 70;
  const gapDays = daysTracked - totalAttendance;
  const consistencyRatio = daysTracked > 0 ? (totalAttendance / daysTracked) * 100 : 0;
  
  insights.consistency.metrics = [
    { label: 'Consistency Score', value: `${consistencyScore}%` },
    { label: 'Records vs Days', value: `${totalAttendance}/${daysTracked}` },
    { label: 'Missing Days', value: gapDays },
    { label: 'Consistency Ratio', value: `${Math.round(consistencyRatio)}%` }
  ];
  
  if (consistencyScore >= 85 && gapDays <= 3) {
    insights.consistency.status = 'excellent';
    insights.consistency.explanation = `Excellent consistency with ${Math.round(consistencyRatio)}% coverage and only ${gapDays} missing days. Daily recording ensures accurate trend analysis.`;
  } else if (consistencyScore >= 70 && gapDays <= 7) {
    insights.consistency.status = 'good';
    insights.consistency.explanation = `Good consistency with ${Math.round(consistencyRatio)}% coverage. ${gapDays} missing days have minimal impact on prediction accuracy.`;
  } else if (consistencyScore >= 50) {
    insights.consistency.status = 'moderate';
    insights.consistency.explanation = `Moderate consistency with ${gapDays} missing days. Gaps in data may affect trend detection. Daily recording recommended.`;
  } else {
    insights.consistency.status = 'poor';
    insights.consistency.explanation = `Poor consistency with ${gapDays} missing days (${Math.round(100 - consistencyRatio)}% gaps). Inconsistent data significantly reduces prediction reliability.`;
  }
  
  // 4. Model Reliability
  const reliabilityFactors = [];
  let reliabilityScore = 0;
  
  // Factor 1: Data quantity (40 points)
  if (totalAttendance >= 30) {
    reliabilityScore += 40;
    reliabilityFactors.push('sufficient data');
  } else if (totalAttendance >= 14) {
    reliabilityScore += 25;
    reliabilityFactors.push('adequate data');
  } else {
    reliabilityScore += 15;
    reliabilityFactors.push('limited data');
  }
  
  // Factor 2: Data consistency (30 points)
  if (consistencyScore >= 85) {
    reliabilityScore += 30;
    reliabilityFactors.push('high consistency');
  } else if (consistencyScore >= 70) {
    reliabilityScore += 20;
    reliabilityFactors.push('good consistency');
  } else {
    reliabilityScore += 10;
    reliabilityFactors.push('inconsistent data');
  }
  
  // Factor 3: Data diversity (30 points)
  const hasAllDataTypes = totalAttendance >= 3 && examsCompleted >= 1 && totalIncidents > 0;
  if (hasAllDataTypes) {
    reliabilityScore += 30;
    reliabilityFactors.push('complete data types');
  } else if (totalAttendance >= 3 && examsCompleted >= 1) {
    reliabilityScore += 20;
    reliabilityFactors.push('partial data types');
  } else {
    reliabilityScore += 10;
    reliabilityFactors.push('incomplete data types');
  }
  
  insights.reliability.metrics = [
    { label: 'Reliability Score', value: `${reliabilityScore}/100` },
    { label: 'Data Quality', value: `${consistencyScore}%` },
    { label: 'Sample Size', value: totalAttendance >= 30 ? 'Sufficient' : 'Limited' },
    { label: 'Prediction Stability', value: reliabilityScore >= 80 ? 'Stable' : reliabilityScore >= 60 ? 'Moderate' : 'Unstable' }
  ];
  
  if (reliabilityScore >= 80) {
    insights.reliability.status = 'excellent';
    insights.reliability.explanation = `High reliability (${reliabilityScore}/100) due to ${reliabilityFactors.join(', ')}. Predictions are stable and trustworthy.`;
  } else if (reliabilityScore >= 60) {
    insights.reliability.status = 'good';
    insights.reliability.explanation = `Good reliability (${reliabilityScore}/100) with ${reliabilityFactors.join(', ')}. Predictions are generally reliable but could improve.`;
  } else if (reliabilityScore >= 40) {
    insights.reliability.status = 'moderate';
    insights.reliability.explanation = `Moderate reliability (${reliabilityScore}/100) due to ${reliabilityFactors.join(', ')}. Predictions should be used with caution.`;
  } else {
    insights.reliability.status = 'poor';
    insights.reliability.explanation = `Low reliability (${reliabilityScore}/100) due to ${reliabilityFactors.join(', ')}. Collect more consistent data before relying on predictions.`;
  }
  
  // Overall Assessment
  const avgStatus = [
    insights.dataSufficiency.status,
    insights.confidence.status,
    insights.consistency.status,
    insights.reliability.status
  ];
  
  const excellentCount = avgStatus.filter(s => s === 'excellent').length;
  const goodCount = avgStatus.filter(s => s === 'good').length;
  const poorCount = avgStatus.filter(s => s === 'poor').length;
  
  if (excellentCount >= 3) {
    insights.overallAssessment = `This prediction is highly reliable with ${totalAttendance} days of consistent data across ${examsCompleted} exams. The ${riskScore}% risk score is based on strong evidence and can be trusted for intervention planning.`;
  } else if (goodCount + excellentCount >= 3) {
    insights.overallAssessment = `This prediction is reliable with ${totalAttendance} days of data. While the ${riskScore}% risk score is trustworthy, collecting ${minDaysRecommended - totalAttendance} more days would increase confidence to 90%+.`;
  } else if (poorCount >= 2) {
    insights.overallAssessment = `This prediction has limited reliability due to insufficient data (${totalAttendance} days, ${examsCompleted} exams). The ${riskScore}% risk score should be treated as preliminary. Collect at least ${minDaysRecommended} days of consistent data for accurate predictions.`;
  } else {
    insights.overallAssessment = `This prediction has moderate reliability with ${totalAttendance} days of data. The ${riskScore}% risk score provides useful guidance, but consistency improvements would enhance accuracy. Focus on daily attendance recording and regular assessments.`;
  }
  
  return insights;
}

export default ExplainableAIInsights;
