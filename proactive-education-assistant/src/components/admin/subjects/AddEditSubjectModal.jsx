import { useState, useEffect } from 'react';
import apiService from '../../../services/apiService';
import { FaTimes } from 'react-icons/fa';

function AddEditSubjectModal({ subjectData, classes, onClose, onSuccess }) {
  const isEdit = !!subjectData;
  
  const [formData, setFormData] = useState({
    name: subjectData?.name || '',
    classId: subjectData?.classId || '',
    teacherId: subjectData?.teacherId || '',
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const result = await apiService.getAllTeachers();
      if (result.success) {
        // Filter only approved teachers
        const approvedTeachers = result.teachers.filter(t => t.status === 'approved');
        setTeachers(approvedTeachers);
      }
    } catch (err) {
      console.error('Load teachers error:', err);
      setError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.classId) {
      setError('Subject name and class are required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      let result;
      if (isEdit) {
        result = await apiService.updateSubject(subjectData.id, formData);
      } else {
        result = await apiService.createSubject(formData);
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to save subject');
      }
    } catch (err) {
      setError(err.message || 'Failed to save subject');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 sm:bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Subject' : 'Add New Subject'}
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
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isEdit} // Can't change class when editing
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                </option>
              ))}
            </select>
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                Class cannot be changed after creation
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Teacher
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
                  <option value="">No teacher (assign later)</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only approved teachers are shown. A teacher can teach multiple subjects.
                </p>
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
              {saving ? 'Saving...' : isEdit ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditSubjectModal;
