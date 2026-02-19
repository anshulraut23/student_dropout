import { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { FaTimes } from 'react-icons/fa';

function AddEditClassModal({ classData, onClose, onSuccess }) {
  const isEdit = !!classData;
  
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    grade: classData?.grade || '',
    section: classData?.section || '',
    academicYear: classData?.academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    teacherId: classData?.teacherId || '',
    attendanceMode: classData?.attendanceMode || 'daily',
  });
  const [teachers, setTeachers] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teachersResult, classesResult] = await Promise.all([
        apiService.getAllTeachers(),
        apiService.getClasses()
      ]);

      if (teachersResult.success) {
        // Filter only approved teachers
        const approvedTeachers = teachersResult.teachers.filter(t => t.status === 'approved');
        setTeachers(approvedTeachers);
      }

      if (classesResult.success) {
        setAllClasses(classesResult.classes || []);
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Get available teachers (not assigned as incharge to other classes)
  const getAvailableTeachers = () => {
    return teachers.filter(teacher => {
      // Find if this teacher is already an incharge of any class
      const isInchargeOfOtherClass = allClasses.some(cls => 
        cls.teacherId === teacher.id && cls.id !== classData?.id
      );
      
      // Include teacher if:
      // 1. Not incharge of any class, OR
      // 2. Is the current incharge of THIS class (when editing)
      return !isInchargeOfOtherClass || teacher.id === classData?.teacherId;
    });
  };

  const availableTeachers = getAvailableTeachers();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade || !formData.attendanceMode || !formData.academicYear) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError('');
    try {
      let result;
      if (isEdit) {
        result = await apiService.updateClass(classData.id, formData);
      } else {
        result = await apiService.createClass(formData);
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to save class');
      }
    } catch (err) {
      setError(err.message || 'Failed to save class');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 sm:bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Class' : 'Add New Class'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 8A"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 8"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Mode <span className="text-red-500">*</span>
            </label>
            <select
              name="attendanceMode"
              value={formData.attendanceMode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="daily">Daily (Incharge marks attendance)</option>
              <option value="subject_wise">Subject-wise (Subject teachers mark attendance)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.attendanceMode === 'daily' 
                ? 'Only class incharge can mark attendance once per day' 
                : 'Subject teachers mark attendance for their respective subjects'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2024-2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Incharge
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Loading teachers...</div>
            ) : (
              <>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No incharge (assign later)</option>
                  {availableTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                      {teacher.id === classData?.teacherId ? ' - Current' : ''}
                    </option>
                  ))}
                </select>
                {availableTeachers.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No available teachers. All approved teachers are already assigned as incharge of other classes.
                  </p>
                )}
                {availableTeachers.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Only teachers not assigned as incharge to other classes are shown.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditClassModal;
