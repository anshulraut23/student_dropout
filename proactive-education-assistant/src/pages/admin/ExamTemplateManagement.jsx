import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle } from 'react-icons/fa';
import apiService from '../../services/apiService';
import AddEditTemplateModal from '../../components/admin/exams/AddEditTemplateModal';

export default function ExamTemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    loadTemplates();
  }, [filter]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter === 'active') filters.isActive = true;
      if (filter === 'inactive') filters.isActive = false;

      const response = await apiService.getExamTemplates(filters);
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      alert('Failed to load templates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleDelete = async (template) => {
    if (template.isUsed) {
      alert('Cannot delete template that is used in exam periods');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    try {
      await apiService.deleteExamTemplate(template.id);
      alert('Template deleted successfully');
      loadTemplates();
    } catch (error) {
      alert('Failed to delete template: ' + error.message);
    }
  };

  const handleToggleStatus = async (template) => {
    try {
      await apiService.toggleExamTemplateStatus(template.id);
      alert(`Template ${template.isActive ? 'deactivated' : 'activated'} successfully`);
      loadTemplates();
    } catch (error) {
      alert('Failed to toggle template status: ' + error.message);
    }
  };

  const handleModalClose = (saved) => {
    setShowModal(false);
    setEditingTemplate(null);
    if (saved) {
      loadTemplates();
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      unit_test: 'Unit Test',
      midterm: 'Midterm',
      final: 'Final',
      assignment: 'Assignment',
      project: 'Project',
      practical: 'Practical',
      quiz: 'Quiz',
      oral: 'Oral'
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Exam Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define standardized exam structures for your school
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Create Template
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">How Exam Templates Work</p>
          <p>
            When you create a template, the system automatically generates exams for ALL subjects in ALL classes.
            This ensures consistent marking schemes across your school and provides clean data for dropout prediction.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Templates
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'inactive'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Templates List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No templates found</p>
          <button
            onClick={handleCreate}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-lg border-2 p-6 transition-all ${
                template.isActive
                  ? 'border-green-200 hover:border-green-300'
                  : 'border-gray-200 hover:border-gray-300 opacity-75'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {getTypeLabel(template.type)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {template.isActive ? (
                    <FaToggleOn className="text-green-600 text-2xl" />
                  ) : (
                    <FaToggleOff className="text-gray-400 text-2xl" />
                  )}
                </div>
              </div>

              {/* Description */}
              {template.description && (
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              )}

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Marks:</span>
                  <span className="font-medium text-gray-900">{template.totalMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Passing Marks:</span>
                  <span className="font-medium text-gray-900">{template.passingMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weightage:</span>
                  <span className="font-medium text-gray-900">{(template.weightage * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order:</span>
                  <span className="font-medium text-gray-900">#{template.orderSequence}</span>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Usage</div>
                <div className="flex justify-between text-sm">
                  <span>Periods:</span>
                  <span className="font-medium">{template.periodsCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Exams:</span>
                  <span className="font-medium">{template.examsCount || 0}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(template)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    template.isActive
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {template.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  {template.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(template)}
                  disabled={template.isUsed}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    template.isUsed
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                  title={template.isUsed ? 'Cannot delete template in use' : 'Delete template'}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddEditTemplateModal
          template={editingTemplate}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
