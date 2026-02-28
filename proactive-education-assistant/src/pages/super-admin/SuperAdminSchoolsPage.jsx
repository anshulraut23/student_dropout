import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [pendingAdminRequests, setPendingAdminRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingAdminId, setProcessingAdminId] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [schoolsResponse, requestsResponse] = await Promise.all([
        apiService.getAllSchoolsSummary(),
        apiService.getPendingAdminRequests()
      ]);
      setSchools(schoolsResponse.schools || []);
      setPendingAdminRequests(requestsResponse.requests || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (school) => {
    try {
      setError('');
      await apiService.updateSchoolStatus(school.id, !school.isActive);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update school status');
    }
  };

  const handleAdminRequestAction = async (adminId, action) => {
    try {
      setError('');
      setProcessingAdminId(adminId);

      if (action === 'approve') {
        await apiService.approveAdminRequest(adminId);
      } else {
        await apiService.rejectAdminRequest(adminId);
      }

      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to process admin request');
    } finally {
      setProcessingAdminId('');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          <p className="text-sm text-gray-600">Review pending admin registrations and control school status</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Pending Admin Approval Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Admin</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">School</th>
                <th className="text-left px-4 py-2">Location</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAdminRequests.map((request) => (
                <tr key={request.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">{request.fullName}</td>
                  <td className="px-4 py-2">{request.email}</td>
                  <td className="px-4 py-2">{request.schoolName || '-'}</td>
                  <td className="px-4 py-2">{[request.schoolCity, request.schoolState].filter(Boolean).join(', ') || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdminRequestAction(request.id, 'approve')}
                        disabled={processingAdminId === request.id}
                        className="px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAdminRequestAction(request.id, 'reject')}
                        disabled={processingAdminId === request.id}
                        className="px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pendingAdminRequests.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No pending admin requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">All Schools</h2>
        </div>
        {loading ? (
          <div className="p-4 text-gray-600">Loading schools...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">School</th>
                  <th className="text-left px-4 py-2">City</th>
                  <th className="text-left px-4 py-2">Students</th>
                  <th className="text-left px-4 py-2">Teachers</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium text-gray-900">{school.name}</td>
                    <td className="px-4 py-2">{school.city || '-'}</td>
                    <td className="px-4 py-2">{school.studentsCount}</td>
                    <td className="px-4 py-2">{school.teachersCount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${school.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {school.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(school)}
                        className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                      >
                        {school.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!schools.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No schools available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
