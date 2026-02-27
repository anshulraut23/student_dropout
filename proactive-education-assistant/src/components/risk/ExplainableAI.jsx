import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Explainable AI Component
 * Visualizes feature importance and contributions to risk prediction
 * Shows SHAP-style explanations for model decisions
 */
const ExplainableAI = ({ featureImportance, features, riskScore, riskLevel }) => {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  if (!featureImportance || Object.keys(featureImportance).length === 0) {
    return null;
  }

  // Sort features by importance
  const sortedFeatures = Object.entries(featureImportance)
    .sort(([, a], [, b]) => b - a)
    .map(([name, importance]) => ({
      name,
      importance,
      value: features?.[name] || 0,
      contribution: calculateContribution(name, features?.[name], importance, riskScore)
    }));

  const topFeatures = showAllFeatures ? sortedFeatures : sortedFeatures.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🧠</div>
          <div>
            <h4 className="font-semibold text-gray-800">Explainable AI Analysis</h4>
            <p className="text-xs text-gray-600">Understanding the prediction factors</p>
          </div>
        </div>
        <button
          onClick={() => setShowAllFeatures(!showAllFeatures)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          {showAllFeatures ? (
            <>
              <ChevronUp className="w-3 h-3" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Show All ({sortedFeatures.length})
            </>
          )}
        </button>
      </div>

      {/* Feature Contributions */}
      <div className="space-y-3">
        {topFeatures.map((feature, idx) => (
          <FeatureContribution
            key={feature.name}
            feature={feature}
            rank={idx + 1}
            isExpanded={expandedFeature === feature.name}
            onToggle={() => setExpandedFeature(expandedFeature === feature.name ? null : feature.name)}
          />
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">How to interpret this:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Feature Importance</strong>: How much the model relies on each factor</li>
              <li>• <strong>Contribution</strong>: Whether the factor increases (↑) or decreases (↓) risk</li>
              <li>• <strong>Top 3 factors</strong> typically explain 60-80% of the prediction</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual Feature Contribution Component
 */
const FeatureContribution = ({ feature, rank, isExpanded, onToggle }) => {
  const { name, importance, value, contribution } = feature;
  const displayName = formatFeatureName(name);
  const explanation = getFeatureExplanation(name, value, contribution);
  
  // Determine if this feature increases or decreases risk
  const isIncreasingRisk = contribution > 0;
  const impactColor = isIncreasingRisk ? 'text-red-600' : 'text-green-600';
  const impactBg = isIncreasingRisk ? 'bg-red-50' : 'bg-green-50';
  const impactBorder = isIncreasingRisk ? 'border-red-200' : 'border-green-200';

  return (
    <div className={`border rounded-lg overflow-hidden ${impactBorder}`}>
      {/* Main Bar */}
      <div className={`p-3 ${impactBg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-gray-500 w-6">#{rank}</span>
            <span className="text-sm font-semibold text-gray-800">{displayName}</span>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isIncreasingRisk ? (
              <TrendingUp className={`w-4 h-4 ${impactColor}`} />
            ) : (
              <TrendingDown className={`w-4 h-4 ${impactColor}`} />
            )}
            <span className={`text-xs font-bold ${impactColor}`}>
              {isIncreasingRisk ? 'Increases' : 'Decreases'} Risk
            </span>
          </div>
        </div>

        {/* Importance Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Importance</span>
            <span className="font-medium text-gray-700">{(importance * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${
                isIncreasingRisk 
                  ? 'bg-gradient-to-r from-red-400 to-red-600' 
                  : 'bg-gradient-to-r from-green-400 to-green-600'
              }`}
              style={{ width: `${Math.min(importance * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Current Value */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-600">Current Value:</span>
          <span className="text-sm font-bold text-gray-800">{formatValue(name, value)}</span>
        </div>
      </div>

      {/* Expanded Explanation */}
      {isExpanded && (
        <div className="p-3 bg-white border-t">
          <div className="text-sm text-gray-700 space-y-2">
            <p className="font-medium text-gray-800">What this means:</p>
            <p className="text-xs leading-relaxed">{explanation.description}</p>
            
            {explanation.recommendation && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs font-medium text-blue-900 mb-1">💡 Recommendation:</p>
                <p className="text-xs text-blue-800">{explanation.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Calculate feature contribution to risk
 * Positive = increases risk, Negative = decreases risk
 */
function calculateContribution(featureName, value, importance, riskScore) {
  // Simple heuristic: features with low "good" values increase risk
  const riskFactors = {
    'attendance_rate': value < 0.75 ? 1 : -1,
    'avg_marks_percentage': value < 50 ? 1 : -1,
    'behavior_score': value < 60 ? 1 : -1,
    'days_present': value < 30 ? 1 : -1,
    'days_absent': value > 10 ? 1 : -1,
    'negative_incidents': value > 2 ? 1 : -1,
    'positive_incidents': value < 2 ? 1 : -1,
    'exams_completed': value < 3 ? 1 : -1
  };

  const direction = riskFactors[featureName] || 0;
  return direction * importance * riskScore;
}

/**
 * Format feature name for display
 */
function formatFeatureName(name) {
  const nameMap = {
    'attendance_rate': 'Attendance Rate',
    'avg_marks_percentage': 'Average Marks',
    'behavior_score': 'Behavior Score',
    'days_tracked': 'Days Tracked',
    'exams_completed': 'Exams Completed',
    'days_present': 'Days Present',
    'days_absent': 'Days Absent',
    'total_incidents': 'Total Incidents',
    'positive_incidents': 'Positive Behaviors',
    'negative_incidents': 'Negative Behaviors'
  };

  return nameMap[name] || name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Format value for display
 */
function formatValue(name, value) {
  if (name.includes('rate') || name.includes('percentage')) {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (name.includes('score')) {
    return `${value.toFixed(1)}/100`;
  }
  return Math.round(value).toString();
}

/**
 * Get detailed explanation for each feature
 */
function getFeatureExplanation(name, value, contribution) {
  const isRisk = contribution > 0;

  const explanations = {
    'attendance_rate': {
      description: isRisk
        ? `Attendance rate of ${(value * 100).toFixed(1)}% is below the healthy threshold of 75%. Poor attendance is strongly correlated with dropout risk as students miss critical learning opportunities and fall behind academically.`
        : `Attendance rate of ${(value * 100).toFixed(1)}% is good. Regular attendance indicates engagement and commitment to learning, which are protective factors against dropout.`,
      recommendation: isRisk
        ? 'Implement attendance monitoring, parent communication, and identify barriers to attendance (transportation, health, family issues).'
        : 'Continue encouraging consistent attendance and recognize the student for their commitment.'
    },
    'avg_marks_percentage': {
      description: isRisk
        ? `Average marks of ${(value * 100).toFixed(1)}% indicate academic struggles. Students performing below 50% often lack foundational knowledge and may feel discouraged, increasing dropout risk.`
        : `Average marks of ${(value * 100).toFixed(1)}% show solid academic performance. Good grades build confidence and motivation to continue education.`,
      recommendation: isRisk
        ? 'Provide targeted tutoring, remedial classes, and personalized learning support. Identify specific subject weaknesses.'
        : 'Maintain academic support and consider advanced learning opportunities to keep the student engaged.'
    },
    'behavior_score': {
      description: isRisk
        ? `Behavior score of ${value.toFixed(1)}/100 suggests behavioral challenges. Negative behaviors often reflect underlying issues (stress, family problems, peer conflicts) that can lead to disengagement.`
        : `Behavior score of ${value.toFixed(1)}/100 indicates positive conduct. Good behavior reflects emotional well-being and social integration.`,
      recommendation: isRisk
        ? 'Implement behavior intervention plans, counseling support, and investigate root causes of behavioral issues.'
        : 'Continue positive reinforcement and maintain supportive classroom environment.'
    },
    'days_present': {
      description: isRisk
        ? `Only ${Math.round(value)} days present is concerning. Limited attendance means missed instruction, assignments, and social connections with peers and teachers.`
        : `${Math.round(value)} days present shows strong attendance. Consistent presence enables continuous learning and relationship building.`,
      recommendation: isRisk
        ? 'Work with family to address attendance barriers. Consider flexible scheduling or support services if needed.'
        : 'Acknowledge and reward consistent attendance to reinforce positive behavior.'
    },
    'days_absent': {
      description: isRisk
        ? `${Math.round(value)} days absent is high. Frequent absences create learning gaps and weaken connection to school community.`
        : `${Math.round(value)} days absent is within acceptable range. Minimal absences support continuous learning.`,
      recommendation: isRisk
        ? 'Investigate reasons for absences. Provide catch-up support and re-engagement strategies.'
        : 'Continue monitoring attendance and maintain open communication with family.'
    },
    'negative_incidents': {
      description: isRisk
        ? `${Math.round(value)} negative behavioral incidents indicate disciplinary concerns. Repeated negative behaviors can lead to suspension, disengagement, and dropout.`
        : `${Math.round(value)} negative incidents is low. Minimal behavioral issues suggest good self-regulation and social skills.`,
      recommendation: isRisk
        ? 'Implement restorative practices, counseling, and behavior modification strategies. Address underlying causes.'
        : 'Continue positive behavior support and maintain clear expectations.'
    },
    'positive_incidents': {
      description: isRisk
        ? `Only ${Math.round(value)} positive behavioral incidents recorded. Lack of recognition for positive behaviors may indicate low engagement or motivation.`
        : `${Math.round(value)} positive behavioral incidents show engagement and pro-social behavior. Recognition builds self-esteem and school connection.`,
      recommendation: isRisk
        ? 'Increase opportunities for positive recognition. Implement reward systems and celebrate small wins.'
        : 'Continue recognizing positive behaviors to reinforce engagement and motivation.'
    },
    'exams_completed': {
      description: isRisk
        ? `Only ${Math.round(value)} exams completed suggests inconsistent assessment participation. Missing exams prevents accurate academic evaluation and may indicate disengagement.`
        : `${Math.round(value)} exams completed shows consistent assessment participation. Regular evaluation enables timely academic support.`,
      recommendation: isRisk
        ? 'Ensure exam participation through reminders, flexible scheduling, and addressing test anxiety if present.'
        : 'Continue regular assessment and use results to guide personalized learning.'
    }
  };

  return explanations[name] || {
    description: `This factor has an importance of ${(contribution * 100).toFixed(1)}% in the prediction model.`,
    recommendation: 'Monitor this metric and consult with educational specialists for guidance.'
  };
}

export default ExplainableAI;
