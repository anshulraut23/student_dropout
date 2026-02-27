import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import apiService from '../../services/apiService';

/**
 * Class Risk Table Component
 * Displays risk predictions for all students in a class
 */
const ClassRiskTable = ({ classId }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (classId) {
      loadClassRisk();
    }
  }, [classId]);

  const loadClassRisk = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/ml/risk/class/${classId}`);
      setPredictions(response.predictions || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load class risk data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'risk_level') {
      const levelOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      aVal = levelOrder[a.risk_level];
      bVal = levelOrder[b.risk_level];
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const exportToCSV = () => {
    const headers = ['Student Name', 'Risk Level', 'Risk Score', 'Confidence', 'Data Tier'];
    const rows = sortedPredictions.map(p => [
      p.student_name,
      p.risk_level,
      (p.risk_score * 100).toFixed(1),
      p.confidence,
      p.data_tier
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-risk-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <p className="text-yellow-800">
          No risk predictions available. Students need at least 3 days of attendance and 1 completed exam.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Class Risk Analysis</h3>
          <p className="text-sm text-gray-600 mt-1">
            {predictions.length} student{predictions.length !== 1 ? 's' : ''} analyzed
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('student_name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              >
                Student Name {sortBy === 'student_name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('risk_level')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              >
                Risk Level {sortBy === 'risk_level' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('risk_score')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              >
                Risk Score {sortBy === 'risk_score' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('confidence')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
              >
                Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data Tier
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPredictions.map((prediction) => (
              <tr key={prediction.student_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {prediction.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskLevelBadge level={prediction.risk_level} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(prediction.risk_score * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {prediction.confidence}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Tier {prediction.data_tier}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RiskLevelBadge = ({ level }) => {
  const styles = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>
      {level.toUpperCase()}
    </span>
  );
};

export default ClassRiskTable;
