import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ModelPerformancePage = () => {
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState(null);

  useEffect(() => {
    fetchModelPerformance();
  }, []);

  const fetchModelPerformance = async () => {
    try {
      setLoading(true);
      const response = await apiService.getModelPerformance();
      
      if (response.success) {
        setPerformanceHistory(response.performance_history);
        if (response.performance_history.length > 0) {
          setLatestMetrics(response.performance_history[0]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    if (!window.confirm('Are you sure you want to retrain the model? This will take 1-2 minutes.')) {
      return;
    }

    try {
      setRetraining(true);
      setRetrainMessage({ type: 'info', text: 'Retraining model... This may take 1-2 minutes.' });
      
      const response = await apiService.retrainModel();
      
      if (response.success) {
        setRetrainMessage({
          type: 'success',
          text: `Model retrained successfully! Accuracy: ${(response.metrics.accuracy * 100).toFixed(2)}% (${response.improvement} improvement)`
        });
        
        // Refresh performance history
        setTimeout(() => {
          fetchModelPerformance();
          setRetrainMessage(null);
        }, 3000);
      } else {
        setRetrainMessage({
          type: 'error',
          text: response.message || 'Retraining failed'
        });
      }
    } catch (err) {
      setRetrainMessage({
        type: 'error',
        text: err.message || 'Failed to retrain model'
      });
    } finally {
      setRetraining(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading model performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!latestMetrics) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No model performance data available yet.</p>
          <p className="text-sm text-yellow-600 mt-2">Train the model first to see metrics.</p>
        </div>
      </div>
    );
  }

  const confusionMatrix = latestMetrics.confusion_matrix || {};
  const chartData = performanceHistory.map(item => ({
    date: formatDate(item.training_date),
    accuracy: item.accuracy,
    precision: item.precision_score,
    recall: item.recall_score,
    f1: item.f1_score
  })).reverse();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Retrain Button */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ML Model Performance</h1>
          <p className="text-gray-600 mt-2">Monitor dropout prediction model accuracy and metrics</p>
        </div>
        <button
          onClick={handleRetrain}
          disabled={retraining}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            retraining
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {retraining ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Retraining...
            </span>
          ) : (
            '🔄 Retrain Model'
          )}
        </button>
      </div>

      {/* Retrain Message */}
      {retrainMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          retrainMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          retrainMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <p className="font-semibold">{retrainMessage.text}</p>
        </div>
      )}

      {/* Latest Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">{formatPercentage(latestMetrics.accuracy)}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Precision</p>
              <p className="text-2xl font-bold text-green-600">{formatPercentage(latestMetrics.precision_score)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recall</p>
              <p className="text-2xl font-bold text-purple-600">{formatPercentage(latestMetrics.recall_score)}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">F1-Score</p>
              <p className="text-2xl font-bold text-orange-600">{formatPercentage(latestMetrics.f1_score)}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Latest Model Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Model Version</p>
            <p className="font-semibold">{latestMetrics.model_version}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Training Date</p>
            <p className="font-semibold">{formatDate(latestMetrics.training_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Training Samples</p>
            <p className="font-semibold">{latestMetrics.training_samples}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Test Samples</p>
            <p className="font-semibold">{latestMetrics.test_samples}</p>
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Confusion Matrix</h2>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">True Negatives</p>
            <p className="text-3xl font-bold text-green-700">{confusionMatrix.true_negatives || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Correctly predicted no dropout</p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">False Positives</p>
            <p className="text-3xl font-bold text-yellow-700">{confusionMatrix.false_positives || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Incorrectly predicted dropout</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">False Negatives</p>
            <p className="text-3xl font-bold text-red-700">{confusionMatrix.false_negatives || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Missed actual dropouts</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">True Positives</p>
            <p className="text-3xl font-bold text-blue-700">{confusionMatrix.true_positives || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Correctly predicted dropout</p>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip formatter={(value) => formatPercentage(value)} />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" name="Accuracy" />
              <Line type="monotone" dataKey="precision" stroke="#10B981" name="Precision" />
              <Line type="monotone" dataKey="recall" stroke="#8B5CF6" name="Recall" />
              <Line type="monotone" dataKey="f1" stroke="#F59E0B" name="F1-Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance History Table */}
      {performanceHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Training History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Samples
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recall
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    F1-Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceHistory.map((record, index) => (
                  <tr key={record.id} className={index === 0 ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.training_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.model_version}
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Latest
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.training_samples}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${
                        record.accuracy >= 0.80 ? 'text-green-600' :
                        record.accuracy >= 0.70 ? 'text-blue-600' :
                        record.accuracy >= 0.60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {formatPercentage(record.accuracy)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(record.precision_score)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(record.recall_score)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPercentage(record.f1_score)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {performanceHistory.length > 1 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Performance Comparison</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">First Training</p>
                  <p className="font-semibold text-gray-900">
                    {formatPercentage(performanceHistory[performanceHistory.length - 1].accuracy)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Latest Training</p>
                  <p className="font-semibold text-gray-900">
                    {formatPercentage(performanceHistory[0].accuracy)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Improvement</p>
                  <p className={`font-semibold ${
                    (performanceHistory[0].accuracy - performanceHistory[performanceHistory.length - 1].accuracy) > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {((performanceHistory[0].accuracy - performanceHistory[performanceHistory.length - 1].accuracy) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Trainings</p>
                  <p className="font-semibold text-gray-900">{performanceHistory.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelPerformancePage;
