import React, { useState } from 'react';
import { Phone, Mail, Calendar, Users, BookOpen, MessageCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

/**
 * Smart Action Suggestions Component
 * Generates personalized intervention suggestions based on student's risk factors
 */
const SmartActionSuggestions = ({ student, riskData, features, onActionClick }) => {
  const [expandedAction, setExpandedAction] = useState(null);

  if (!riskData || !features) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Load risk prediction to see personalized action suggestions</p>
      </div>
    );
  }

  const actions = generatePersonalizedActions(student, riskData, features);

  const urgentActions = actions.filter(a => a.priority === 'urgent');
  const importantActions = actions.filter(a => a.priority === 'important');
  const monitoringActions = actions.filter(a => a.priority === 'monitoring');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎯</div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-lg mb-1">
              Smart Actions for {student.firstName || student.name}
            </h3>
            <p className="text-sm text-blue-800">
              Personalized suggestions based on {riskData.prediction.risk_level} risk level and key factors
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Actions */}
      {urgentActions.length > 0 && (
        <ActionSection
          title="🔴 URGENT ACTIONS"
          subtitle="Do within 3 days"
          actions={urgentActions}
          color="red"
          expandedAction={expandedAction}
          setExpandedAction={setExpandedAction}
          onActionClick={onActionClick}
        />
      )}

      {/* Important Actions */}
      {importantActions.length > 0 && (
        <ActionSection
          title="🟡 IMPORTANT ACTIONS"
          subtitle="Do within 1 week"
          actions={importantActions}
          color="yellow"
          expandedAction={expandedAction}
          setExpandedAction={setExpandedAction}
          onActionClick={onActionClick}
        />
      )}

      {/* Monitoring Actions */}
      {monitoringActions.length > 0 && (
        <ActionSection
          title="🟢 MONITORING ACTIONS"
          subtitle="Ongoing tracking"
          actions={monitoringActions}
          color="green"
          expandedAction={expandedAction}
          setExpandedAction={setExpandedAction}
          onActionClick={onActionClick}
        />
      )}
    </div>
  );
};

/**
 * Action Section Component
 */
const ActionSection = ({ title, subtitle, actions, color, expandedAction, setExpandedAction, onActionClick }) => {
  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badge: 'bg-red-100 text-red-800'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      badge: 'bg-green-100 text-green-800'
    }
  };

  const colors = colorClasses[color];

  return (
    <div>
      <div className="mb-3">
        <h4 className="font-bold text-gray-800 text-base">{title}</h4>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
      <div className="space-y-3">
        {actions.map((action, idx) => (
          <ActionCard
            key={idx}
            action={action}
            colors={colors}
            isExpanded={expandedAction === `${color}-${idx}`}
            onToggle={() => setExpandedAction(expandedAction === `${color}-${idx}` ? null : `${color}-${idx}`)}
            onActionClick={onActionClick}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Action Card Component
 */
const ActionCard = ({ action, colors, isExpanded, onToggle, onActionClick }) => {
  const getIcon = (type) => {
    const icons = {
      communication: Phone,
      meeting: Calendar,
      tutoring: BookOpen,
      counseling: MessageCircle,
      investigation: AlertTriangle,
      monitoring: Clock
    };
    const Icon = icons[type] || CheckCircle;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className={`border-2 rounded-lg overflow-hidden ${colors.border} ${colors.bg}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${colors.badge}`}>
              {getIcon(action.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className={`font-bold text-sm mb-1 ${colors.text}`}>
                {action.title}
              </h5>
              <p className="text-xs text-gray-700 leading-relaxed">
                {action.reason}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${colors.badge}`}>
            {action.impact} Impact
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <span>📊 Importance: {(action.importance * 100).toFixed(0)}%</span>
          <span>⏱️ {action.timeline}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {action.buttons.map((button, idx) => (
            <button
              key={idx}
              onClick={() => onActionClick(action, button.action)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              {button.icon && <span>{button.icon}</span>}
              {button.label}
            </button>
          ))}
          <button
            onClick={onToggle}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Why this matters:</p>
                <p className="text-gray-700 leading-relaxed">{action.explanation}</p>
              </div>
              {action.expectedOutcome && (
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Expected outcome:</p>
                  <p className="text-gray-700 leading-relaxed">{action.expectedOutcome}</p>
                </div>
              )}
              {action.tips && action.tips.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-800 mb-1">💡 Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {action.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Generate personalized actions based on student's risk factors
 */
function generatePersonalizedActions(student, riskData, features) {
  const actions = [];
  const studentName = student.firstName || student.name || 'Student';
  
  // Get top risk factors sorted by importance
  const topFactors = Object.entries(riskData.feature_importance || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, importance]) => ({
      name,
      importance,
      value: features[name] || 0
    }));

  // Generate actions for each risk factor
  topFactors.forEach((factor, index) => {
    const factorActions = generateActionsForFactor(factor, studentName, features, index);
    actions.push(...factorActions);
  });

  return actions;
}

/**
 * Generate specific actions for each risk factor
 */
function generateActionsForFactor(factor, studentName, features, rank) {
  const actions = [];

  // Attendance-related actions
  if (factor.name === 'attendance_rate' && factor.value < 0.75) {
    const attendancePercent = (factor.value * 100).toFixed(0);
    const daysAbsent = features.days_absent || 0;
    
    actions.push({
      priority: factor.value < 0.60 ? 'urgent' : 'important',
      title: '📞 Call Parent About Attendance',
      reason: `${studentName} has ${daysAbsent} absences (${attendancePercent}% attendance)`,
      impact: 'HIGH',
      importance: factor.importance,
      timeline: 'Within 3 days',
      type: 'communication',
      explanation: `Poor attendance is the #${rank + 1} risk factor for ${studentName}. Missing ${daysAbsent} days means missing critical instruction and falling behind peers. Early parent contact can identify barriers (health, transportation, family issues) and create solutions.`,
      expectedOutcome: 'Identify attendance barriers and create action plan with family. Target: Improve to 80%+ attendance within 2 weeks.',
      tips: [
        'Ask open-ended questions: "What challenges is your family facing?"',
        'Show data: "Missing X days = Y hours of instruction lost"',
        'Offer solutions: flexible scheduling, transportation help, health referrals'
      ],
      buttons: [
        { label: 'Call Now', icon: '📞', action: 'call_parent' },
        { label: 'Schedule Call', icon: '📅', action: 'schedule_call' }
      ],
      prefilledData: {
        contactTarget: 'Parent',
        channel: 'Phone Call',
        reason: 'Attendance Concern',
        message: `Dear Parent/Guardian,\n\nI'm reaching out regarding ${studentName}'s attendance. ${studentName} has been absent for ${daysAbsent} days this term (${attendancePercent}% attendance rate).\n\nRegular attendance is crucial for academic success. Missing classes means missing important instruction and falling behind.\n\nI'd like to discuss any challenges ${studentName} or your family might be facing and work together to improve attendance.\n\nCan we schedule a time to talk?\n\nBest regards`
      }
    });

    if (factor.value < 0.65) {
      actions.push({
        priority: 'urgent',
        title: '🏥 Investigate Attendance Barriers',
        reason: `Frequent absences (${daysAbsent} days) may indicate underlying issues`,
        impact: 'HIGH',
        importance: factor.importance,
        timeline: 'Within 3 days',
        type: 'investigation',
        explanation: 'Chronic absenteeism often has root causes: health problems, transportation issues, family responsibilities, bullying, or lack of engagement. Understanding the "why" is essential for effective intervention.',
        expectedOutcome: 'Identify specific barriers and connect family with appropriate resources (health services, transportation, counseling).',
        tips: [
          'Check with school nurse about health issues',
          'Ask about transportation challenges',
          'Investigate if bullying or social issues exist',
          'Consider home visit if appropriate'
        ],
        buttons: [
          { label: 'Log Investigation', icon: '🔍', action: 'log_investigation' },
          { label: 'Schedule Home Visit', icon: '🏠', action: 'schedule_home_visit' }
        ]
      });
    }
  }

  // Academic performance actions
  if (factor.name === 'avg_marks_percentage' && factor.value < 50) {
    const marksPercent = (factor.value * 100).toFixed(0);
    
    actions.push({
      priority: factor.value < 40 ? 'urgent' : 'important',
      title: '📚 Arrange Academic Tutoring',
      reason: `${studentName} is scoring ${marksPercent}% (below passing)`,
      impact: 'HIGH',
      importance: factor.importance,
      timeline: 'Within 1 week',
      type: 'tutoring',
      explanation: `Low academic performance (#${rank + 1} risk factor) creates a cycle of discouragement and disengagement. Immediate academic support can break this cycle and rebuild confidence.`,
      expectedOutcome: 'Improve understanding of core concepts. Target: Raise marks to 50%+ within 4 weeks through consistent support.',
      tips: [
        'Identify specific subjects/topics where student struggles',
        'Consider peer tutoring (often more relatable)',
        'Schedule 2-3 sessions per week for consistency',
        'Track progress weekly with mini-assessments'
      ],
      buttons: [
        { label: 'Arrange Tutoring', icon: '📚', action: 'arrange_tutoring' },
        { label: 'Find Peer Tutor', icon: '👥', action: 'find_peer_tutor' }
      ],
      prefilledData: {
        supportType: 'Academic Tutoring',
        reason: `Low marks (${marksPercent}%)`,
        frequency: '2-3 times per week'
      }
    });

    actions.push({
      priority: 'important',
      title: '📞 Parent Meeting About Academic Support',
      reason: `Discuss ${studentName}'s academic struggles (${marksPercent}% average)`,
      impact: 'MEDIUM',
      importance: factor.importance,
      timeline: 'Within 1 week',
      type: 'meeting',
      explanation: 'Parents may not be aware of academic struggles. A collaborative meeting can align home and school support, set expectations, and create a unified approach.',
      expectedOutcome: 'Parent understands situation and commits to home support (homework monitoring, quiet study space, limiting distractions).',
      tips: [
        'Share specific examples of struggles',
        'Bring work samples to show gaps',
        'Create action plan together',
        'Schedule follow-up in 2 weeks'
      ],
      buttons: [
        { label: 'Schedule Meeting', icon: '📅', action: 'schedule_meeting' },
        { label: 'Call Parent', icon: '📞', action: 'call_parent' }
      ]
    });
  }

  // Behavior-related actions
  if (factor.name === 'behavior_score' && factor.value < 60) {
    const behaviorScore = factor.value.toFixed(0);
    const negativeIncidents = features.negative_incidents || 0;
    
    actions.push({
      priority: factor.value < 40 ? 'urgent' : 'important',
      title: '🗣️ Schedule Counseling Session',
      reason: `${studentName} has ${negativeIncidents} incidents (behavior score ${behaviorScore}/100)`,
      impact: 'HIGH',
      importance: factor.importance,
      timeline: 'Within 3 days',
      type: 'counseling',
      explanation: `Behavioral issues (#${rank + 1} risk factor) often signal underlying emotional, social, or family problems. Counseling provides safe space to explore root causes and develop coping strategies.`,
      expectedOutcome: 'Identify underlying issues (stress, trauma, peer conflicts). Develop behavior improvement plan with student buy-in.',
      tips: [
        'Frame as support, not punishment',
        'Let student tell their story first',
        'Look for patterns in when/where issues occur',
        'Involve parents if appropriate'
      ],
      buttons: [
        { label: 'Schedule Counseling', icon: '🗣️', action: 'schedule_counseling' },
        { label: 'Refer to Counselor', icon: '👤', action: 'refer_counselor' }
      ],
      prefilledData: {
        sessionType: 'Behavioral Counseling',
        urgency: factor.value < 40 ? 'High' : 'Medium',
        reason: `${negativeIncidents} behavioral incidents`
      }
    });

    if (negativeIncidents > 3) {
      actions.push({
        priority: 'urgent',
        title: '📋 Create Behavior Intervention Plan',
        reason: `Multiple incidents (${negativeIncidents}) require structured approach`,
        impact: 'HIGH',
        importance: factor.importance,
        timeline: 'Within 1 week',
        type: 'intervention',
        explanation: 'A formal behavior plan sets clear expectations, consequences, and positive reinforcement. It creates consistency and accountability.',
        expectedOutcome: 'Reduce negative incidents by 50% within 3 weeks through clear structure and positive reinforcement.',
        tips: [
          'Involve student in creating the plan',
          'Set 2-3 specific, measurable goals',
          'Include positive rewards, not just consequences',
          'Review progress weekly with student'
        ],
        buttons: [
          { label: 'Create Plan', icon: '📋', action: 'create_behavior_plan' },
          { label: 'View Templates', icon: '📄', action: 'view_templates' }
        ]
      });
    }
  }

  // Days absent specific actions
  if (factor.name === 'days_absent' && factor.value > 10) {
    const daysAbsent = Math.round(factor.value);
    
    actions.push({
      priority: 'monitoring',
      title: '📊 Daily Attendance Monitoring',
      reason: `Track if interventions are reducing absences (currently ${daysAbsent} days)`,
      impact: 'MEDIUM',
      importance: factor.importance,
      timeline: 'Ongoing',
      type: 'monitoring',
      explanation: 'Daily monitoring provides early warning if attendance slips again. It also shows student/family that attendance is being tracked, which can improve accountability.',
      expectedOutcome: 'Catch attendance issues early before they become chronic. Celebrate improvements with student.',
      tips: [
        'Set up daily attendance alert',
        'Greet student personally when they attend',
        'Acknowledge improvements publicly',
        'Contact parent immediately if absent'
      ],
      buttons: [
        { label: 'Set Up Alert', icon: '🔔', action: 'setup_alert' },
        { label: 'View Tracking', icon: '📊', action: 'view_tracking' }
      ]
    });
  }

  return actions;
}

export default SmartActionSuggestions;
