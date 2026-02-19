import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import SubjectTable from '../../components/admin/subjects/SubjectTable';
import AddEditSubjectModal from '../../components/admin/subjects/AddEditSubjectModal';
import { FaPlus, FaBook, FaCheckCircle, FaUsers } from 'react-icons/fa';

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [subjectsResult, classesResult] = await Promise.all([
        apiService.getSubjects(),
        apiService.getClasses()
      ]);

      if (subjectsResult.success) {
        setSubjects(subjectsResult.subjects || []);
      }

      if (classesResult.success) {
        setClasses(classesResult.classes || []);
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setModalOpen(true);
  };

  const handleEditSubject = (subjectData) => {
    setSelectedSubject(subjectData);
    setModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        const result = await apiService.deleteSubject(subjectId);
        if (result.success) {
          loadData();
        } else {
          alert(result.error || 'Failed to delete subject');
        }
      } catch (err) {
        alert(err.message || 'Failed to delete subject');
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedSubject(null);
    setModalOpen(false);
  };

  const handleSuccess = () => {
    loadData();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // Filter subjects by selected class
  const filteredSubjects = selectedClassFilter === 'all' 
    ? subjects 
    : subjects.filter(s => s.classId === selectedClassFilter);

  const stats = [
    {
      label: 'Total Subjects',
      value: subjects.length,
      icon: FaBook,
      color: 'blue'
    },
    {
      label: 'Active Subjects',
      value: subjects.filter(s => s.status === 'active').length,
      icon: FaCheckCircle,
      color: 'green'
    },
    {
      label: 'Assigned Teachers',
      value: subjects.filter(s => s.teacherId).length,
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Subject Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage subjects and assign teachers</p>
          </div>
          <button
            onClick={handleAddSubject}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
          >
            <FaPlus className="text-xs" />
            Add Subject
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

        {/* Class Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Class
          </label>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - Grade {cls.grade}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Table */}
        <SubjectTable
          subjects={filteredSubjects}
          onEdit={handleEditSubject}
          onDelete={handleDeleteSubject}
        />
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditSubjectModal
          subjectData={selectedSubject}
          classes={classes}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default SubjectManagement;
