import { useState } from 'react';
import { adminService } from '../../../services/adminService';
import { FaTimes } from 'react-icons/fa';

function AddEditClassModal({ classData, onClose, onSuccess }) {
  const isEdit = !!classData;
  
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    description: classData?.description || '',
    grade: classData?.grade || '',
    attendanceType: classData?.attendanceType || 'common',
    academicYear: classData?.academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    classIncharge: classData?.classIncharge || '',
  });
  const [saving, setSaving] = useState(false);

  // Mock teachers list - in real app, fetch from API
  const teachers = [
    'Mr. Rajesh Kumar',
    'Ms. Priya Sharma',
    'Dr. Amit Patel',
    'Mrs. Sunita Desai',
    'Mr. Vikram Singh'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade || !formData.attendanceType || !formData.academicYear || !formData.classIncharge) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      let result;
      if (isEdit) {
        result = await adminService.updateClass(classData.id, formData);
      } else {
        result = await adminService.addClass(formData);
      }

      if (result.success) {
        alert(isEdit ? 'Class updated successfully!' : 'Class added successfully!');
        onSuccess();
      }
    } catch (error) {
      alert('Failed to save class: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 sm:bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
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
              placeholder="e.g., Grade 7A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 7"
              min="1"
              max="12"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Type <span className="text-red-500">*</span>
            </label>
            <select
              name="attendanceType"
              value={formData.attendanceType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="common">Common for all subjects</option>
              <option value="subjectwise">Subject-wise</option>
            </select>
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
              Class Incharge <span className="text-red-500">*</span>
            </label>
            <select
              name="classIncharge"
              value={formData.classIncharge}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="e.g., Morning batch for Grade 7 students"
            />
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
