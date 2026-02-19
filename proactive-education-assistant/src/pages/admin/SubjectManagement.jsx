import { useState } from 'react';
import { FaChevronDown, FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export const SubjectManagement = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Mock data
  const classes = [
    { id: 1, name: 'Class 6-A' },
    { id: 2, name: 'Class 7-B' },
    { id: 3, name: 'Class 8-A' },
    { id: 4, name: 'Class 9-C' }
  ];

  const teachers = [
    { id: 1, name: 'Mr. Rajesh Kumar' },
    { id: 2, name: 'Ms. Priya Sharma' },
    { id: 3, name: 'Dr. Amit Patel' },
    { id: 4, name: 'Mrs. Sunita Desai' },
    { id: 5, name: 'Mr. Vikram Singh' }
  ];

  const [subjects, setSubjects] = useState({
    1: [
      { id: 1, name: 'Mathematics', teacher: 'Mr. Rajesh Kumar' },
      { id: 2, name: 'Science', teacher: 'Ms. Priya Sharma' },
      { id: 3, name: 'English', teacher: 'Dr. Amit Patel' }
    ],
    2: [
      { id: 4, name: 'Mathematics', teacher: 'Mr. Rajesh Kumar' },
      { id: 5, name: 'Hindi', teacher: 'Mrs. Sunita Desai' }
    ]
  });

  const handleAddSubject = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }
    setSelectedSubject(null);
    setModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setModalOpen(true);
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(prev => ({
        ...prev,
        [selectedClass]: prev[selectedClass].filter(s => s.id !== subjectId)
      }));
    }
  };

  const handleSuccess = (formData) => {
    if (selectedSubject) {
      // Update existing subject
      setSubjects(prev => ({
        ...prev,
        [selectedClass]: prev[selectedClass].map(s => 
          s.id === selectedSubject.id ? { ...s, ...formData } : s
        )
      }));
    } else {
      // Add new subject
      const newSubject = {
        id: Date.now(),
        ...formData
      };
      setSubjects(prev => ({
        ...prev,
        [selectedClass]: [...(prev[selectedClass] || []), newSubject]
      }));
    }
    setModalOpen(false);
  };

  const currentSubjects = selectedClass ? (subjects[selectedClass] || []) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Subject Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a class and manage its subjects
          </p>
        </div>

        {/* Class Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Class <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
            >
              <option value="">Choose a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
          </div>
        </div>

        {/* Subjects Section */}
        {selectedClass ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FaBook className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Subjects ({currentSubjects.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    {classes.find(c => c.id === parseInt(selectedClass))?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddSubject}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
              >
                <FaPlus className="text-xs" />
                Add Subject
              </button>
            </div>

            {currentSubjects.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBook className="text-2xl text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">No subjects added yet</p>
                <button
                  onClick={handleAddSubject}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                >
                  <FaPlus className="text-xs" />
                  Add First Subject
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Subject Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Assigned Teacher
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentSubjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{subject.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                            {subject.teacher}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditSubject(subject)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Edit Subject"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              title="Delete Subject"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-2xl text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Please select a class to view and manage subjects</p>
          </div>
        )}
      </div>

      {/* Add/Edit Subject Modal */}
      {modalOpen && (
        <SubjectModal
          subject={selectedSubject}
          teachers={teachers}
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

function SubjectModal({ subject, teachers, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    teacher: subject?.teacher || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }
    if (!formData.teacher) {
      newErrors.teacher = 'Teacher assignment is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {subject ? 'Edit Subject' : 'Add Subject'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Mathematics"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Teacher <span className="text-red-500">*</span>
            </label>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.teacher ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {errors.teacher && (
              <p className="text-red-600 text-sm mt-1">{errors.teacher}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {subject ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectManagement;
