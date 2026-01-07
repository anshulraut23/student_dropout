import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import ClassTable from '../../components/admin/classes/ClassTable';
import AddEditClassModal from '../../components/admin/classes/AddEditClassModal';

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const result = await adminService.getClasses();
    if (result.success) {
      setClasses(result.data);
    }
    setLoading(false);
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setModalOpen(true);
  };

  const handleEditClass = (classData) => {
    setSelectedClass(classData);
    setModalOpen(true);
  };

  const handleDeactivate = async (classId) => {
    if (window.confirm('Are you sure you want to deactivate this class?')) {
      const result = await adminService.deactivateClass(classId);
      if (result.success) {
        loadClasses();
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
    setModalOpen(false);
  };

  const handleSuccess = () => {
    loadClasses();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Class Management</h1>
            <p className="text-indigo-100 text-sm sm:text-base">Manage all classes in the system</p>
          </div>
          <button
            onClick={handleAddClass}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-md sm:rounded-lg font-medium shadow-md transition-colors"
          >
            <span className="text-lg">＋</span>
            <span className="text-sm sm:text-base">Add Class</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {[{
            label: 'Total Classes',
            value: classes.length,
            color: 'text-gray-900',
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            icon: '🏫'
          }, {
            label: 'Active Classes',
            value: classes.filter(c => c.status === 'active').length,
            color: 'text-blue-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-500',
            icon: '✅'
          }, {
            label: 'Total Students',
            value: classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-500',
            icon: '👥'
          }].map((stat, i) => (
            <div key={i} className={`${stat.bg} border-l-4 ${stat.border} rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1 sm:mb-2">{stat.label}</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${stat.color} truncate`}>{stat.value}</p>
                </div>
                <div className="text-2xl sm:text-3xl opacity-70 flex-shrink-0">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class List/Table */}
      <div className="max-w-7xl mx-auto">
        <ClassTable
          classes={classes}
          onEdit={handleEditClass}
          onDeactivate={handleDeactivate}
        />
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditClassModal
          classData={selectedClass}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default ClassManagement;
