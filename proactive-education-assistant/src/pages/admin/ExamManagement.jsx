import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import apiService from '../../services/apiService';

export default function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    subjectId: '',
    templateId: '',
    totalMarks: 100,
    passingMarks: 40,
    examDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [examsRes, classesRes, templatesRes] = await Promise.all([
        apiService.getExams(),
        apiService.getClasses(),
        apiService.getExamTemplates()
      ]);

      setExams(examsRes.exams || []);
      setClasses(classesRes.classes || []);
      setTemplates(templatesRes.templates || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (classId) => {
    try {
      const result = await apiService.getSubjectsByClass(classId);
      setSubjects(result.subjects || []);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
    }
  };

  const handleClassChange = (classId) => {
    setFormData({ ...formData, classId, subjectId: '' });
    if (classId) {
      loadSubjects(classId);
    } else {
      setSubjects([]);
    }
  };

  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        templateId,
        totalMarks: template.totalMarks,
        passingMarks: template.passingMarks
      });
    } else {
      setFormData({ ...formData, templateId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classId || !formData.subjectId) {
      alert('Please select class and subject');
      return;
    }

    if (!formData.totalMarks || !formData.passingMarks || !formData.examDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const selectedClass = classes.find(c => c.id === formData.classId);
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);
      const selectedTemplate = templates.find(t => t.id === formData.templateId);

      const examData = {
        name: formData.name || `${selectedSubject?.name || ''} - ${selectedTemplate?.name || 'Exam'}`,
        classId: formData.classId,
        subjectId: formData.subjectId,
        type: selectedTemplate?.type || 'unit_test',
        totalMarks: parseInt(formData.totalMarks) || 100,
        passingMarks: parseInt(formData.passingMarks) || 40,
        examDate: formData.examDate,
        status: 'scheduled'
      };

      console.log('Submitting exam data:', examData);

      const result = await apiService.createExam(examData);
      console.log('Create exam result:', result);

      if (result.success) {
        alert('Exam created successfully!');
        setShowModal(false);
        resetForm();
        loadData();
      } else {
        alert('Failed to create exam: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert('Failed to create exam: ' + (error.message || error.toString()));
    }
  };

  const handleDelete = async (exam) => {
    if (!confirm(`Delete exam "${exam.name}"?`)) return;

    try {
      await apiService.deleteExam(exam.id);
      alert('Exam deleted successfully');
      loadData();
    } catch (error) {
      alert('Failed to delete exam: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      classId: '',
      subjectId: '',
      templateId: '',
      totalMarks: 100,
      passingMarks: 40,
      examDate: new Date().toISOString().split('T')[0]
    });
    setSubjects([]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Exam Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create exams for specific subjects and classes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Create Exam
        </button>
      </div>

      {/* Exams List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 mb-4">No exams found</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first exam
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{exam.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.className}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.subjectName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.totalMarks}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{exam.examDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDelete(exam)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => { setShowModal(false); resetForm(); }}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Create New Exam</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template (Optional)</label>
                  <select
                    value={formData.templateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select template...</option>
                    {templates.filter(t => t.isActive).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Class *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select class...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - Grade {c.grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    disabled={!formData.classId}
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Exam Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Marks *</label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Passing Marks *</label>
                    <input
                      type="number"
                      value={formData.passingMarks}
                      onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Exam Date *</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Exam
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
