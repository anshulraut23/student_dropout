import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import TeacherTable from '../../components/admin/teachers/TeacherTable';
import TeacherApprovalModal from '../../components/admin/teachers/TeacherApprovalModal';
import AssignClassModal from '../../components/admin/teachers/AssignClassModal';
import DebugPanel from '../../components/admin/DebugPanel';

function TeacherManagement() {
  const { teachers, classes, loading, refreshTeachers } = useAdmin();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalType, setModalType] = useState(null); // 'approval' or 'assign'
  const [showDebug, setShowDebug] = useState(false);

  const handleApproval = (teacher) => {
    setSelectedTeacher(teacher);
    setModalType('approval');
  };

  const handleAssignClasses = (teacher) => {
    setSelectedTeacher(teacher);
    setModalType('assign');
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setModalType(null);
  };

  const handleRefresh = () => {
    refreshTeachers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Teacher Management</h1>
            <p className="text-sm text-gray-500 mt-1">Approve teachers and assign classes</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {showDebug ? 'Hide' : 'Show'} Debug
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && <DebugPanel />}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-blue-500">
            <p className="text-xs text-gray-500 font-medium mb-1">Total Teachers</p>
            <p className="text-2xl font-semibold text-gray-900">{teachers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-amber-500">
            <p className="text-xs text-gray-500 font-medium mb-1">Pending Approvals</p>
            <p className="text-2xl font-semibold text-amber-600">
              {teachers.filter(t => t.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-emerald-500">
            <p className="text-xs text-gray-500 font-medium mb-1">Approved Teachers</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {teachers.filter(t => t.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Teacher Table */}
        <TeacherTable
          teachers={teachers}
          onApprove={handleApproval}
          onAssignClasses={handleAssignClasses}
        />

        {/* Modals */}
        {modalType === 'approval' && selectedTeacher && (
          <TeacherApprovalModal
            teacher={selectedTeacher}
            classes={classes}
            onClose={handleCloseModal}
            onSuccess={handleRefresh}
          />
        )}

        {modalType === 'assign' && selectedTeacher && (
          <AssignClassModal
            teacher={selectedTeacher}
            classes={classes}
            onClose={handleCloseModal}
            onSuccess={handleRefresh}
          />
        )}
      </div>
    </div>
  );
}

export default TeacherManagement;
