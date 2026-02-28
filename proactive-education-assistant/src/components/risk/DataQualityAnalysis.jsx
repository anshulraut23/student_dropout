import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

/**
 * Data Quality Analysis Component
 * Analyzes attendance patterns, detects bulk uploads, identifies inconsistencies
 * Provides numerical insights about data quality
 */
const DataQualityAnalysis = ({ features, attendanceData }) => {
  // Calculate data quality metrics
  const qualityMetrics = analyzeDataQuality(features, attendanceData);
  
  const getQualityColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-600' };
    if (score >= 60) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: 'text-yellow-600' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-600' };
  };
  
  const colors = getQualityColor(qualityMetrics.overallScore);
  
  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <BarChart3 className={`w-6 h-6 ${colors.icon} mt-1`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${colors.text}`}>Data Quality Analysis</h4>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${colors.text}`}>Quality Score:</span>
              <span className={`font-bold text-lg ${colors.text}`}>{qualityMetrics.overallScore}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Attendance Consistency */}
            <QualityMetric
              icon={<Calendar className="w-4 h-4" />}
              label="Attendance Consistency"
              value={qualityMetrics.attendanceConsistency}
              description={qualityMetrics.attendanceDescription}
              status={qualityMetrics.attendanceStatus}
            />
            
            {/* Data Completeness */}
            <QualityMetric
              icon={<CheckCircle className="w-4 h-4" />}
              label="Data Completeness"
              value={qualityMetrics.completeness}
              description={qualityMetrics.completenessDescription}
              status={qualityMetrics.completenessStatus}
            />
            
            {/* Bulk Upload Detection */}
            {qualityMetrics.bulkUploadDetected && (
              <QualityMetric
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Bulk Upload Detected"
                value={qualityMetrics.bulkUploadPercentage}
                description={qualityMetrics.bulkUploadDescription}
                status="warning"
              />
            )}
            
            {/* Data Gaps */}
            {qualityMetrics.hasGaps && (
              <QualityMetric
                icon={<AlertCircle className="w-4 h-4" />}
                label="Data Gaps Found"
                value={qualityMetrics.gapCount}
                description={qualityMetrics.gapDescription}
                status="warning"
              />
            )}
            
            {/* Prediction Reliability */}
            <QualityMetric
              icon={<TrendingUp className="w-4 h-4" />}
              label="Prediction Reliability"
              value={qualityMetrics.reliability}
              description={qualityMetrics.reliabilityDescription}
              status={qualityMetrics.reliabilityStatus}
            />
          </div>
          
          {/* Recommendations */}
          {qualityMetrics.recommendations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-current opacity-30">
              <p className={`text-xs font-semibold ${colors.text} mb-2`}>Recommendations:</p>
              <ul className="space-y-1">
                {qualityMetrics.recommendations.map((rec, idx) => (
                  <li key={idx} className={`text-xs ${colors.text} flex items-start gap-1`}>
                    <span>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QualityMetric = ({ icon, label, value, description, status }) => {
  const statusColors = {
    good: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700'
  };
  
  return (
    <div className="flex items-start gap-2">
      <div className={`mt-0.5 ${statusColors[status]}`}>{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className={`text-sm font-semibold ${statusColors[status]}`}>
            {typeof value === 'number' ? `${value}%` : value}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

/**
 * Analyze data quality and detect issues
 */
function analyzeDataQuality(features, attendanceData) {
  const metrics = {
    overallScore: 0,
    attendanceConsistency: 0,
    attendanceDescription: '',
    attendanceStatus: 'good',
    completeness: 0,
    completenessDescription: '',
    completenessStatus: 'good',
    bulkUploadDetected: false,
    bulkUploadPercentage: 0,
    bulkUploadDescription: '',
    hasGaps: false,
    gapCount: 0,
    gapDescription: '',
    reliability: 0,
    reliabilityDescription: '',
    reliabilityStatus: 'good',
    recommendations: []
  };
  
  if (!features) return metrics;
  
  const daysTracked = features.days_tracked || 0;
  const daysPresent = features.days_present || 0;
  const daysAbsent = features.days_absent || 0;
  const examsCompleted = features.exams_completed || 0;
  
  // 1. Attendance Consistency Analysis
  const totalRecords = daysPresent + daysAbsent;
  const expectedDays = Math.max(daysTracked, totalRecords);
  
  if (expectedDays > 0) {
    const consistencyRatio = (totalRecords / expectedDays) * 100;
    metrics.attendanceConsistency = Math.round(consistencyRatio);
    
    if (consistencyRatio >= 90) {
      metrics.attendanceDescription = `Excellent: ${totalRecords} of ${expectedDays} days recorded`;
      metrics.attendanceStatus = 'good';
    } else if (consistencyRatio >= 70) {
      metrics.attendanceDescription = `Good: ${totalRecords} of ${expectedDays} days recorded, ${expectedDays - totalRecords} days missing`;
      metrics.attendanceStatus = 'warning';
      metrics.recommendations.push('Record attendance daily for better predictions');
    } else {
      metrics.attendanceDescription = `Poor: Only ${totalRecords} of ${expectedDays} days recorded, ${expectedDays - totalRecords} days missing`;
      metrics.attendanceStatus = 'error';
      metrics.recommendations.push('Significant attendance gaps detected - record daily attendance');
    }
  }
  
  // 2. Data Completeness
  const hasAttendance = totalRecords >= 3;
  const hasExams = examsCompleted >= 1;
  const hasBehavior = (features.total_incidents || 0) > 0;
  
  let completenessCount = 0;
  if (hasAttendance) completenessCount++;
  if (hasExams) completenessCount++;
  if (hasBehavior) completenessCount++;
  
  metrics.completeness = Math.round((completenessCount / 3) * 100);
  
  const missingData = [];
  if (!hasAttendance) missingData.push('attendance');
  if (!hasExams) missingData.push('exam marks');
  if (!hasBehavior) missingData.push('behavior records');
  
  if (completenessCount === 3) {
    metrics.completenessDescription = 'All data types available (attendance, exams, behavior)';
    metrics.completenessStatus = 'good';
  } else {
    metrics.completenessDescription = `Missing: ${missingData.join(', ')}`;
    metrics.completenessStatus = completenessCount >= 2 ? 'warning' : 'error';
    metrics.recommendations.push(`Add ${missingData.join(' and ')} data for better accuracy`);
  }
  
  // 3. Bulk Upload Detection
  if (attendanceData && Array.isArray(attendanceData)) {
    const bulkUploads = detectBulkUploads(attendanceData);
    if (bulkUploads.detected) {
      metrics.bulkUploadDetected = true;
      metrics.bulkUploadPercentage = bulkUploads.percentage;
      metrics.bulkUploadDescription = `${bulkUploads.count} bulk uploads detected (${bulkUploads.percentage}% of records)`;
      
      if (bulkUploads.percentage > 50) {
        metrics.recommendations.push('High bulk upload ratio may affect prediction accuracy');
      }
    }
  }
  
  // 4. Data Gaps Detection
  if (attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0) {
    const gaps = detectDataGaps(attendanceData);
    if (gaps.count > 0) {
      metrics.hasGaps = true;
      metrics.gapCount = gaps.count;
      metrics.gapDescription = `${gaps.count} gap(s) found, longest gap: ${gaps.longestGap} days`;
      
      if (gaps.longestGap > 7) {
        metrics.recommendations.push(`Large ${gaps.longestGap}-day gap detected - maintain consistent records`);
      }
    }
  }
  
  // 5. Prediction Reliability
  let reliabilityScore = 0;
  
  // Base score from data quantity
  if (totalRecords >= 30) reliabilityScore += 40;
  else if (totalRecords >= 14) reliabilityScore += 30;
  else if (totalRecords >= 7) reliabilityScore += 20;
  else reliabilityScore += 10;
  
  // Consistency bonus
  if (metrics.attendanceConsistency >= 90) reliabilityScore += 30;
  else if (metrics.attendanceConsistency >= 70) reliabilityScore += 20;
  else reliabilityScore += 10;
  
  // Completeness bonus
  reliabilityScore += (completenessCount * 10);
  
  // Penalty for bulk uploads
  if (metrics.bulkUploadDetected && metrics.bulkUploadPercentage > 50) {
    reliabilityScore -= 15;
  }
  
  // Penalty for gaps
  if (metrics.hasGaps && metrics.gapCount > 3) {
    reliabilityScore -= 10;
  }
  
  metrics.reliability = Math.max(0, Math.min(100, reliabilityScore));
  
  if (metrics.reliability >= 80) {
    metrics.reliabilityDescription = `High confidence: ${totalRecords} days tracked with ${metrics.attendanceConsistency}% consistency`;
    metrics.reliabilityStatus = 'good';
  } else if (metrics.reliability >= 60) {
    metrics.reliabilityDescription = `Moderate confidence: More consistent data needed`;
    metrics.reliabilityStatus = 'warning';
  } else {
    metrics.reliabilityDescription = `Low confidence: Insufficient or inconsistent data`;
    metrics.reliabilityStatus = 'error';
    metrics.recommendations.push('Collect more consistent data for reliable predictions');
  }
  
  // Calculate overall score
  metrics.overallScore = Math.round(
    (metrics.attendanceConsistency * 0.3) +
    (metrics.completeness * 0.3) +
    (metrics.reliability * 0.4)
  );
  
  return metrics;
}

/**
 * Detect bulk uploads by analyzing timestamp patterns
 */
function detectBulkUploads(attendanceData) {
  if (!attendanceData || attendanceData.length < 5) {
    return { detected: false, count: 0, percentage: 0 };
  }
  
  // Group by created_at timestamp (same minute = bulk upload)
  const timestampGroups = {};
  
  attendanceData.forEach(record => {
    if (record.created_at) {
      // Round to nearest minute
      const timestamp = new Date(record.created_at);
      const minuteKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}-${timestamp.getMinutes()}`;
      
      if (!timestampGroups[minuteKey]) {
        timestampGroups[minuteKey] = [];
      }
      timestampGroups[minuteKey].push(record);
    }
  });
  
  // Count bulk uploads (more than 3 records in same minute)
  let bulkUploadCount = 0;
  Object.values(timestampGroups).forEach(group => {
    if (group.length > 3) {
      bulkUploadCount += group.length;
    }
  });
  
  const percentage = Math.round((bulkUploadCount / attendanceData.length) * 100);
  
  return {
    detected: bulkUploadCount > 0,
    count: Object.values(timestampGroups).filter(g => g.length > 3).length,
    percentage,
    totalRecords: attendanceData.length
  };
}

/**
 * Detect gaps in attendance data
 */
function detectDataGaps(attendanceData) {
  if (!attendanceData || attendanceData.length < 2) {
    return { count: 0, longestGap: 0, gaps: [] };
  }
  
  // Sort by date
  const sorted = [...attendanceData]
    .filter(r => r.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (sorted.length < 2) {
    return { count: 0, longestGap: 0, gaps: [] };
  }
  
  const gaps = [];
  let longestGap = 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
    
    // Gap if more than 3 days between records (accounting for weekends)
    if (daysDiff > 3) {
      gaps.push({ start: prevDate, end: currDate, days: daysDiff });
      longestGap = Math.max(longestGap, daysDiff);
    }
  }
  
  return {
    count: gaps.length,
    longestGap,
    gaps
  };
}

export default DataQualityAnalysis;
