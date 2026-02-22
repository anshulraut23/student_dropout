import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import apiService from '../../../services/apiService';

export default function AddEditTemplateModal({ template, onClose }) {
  const isEdit = !!template;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'unit_test',
    description: '',
    totalMarks: 100,
    passingMarks: 40,
    weightage: 0.1,
    orderSequence: 1
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type,
        description: template.description || '',
        totalMarks: template.totalMarks,
        passingMarks: template.passingMarks,
        weightage: template.weightage,
        orderSequence: template.orderSequence
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Template name is required');
      return;
    }

    if (parseInt(formData.passingMarks) >= parseInt(formData.totalMarks)) {
      alert('Passing marks must be less than total marks');
      return;
    }

    if (parseFloat(formData.weightage) < 0 || parseFloat(formData.weightage) > 1) {
      alert('Weightage must be between 0 and 1');
      return;
    }

    try {
      setLoading(true);

      const templateData = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
        totalMarks: parseInt(formData.totalMarks),
        passingMarks: parseInt(formData.passingMarks),
        weightage: parseFloat(formData.weightage),
        orderSequence: parseInt(formData.orderSequence)
      };

      if (isEdit) {
        await apiService.updateExamTemplate(template.id, templateData);
        alert('Template updated successfully');
      } else {
        const response = await apiService.createExamTemplate(templateData);
        alert(`Template created successfully!\n\n${response.generatedExamsCount} exams were automatically generated for all subjects.`);
      }

      onClose(true);
    } catch (error) {
      alert('Failed to save template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Unit Test 1, Midterm Exam"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Type and Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="unit_test">Unit Test</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="assignment">Assignment</option>
                  <option value="project">Project</option>
                  <option value="practical">Practical</option>
                  <option value="quiz">Quiz</option>
                  <option value="oral">Oral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Sequence <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="orderSequence"
                  value={formData.orderSequence}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Order in academic year (1, 2, 3...)</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                placeholder="Optional description of this exam template"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Marks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  min="1"
                  max={formData.totalMarks}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Weightage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weightage <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="weightage"
                  value={formData.weightage}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  step="0.01"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-lg font-semibold text-gray-900">
                    {(parseFloat(formData.weightage) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Contribution to final grade (0.0 to 1.0). Example: 0.1 = 10%, 0.3 = 30%
              </p>
            </div>

            {/* Preview */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">{formData.name || 'Template Name'}</span> will have:
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>{formData.totalMarks} total marks</li>
                  <li>{formData.passingMarks} passing marks ({((formData.passingMarks / formData.totalMarks) * 100).toFixed(0)}% to pass)</li>
                  <li>{(parseFloat(formData.weightage) * 100).toFixed(0)}% weightage in final grade</li>
                  <li>Appears as #{formData.orderSequence} in academic year</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FaSave />
              {loading ? 'Saving...' : (isEdit ? 'Update Template' : 'Create Template')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
