import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import SmartActionSuggestions from './SmartActionSuggestions';
import QuickActionModal from './QuickActionModal';
import apiService from '../../services/apiService';

/**
 * Student Actions Tab
 * Shows personalized intervention suggestions and action history for a specific student
 */
const StudentActionsTab = ({ student, riskData, features }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (student?.id) {
      loadInterventions();
    }
  }, [student?.id]);

  const loadInterventions = async () => {
    try {
      setLoading(true);
      const result = await apiService.getInterventionsByStudent(student.id);
      if (result.success) {
        setInterventions(result.interventions || []);
      }
    } catch (error) {
      console.error('Failed to load interventions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action, buttonAction) => {
    // For now, all actions open the quick action modal
    // In future, different button actions could trigger different modals
    setSelectedAction(action);
    setShowModal(true);
  };

  const handleSubmitAction = async (formData) => {
    try {
      const data = {
        studentId: formData.studentId,
        interventionType: formData.actionType,
        title: `${formData.channel} - ${formData.contactTarget}`,
        description: formData.message || `${formData.channel} communication with ${formData.contactTarget} regarding: ${formData.actionReason}`,
        actionPlan: formData.notes || null,
        startDate: new Date().toISOString().split('T')[0],
        targetDate: formData.followUpDate || null,
        status: formData.status.toLowerCase(),
        priority: 'medium',
        metadata: {
          riskFactor: formData.riskFactor,
          channel: formData.channel,
          contactTarget: formData.contactTarget
        }
      };

      const result = await apiService.createIntervention(data);
      
      if (result.success) {
        setMessage({ type: 'success', text: '✓ Action logged successfully!' });
        loadInterventions();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to log action' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to log action' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Smart Action Suggestions */}
      <SmartActionSuggestions
        student={student}
        riskData={riskData}
        features={features}
        onActionClick={handleActionClick}
      />

      {/* Action History */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 text-lg">Action History</h3>
          <p className="text-sm text-gray-600 mt-1">
            All interventions and actions taken for {student.firstName || student.name}
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600 text-sm">Loading action history...</p>
            </div>
          ) : interventions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-600 text-sm">No actions logged yet</p>
              <p className="text-gray-500 text-xs mt-1">
                Click an action button above to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interventions.map((intervention) => (
                <InterventionCard key={intervention.id} intervention={intervention} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedAction(null);
        }}
        action={selectedAction}
        student={student}
        onSubmit={handleSubmitAction}
      />
    </div>
  );
};

/**
 * Intervention Card Component
 */
const InterventionCard = ({ intervention }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (statusLower === 'in-progress') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            {intervention.title || intervention.interventionType}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {intervention.description}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(intervention.status)}`}>
          {intervention.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>📅 {formatDate(intervention.startDate || intervention.createdAt)}</span>
        {intervention.targetDate && (
          <span>🎯 Follow-up: {formatDate(intervention.targetDate)}</span>
        )}
        {intervention.priority && (
          <span className="capitalize">Priority: {intervention.priority}</span>
        )}
      </div>

      {intervention.actionPlan && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            <strong>Notes:</strong> {intervention.actionPlan}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentActionsTab;
