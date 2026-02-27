import React, { useState } from 'react';
import { X, Phone, Calendar, Mail, MessageCircle } from 'lucide-react';

/**
 * Quick Action Modal
 * Pre-filled form that opens when teacher clicks an action button
 */
const QuickActionModal = ({ isOpen, onClose, action, student, onSubmit }) => {
  const [formData, setFormData] = useState({
    channel: action?.prefilledData?.channel || 'Phone Call',
    contactTarget: action?.prefilledData?.contactTarget || 'Parent',
    message: action?.prefilledData?.message || '',
    followUpDate: '',
    status: 'Pending',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !action) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        studentId: student.id,
        studentName: student.name || `${student.firstName} ${student.lastName}`,
        actionType: action.title,
        actionReason: action.reason,
        riskFactor: action.type
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit action:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{action.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              For: {student.firstName || student.name} {student.lastName || ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Action Context */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Why:</strong> {action.reason}
            </p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>Expected Impact:</strong> {action.impact}
            </p>
          </div>

          {/* Communication Channel */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Communication Channel <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Phone Call', 'SMS', 'Email', 'In-person Meeting'].map(channel => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, channel }))}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                    formData.channel === channel
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {channel === 'Phone Call' && <Phone className="w-4 h-4" />}
                  {channel === 'Email' && <Mail className="w-4 h-4" />}
                  {channel === 'SMS' && <MessageCircle className="w-4 h-4" />}
                  {channel === 'In-person Meeting' && <Calendar className="w-4 h-4" />}
                  {channel}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Target */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Target <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Parent', 'Student'].map(target => (
                <button
                  key={target}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, contactTarget: target }))}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    formData.contactTarget === target
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {(formData.channel === 'SMS' || formData.channel === 'Email') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Type your message here..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Pre-filled message based on the issue. Feel free to edit.
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Any additional context or observations..."
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              When should you check back on this?
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Log Action'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickActionModal;
