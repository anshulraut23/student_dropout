import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

function ApprovalDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getPendingRequests();
      if (response.success) {
        setPendingRequests(response.requests || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId) => {
    setProcessingId(teacherId);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await apiService.approveTeacher(teacherId, []);
      if (response.success) {
        setSuccessMessage(`Teacher ${response.user.fullName} approved successfully!`);
        // Remove from pending list
        setPendingRequests(prev => prev.filter(req => req.teacherId !== teacherId));
      }
    } catch (err) {
      setError(err.message || 'Failed to approve teacher');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (teacherId) => {
    if (!confirm('Are you sure you want to reject this teacher request?')) {
      return;
    }

    setProcessingId(teacherId);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await apiService.rejectTeacher(teacherId);
      if (response.success) {
        setSuccessMessage(`Teacher request rejected.`);
        // Remove from pending list
        setPendingRequests(prev => prev.filter(req => req.teacherId !== teacherId));
      }
    } catch (err) {
      setError(err.message || 'Failed to reject teacher');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Approval Requests</h1>
        <p className="text-gray-600">Review and approve or reject teacher registration requests</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="mt-2 text-gray-600">All teacher requests have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingRequests.map((request) => (
            <div key={request.teacherId} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {request.teacherName}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {request.teacherEmail}
                    </p>
                    <p className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Requested: {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() => handleApprove(request.teacherId)}
                    disabled={processingId === request.teacherId}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === request.teacherId ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(request.teacherId)}
                    disabled={processingId === request.teacherId}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === request.teacherId ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApprovalDashboard;
