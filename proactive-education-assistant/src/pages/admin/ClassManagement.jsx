import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import ClassTable from '../../components/admin/classes/ClassTable';
import AddEditClassModal from '../../components/admin/classes/AddEditClassModal';
import { FaPlus, FaSchool, FaCheckCircle, FaUsers } from 'react-icons/fa';

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

  const stats = [
    {
      label: 'Total Classes',
      value: classes.length,
      icon: FaSchool,
      color: 'blue'
    },
    {
      label: 'Active Classes',
      value: classes.filter(c => c.status === 'active').length,
      icon: FaCheckCircle,
      color: 'green'
    },
    {
      label: 'Total Students',
      value: classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
      icon: FaUsers,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Class Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all classes in the system</p>
          </div>
          <button
            onClick={handleAddClass}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
          >
            <FaPlus className="text-xs" />
            Add Class
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-100',
              green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
              purple: 'bg-violet-50 text-violet-600 border-violet-100'
            };
            
            return (
              <div key={i} className={`bg-white border rounded-lg p-4 ${colorClasses[stat.color].split(' ')[2]}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[stat.color].split(' ').slice(0, 2).join(' ')}`}>
                    <Icon className="text-lg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Class Table */}
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
