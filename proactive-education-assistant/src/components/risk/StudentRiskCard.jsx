import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Info } from 'lucide-react';
import apiService from '../../services/apiService';
import ExplainableAI from './ExplainableAI';
import PlainLanguageSummary from './PlainLanguageSummary';
import DataQualityAnalysis from './DataQualityAnalysis';
import ExplainableAIInsights from './ExplainableAIInsights';

/**
 * Student Risk Card Component
 * Displays individual student dropout risk with AI recommendations
 * Can work in two modes:
 * 1. Pass studentId - component will fetch data itself
 * 2. Pass data - component will use provided data
 */
const StudentRiskCard = ({ studentId, data: providedData }) => {
  const [riskData, setRiskData] = useState(providedData || null);
  const [loading, setLoading] = useState(!providedData && !!studentId);
  const [error, setError] = useState(null);
  const [insufficientData, setInsufficientData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [dataQualityScore, setDataQualityScore] = useState(null);

  useEffect(() => {
    // If data is provided, use it directly
    if (providedData) {
      // Check if it's insufficient data
      if (providedData.insufficientData === true) {
        setInsufficientData({
          message: 'Insufficient data for prediction',
          requirements: {
            attendance: 3, // HACKATHON: Changed from 14
            exams: 1
          }
        });
        setRiskData(null);
        setError(null);
      } else {
        setRiskData(providedData);
        setInsufficientData(null);
        setError(null);
      }
      setLoading(false);
      return;
    }

    // Otherwise fetch data if studentId is provided
    if (studentId) {
      loadRiskData();
    }
  }, [studentId, providedData]);

  const loadRiskData = async () => {
    try {
      setLoading(true);
      setError(null);
      setInsufficientData(null);
      setRiskData(null);
      
      // Load attendance data first for quality analysis
      await loadAttendanceAndMarks();
      
      const response = await apiService.getStudentRiskPrediction(studentId);
      setRiskData(response);
      setInsufficientData(null);
      setError(null);
    } catch (err) {
      // Check if it's an insufficient data error (400 status)
      if (err.message?.includes('Insufficient data') || err.message?.includes('data_tier')) {
        // Extract days and exams from error response
        let daysMarked = 0;
        let examsCompleted = 0;
        
        if (err.response?.data?.missing) {
          daysMarked = err.response.data.missing.current_days || 0;
          examsCompleted = err.response.data.missing.current_exams || 0;
        }
        
        setInsufficientData({
          message: err.message || 'Insufficient data for prediction',
          daysMarked,
          examsCompleted,
          requirements: {
            attendance: 3,
            exams: 1
          }
        });
        setRiskData(null);
        setError(null);
        
        // Load attendance and marks data to show details
        loadAttendanceAndMarks();
      } else {
        setError(err.message || 'Failed to load risk data');
        setInsufficientData(null);
        setRiskData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceAndMarks = async () => {
    try {
      // Load attendance data
      const attendance = await apiService.getStudentAttendance(studentId);
      setAttendanceData(attendance);
      
      // Load marks data
      const marks = await apiService.getStudentMarks(studentId);
      setMarksData(marks);
    } catch (error) {
      console.error('Failed to load attendance/marks:', error);
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

  // Insufficient Data State - Show attendance and exam data
  if (insufficientData) {
    const daysMarked = insufficientData.daysMarked || 0;
    const examsCompleted = insufficientData.examsCompleted || 0;
    const daysNeeded = Math.max(0, 3 - daysMarked);
    const examsNeeded = Math.max(0, 1 - examsCompleted);
    
    // Check which requirements are met
    const hasEnoughAttendance = daysMarked >= 3;
    const hasEnoughExams = examsCompleted >= 1;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="text-lg font-bold text-yellow-900">Insufficient Data for Prediction</h3>
              <p className="text-sm text-yellow-800 mt-1">
                Both attendance and exam data are required for risk predictions.
              </p>
            </div>
          </div>
        </div>

        {/* Body - Requirements Status */}
        <div className="p-6 space-y-6">
          {/* Attendance Requirement */}
          <div className={`border-2 rounded-lg p-4 ${
            hasEnoughAttendance 
              ? 'border-green-300 bg-green-50' 
              : 'border-orange-300 bg-orange-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {hasEnoughAttendance ? '✅' : '📅'}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${
                  hasEnoughAttendance ? 'text-green-900' : 'text-orange-900'
                }`}>
                  Attendance Requirement
                </h4>
                {hasEnoughAttendance ? (
                  <p className="text-sm text-green-800">
                    ✓ You have marked attendance for <strong>{daysMarked} days</strong> (Requirement: 3 days)
                  </p>
                ) : (
                  <div className="text-sm text-orange-800">
                    <p className="mb-1">
                      ✗ You have marked attendance for <strong>{daysMarked} day{daysMarked !== 1 ? 's' : ''}</strong>
                    </p>
                    <p className="font-semibold">
                      Please mark <strong>{daysNeeded} more day{daysNeeded !== 1 ? 's' : ''}</strong> of attendance (Need 3 days total)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Requirement */}
          <div className={`border-2 rounded-lg p-4 ${
            hasEnoughExams 
              ? 'border-green-300 bg-green-50' 
              : 'border-orange-300 bg-orange-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {hasEnoughExams ? '✅' : '📝'}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${
                  hasEnoughExams ? 'text-green-900' : 'text-orange-900'
                }`}>
                  Exam Requirement
                </h4>
                {hasEnoughExams ? (
                  <p className="text-sm text-green-800">
                    ✓ You have entered <strong>{examsCompleted} exam{examsCompleted !== 1 ? 's' : ''}</strong> (Requirement: 1 exam)
                  </p>
                ) : (
                  <div className="text-sm text-orange-800">
                    <p className="mb-1">
                      ✗ You have entered <strong>{examsCompleted} exam{examsCompleted !== 1 ? 's' : ''}</strong>
                    </p>
                    <p className="font-semibold">
                      Please enter <strong>{examsNeeded} exam score{examsNeeded !== 1 ? 's' : ''}</strong> (Need 1 exam total)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attendance Data Details */}
          {attendanceData && attendanceData.records && attendanceData.records.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>📊</span> Attendance Records ({daysMarked} days)
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Date</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.records.slice(0, 10).map((record, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="px-4 py-2 text-gray-700">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              record.status === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Marks Data Details */}
          {marksData && marksData.marks && marksData.marks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>📊</span> Exam Records ({examsCompleted} exams)
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Exam</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600">Marks</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marksData.marks.slice(0, 10).map((mark, idx) => {
                        const percentage = mark.totalMarks > 0 
                          ? Math.round((mark.marksObtained / mark.totalMarks) * 100)
                          : 0;
                        return (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-4 py-2 text-gray-700">{mark.examName || 'Exam'}</td>
                            <td className="px-4 py-2 text-center text-gray-700">
                              {mark.marksObtained}/{mark.totalMarks}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                percentage >= 75 
                                  ? 'bg-green-100 text-green-800'
                                  : percentage >= 50
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-2">Summary</p>
                <p className="text-sm text-blue-800">
                  {hasEnoughAttendance && hasEnoughExams && (
                    "Both requirements are met! Predictions should be available."
                  )}
                  {hasEnoughAttendance && !hasEnoughExams && (
                    `Attendance requirement met ✓ | Still need ${examsNeeded} exam score${examsNeeded !== 1 ? 's' : ''}`
                  )}
                  {!hasEnoughAttendance && hasEnoughExams && (
                    `Exam requirement met ✓ | Still need ${daysNeeded} day${daysNeeded !== 1 ? 's' : ''} of attendance`
                  )}
                  {!hasEnoughAttendance && !hasEnoughExams && (
                    `Need ${daysNeeded} more day${daysNeeded !== 1 ? 's' : ''} of attendance AND ${examsNeeded} exam score${examsNeeded !== 1 ? 's' : ''}`
                  )}
                </p>
              </div>
            </div>
          </div>
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

  const { prediction, components, explanation, recommendations, priority_actions, feature_importance, features } = riskData;
  
  // Safety check - if prediction is missing, treat as insufficient data
  if (!prediction || !prediction.risk_level) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">Unable to load risk prediction data</p>
        </div>
      </div>
    );
  }
  
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
        {/* Plain Language Summary - First and Most Prominent */}
        <PlainLanguageSummary
          features={features}
          prediction={prediction}
          riskLevel={riskLevel}
        />

        {/* AI Explanation Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-1">🤖</div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">AI Analysis</h4>
              <div className="text-blue-900 text-sm leading-relaxed">
                {Array.isArray(explanation) ? (
                  <ul className="space-y-2">
                    {explanation.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{explanation}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Explainable AI Section */}
        {feature_importance && Object.keys(feature_importance).length > 0 && (
          <ExplainableAI
            featureImportance={feature_importance}
            features={features}
            riskScore={prediction.risk_score}
            riskLevel={riskLevel}
          />
        )}

        {/* Data Quality Analysis */}
        <DataQualityAnalysis 
          features={features}
          attendanceData={attendanceData}
        />

        {/* Explainable AI Insights */}
        <ExplainableAIInsights
          features={features}
          prediction={prediction}
          dataQualityScore={dataQualityScore}
        />

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
