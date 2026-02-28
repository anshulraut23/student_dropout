import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const DropoutManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dropoutStatus: 'active',
    dropoutDate: '',
    dropoutReason: '',
    dropoutNotes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, statsRes] = await Promise.all([
        apiService.getStudents(),
        apiService.getDropoutStatistics()
      ]);
      
      // Handle different response structures
      const studentsData = Array.isArray(studentsRes) ? studentsRes : (studentsRes.students || []);
      const statsData = statsRes.statistics || statsRes;
      
      setStudents(studentsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await apiService.updateDropoutStatus({
        studentId: selectedStudent.id,
        ...formData
      });
      
      setShowModal(false);
      setSelectedStudent(null);
      setFormData({
        dropoutStatus: 'active',
        dropoutDate: '',
        dropoutReason: '',
        dropoutNotes: ''
      });
      
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update student status');
    }
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      dropoutStatus: student.dropout_status || 'active',
      dropoutDate: student.dropout_date || '',
      dropoutReason: student.dropout_reason || '',
      dropoutNotes: student.dropout_notes || ''
    });
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      dropped_out: 'bg-red-100 text-red-800',
      graduated: 'bg-blue-100 text-blue-800',
      transferred: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Active',
      dropped_out: 'Dropped Out',
      graduated: 'Graduated',
      transferred: 'Transferred'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dropout Management</h1>
        <p className="text-gray-600 mt-2">Track and manage student dropout outcomes</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.total_students}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{statistics.by_status.active || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Dropped Out</p>
            <p className="text-2xl font-bold text-red-600">{statistics.by_status.dropped_out || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Dropout Rate</p>
            <p className="text-2xl font-bold text-orange-600">{statistics.dropout_rate}%</p>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Students</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropout Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(students) && students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.roll_number || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.class_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.dropout_status || 'active')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.dropout_date ? new Date(student.dropout_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openModal(student)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Update Student Status</h3>
            <p className="text-gray-600 mb-4">Student: {selectedStudent.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.dropoutStatus}
                  onChange={(e) => setFormData({...formData, dropoutStatus: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="dropped_out">Dropped Out</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>
              
              {formData.dropoutStatus !== 'active' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.dropoutDate}
                      onChange={(e) => setFormData({...formData, dropoutDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <input
                      type="text"
                      value={formData.dropoutReason}
                      onChange={(e) => setFormData({...formData, dropoutReason: e.target.value})}
                      placeholder="e.g., Financial issues, Family relocation"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.dropoutNotes}
                      onChange={(e) => setFormData({...formData, dropoutNotes: e.target.value})}
                      placeholder="Additional details..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropoutManagementPage;
