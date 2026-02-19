import { useState, useEffect } from 'react';
import { approvalService } from '../../../services/approvalService';
import apiService from '../../../services/apiService';
import { FaTimes } from 'react-icons/fa';

function TeacherApprovalModal({ teacher, onClose, onSuccess }) {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const result = await apiService.getClasses();
        if (result.success) {
          // Filter to only show active classes without an incharge
          const availableClasses = (result.classes || []).filter(
            cls => cls.status === 'active' && !cls.teacherId
          );
          setClasses(availableClasses);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const result = await approvalService.approveTeacher(
        teacher.id, 
        selectedClassId ? [selectedClassId] : []
      );
      if (result.success) {
        alert('Teacher approved successfully!');
        onSuccess(); // Refresh data
        onClose(); // Close modal
      }
    } catch (error) {
      alert('Failed to approve teacher: ' + error.message);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setRejecting(true);
    try {
      const result = await approvalService.rejectTeacher(teacher.id, rejectionReason);
      if (result.success) {
        alert('Teacher rejected');
        onSuccess(); // Refresh data
        onClose(); // Close modal
      }
    } catch (error) {
      alert('Failed to reject teacher: ' + error.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Teacher Approval</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Teacher Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Teacher Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {teacher.name}</p>
              <p><span className="font-medium">Email:</span> {teacher.email}</p>
              <p><span className="font-medium">Subject:</span> {teacher.subject}</p>
              <p><span className="font-medium">Joined:</span> {teacher.joinedDate}</p>
            </div>
          </div>

          {!showRejectInput ? (
            <>
              {/* Class Assignment */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Assign as Class Incharge (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  You can assign this teacher as the incharge of a class. Only classes without an incharge are shown.
                </p>
                
                {loadingClasses ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : classes.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">
                      No available classes. All classes already have an incharge assigned.
                    </p>
                  </div>
                ) : (
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select a class (optional) --</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''} ({cls.academicYear})
                      </option>
                    ))}
                  </select>
                )}
                
                {selectedClassId && (
                  <p className="text-sm text-blue-600 mt-2">
                    Teacher will be assigned as incharge of the selected class
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Rejection Reason */
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Reason for Rejection</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="4"
                placeholder="Enter reason for rejection..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {!showRejectInput ? (
              <>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {approving ? 'Approving...' : 'Approve Teacher'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectionReason.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherApprovalModal;
