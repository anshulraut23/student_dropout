import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Info } from 'lucide-react';
import apiService from '../../services/apiService';

/**
 * Student Risk Card Component
 * Displays individual student dropout risk with AI recommendations
 */
const StudentRiskCard = ({ studentId }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (studentId) {
      loadRiskData();
    }
  }, [studentId]);

  const loadRiskData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/ml/risk/${studentId}`);
      setRiskData(response);
      setError(null);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Insufficient data for prediction');
      } else {
        setError(err.message || 'Failed to load risk data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!riskData) return null;

  const { prediction, components, explanation, recommendations, priority_actions } = riskData;
  const riskLevel = prediction.risk_level;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${getRiskHeaderColor(riskLevel)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getRiskIcon(riskLevel)}
            <div>
              <h3 className="text-xl font-bold text-white">
                {riskLevel.toUpperCase()} RISK
              </h3>
              <p className="text-white opacity-90 text-sm">
                Risk Score: {(prediction.risk_score * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm opacity-90">Confidence</p>
            <p className="text-white font-semibold capitalize">{prediction.confidence}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* AI Explanation */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Analysis</h4>
          <p className="text-gray-600">{explanation}</p>
        </div>

        {/* Component Scores */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Risk Breakdown</h4>
          <div className="space-y-2">
            <RiskBar
              label="Attendance Risk"
              value={components.attendance_risk}
              color="blue"
            />
            <RiskBar
              label="Academic Risk"
              value={components.academic_risk}
              color="purple"
            />
            <RiskBar
              label="Behavior Risk"
              value={components.behavior_risk}
              color="orange"
            />
          </div>
        </div>

        {/* Priority Actions */}
        {priority_actions && priority_actions.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Priority Actions
            </h4>
            <ul className="space-y-1">
              {priority_actions.map((action, idx) => (
                <li key={idx} className="text-red-700 text-sm">
                  • {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
            >
              {showDetails ? 'Hide' : 'Show'} All Recommendations
              <span className="text-xs">({recommendations.length})</span>
            </button>
            
            {showDetails && (
              <ul className="mt-3 space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RiskBar = ({ label, value, color }) => {
  const percentage = (value * 100).toFixed(0);
  
  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-600 font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const getRiskHeaderColor = (level) => {
  const colors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-600',
    high: 'bg-orange-600',
    critical: 'bg-red-600'
  };
  return colors[level] || 'bg-gray-600';
};

const getRiskIcon = (level) => {
  const iconClass = "w-8 h-8 text-white";
  
  switch (level) {
    case 'low':
      return <CheckCircle className={iconClass} />;
    case 'medium':
      return <TrendingUp className={iconClass} />;
    case 'high':
    case 'critical':
      return <AlertTriangle className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
};

export default StudentRiskCard;
