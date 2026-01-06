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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Manage all classes in the system</p>
        </div>
        <button
          onClick={handleAddClass}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Class
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Classes</p>
          <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Active Classes</p>
          <p className="text-2xl font-bold text-blue-600">
            {classes.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-purple-600">
            {classes.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Class Table */}
      <ClassTable
        classes={classes}
        onEdit={handleEditClass}
        onDeactivate={handleDeactivate}
      />

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
