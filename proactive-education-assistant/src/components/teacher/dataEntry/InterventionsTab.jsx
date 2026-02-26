import { useState, useEffect } from "react";
import {
  FaSpinner, FaPlus, FaEdit, FaTrash,
  FaCheckCircle, FaExclamationTriangle,
  FaPhone, FaSms, FaEnvelope, FaUser, FaMagic
} from "react-icons/fa";
import apiService from "../../../services/apiService";

const HORIZON_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --primary-blue: #1a6fb5;
  --blue-light: #2d8fd4;
  --blue-deep: #0e4a80;
  --accent-gold: #f0a500;
  --slate: #3c4a5a;
  --gray: #6b7a8d;
  --light-bg: #f5f8fb;
  --white: #ffffff;
  --text-dark: #1e2c3a;
  --font-heading: 'DM Serif Display', serif;
  --font-body: 'DM Sans', sans-serif;
  --success-green: #10b981;
  --warning-orange: #f59e0b;
  --error-red: #ef4444;
}

* { box-sizing: border-box; }

body { font-family: var(--font-body); }

.horizon-input {
  border: 1.5px solid rgba(26, 111, 181, 0.2);
  border-radius: 8px;
  background: var(--white);
  color: var(--text-dark);
  transition: all 0.2s ease;
  font-family: var(--font-body);
  width: 100%;
}
.horizon-input:focus {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
  outline: none;
}

.horizon-btn-primary {
  background: var(--primary-blue);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(26, 111, 181, 0.15);
  cursor: pointer;
  font-family: var(--font-body);
}
.horizon-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(26, 111, 181, 0.25);
}
.horizon-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.horizon-btn-secondary {
  background: transparent;
  color: var(--primary-blue);
  border: 1.5px solid var(--primary-blue);
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.25s ease;
  cursor: pointer;
  font-family: var(--font-body);
}
.horizon-btn-secondary:hover {
  background: rgba(26, 111, 181, 0.06);
  transform: translateY(-2px);
}

.horizon-btn-small {
  background: transparent;
  color: var(--primary-blue);
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  font-family: var(--font-body);
}
.horizon-btn-small:hover {
  background: rgba(26, 111, 181, 0.08);
}

.alert-success {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #065f46;
}
.alert-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #7f1d1d;
}

.section-card {
  background: var(--white);
  border: 1px solid rgba(26, 111, 181, 0.12);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.4rem;
}

.form-required { color: var(--accent-gold); }

.channel-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.5rem;
}

.channel-btn {
  padding: 0.6rem 0.75rem;
  border: 1.5px solid rgba(26, 111, 181, 0.2);
  border-radius: 8px;
  background: var(--white);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  font-family: var(--font-body);
  white-space: nowrap;
}
.channel-btn:hover {
  border-color: var(--primary-blue);
  background: rgba(26, 111, 181, 0.05);
}
.channel-btn.active {
  background: var(--primary-blue);
  color: var(--white);
  border-color: var(--primary-blue);
}

.message-preview {
  background: rgba(26, 111, 181, 0.04);
  border-left: 3px solid var(--primary-blue);
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-dark);
  line-height: 1.5;
  margin-top: 0.5rem;
  white-space: pre-wrap;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}
.history-table thead {
  background: var(--light-bg);
  border-bottom: 1px solid rgba(26, 111, 181, 0.08);
}
.history-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.history-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(26, 111, 181, 0.06);
  color: var(--text-dark);
  font-size: 0.875rem;
  vertical-align: middle;
}
.history-table tbody tr:hover {
  background: rgba(26, 111, 181, 0.03);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge-pending   { background: rgba(245,158,11,0.1);  color: #b45309; }
.badge-completed { background: rgba(16,185,129,0.1);  color: #065f46; }
.badge-communication { background: rgba(59,130,246,0.1); color: #1e40af; }
.badge-action    { background: rgba(34,197,94,0.1);   color: #166534; }

.action-buttons {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
}
.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.45rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}
.action-btn.edit  { color: var(--primary-blue); }
.action-btn.edit:hover  { background: rgba(26,111,181,0.1); }
.action-btn.delete { color: var(--error-red); }
.action-btn.delete:hover { background: rgba(239,68,68,0.1); }

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}
.empty-state-icon {
  font-size: 2rem;
  color: var(--gray);
  margin-bottom: 0.5rem;
  opacity: 0.5;
}
.empty-state-text {
  color: var(--gray);
  font-size: 0.875rem;
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba(26, 111, 181, 0.1);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.tab-btn {
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  color: var(--gray);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
  font-size: 0.9rem;
  white-space: nowrap;
  flex-shrink: 0;
}
.tab-btn:hover  { color: var(--primary-blue); }
.tab-btn.active {
  color: var(--primary-blue);
  border-bottom-color: var(--primary-blue);
}

.divider {
  height: 1px;
  background: rgba(26, 111, 181, 0.08);
  margin: 1.5rem 0;
}

/* ── Mobile Card View ── */
.mobile-card-view { display: none; }

.intervention-card {
  background: var(--white);
  border: 1px solid rgba(26, 111, 181, 0.12);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin-bottom: 0.75rem;
}
.intervention-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}
.intervention-card-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-dark);
}
.intervention-card-body {
  font-size: 0.78rem;
  color: var(--gray);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}
.intervention-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(26, 111, 181, 0.06);
  font-size: 0.75rem;
  color: var(--gray);
}

/* ── Responsive Breakpoints ── */
@media (max-width: 640px) {
  .section-card { padding: 1rem; }
  .section-title { font-size: 0.95rem; }

  .form-grid { grid-template-columns: 1fr; gap: 0.75rem; }

  .channel-selector { grid-template-columns: repeat(2, 1fr); }
  .channel-btn { font-size: 0.75rem; padding: 0.55rem 0.5rem; }

  .tab-btn { padding: 0.65rem 1rem; font-size: 0.8rem; }

  .horizon-btn-primary,
  .horizon-btn-secondary {
    font-size: 0.8rem;
    padding: 0.6rem 0.875rem;
  }
  .horizon-btn-small { font-size: 0.7rem; padding: 0.35rem 0.6rem; }

  .form-label { font-size: 0.8rem; }

  .horizon-input {
    font-size: 0.875rem;
    padding: 0.6rem 0.75rem !important;
  }

  /* Switch table → cards on mobile */
  .history-table-wrapper { display: none; }
  .mobile-card-view { display: block; }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  .form-actions button { width: 100%; justify-content: center; }
}

@media (min-width: 641px) {
  .history-table-wrapper { display: block; }
  .mobile-card-view { display: none; }
}
`;

export default function InterventionsTab() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeSection, setActiveSection] = useState("communication");
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [showActionsForm, setShowActionsForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [communicationForm, setCommunicationForm] = useState({
    classId: "",
    studentId: "",
    interventionType: "Parent Communication",
    channel: "Phone Call",
    contactTarget: "Parent",
    message: "",
    followUpDate: "",
    status: "Pending",
  });

  const [actionsForm, setActionsForm] = useState({
    classId: "",
    studentId: "",
    actionType: "Counseling Done",
    description: "",
    outcome: "",
    actionDate: new Date().toISOString().split("T")[0],
    nextStep: "",
  });

  const [filters, setFilters] = useState({ classId: "", type: "" });

  const communicationTypes = [
    "Parent Communication", "Attendance Warning", "Counseling",
    "Academic Support", "Home Visit", "Other",
  ];
  const actionTypes = [
    "Counseling Done", "Parent Meeting Held", "Extra Class Conducted",
    "Home Visit Completed", "Other",
  ];

  useEffect(() => { loadClasses(); loadInterventions(); }, []);
  useEffect(() => { if (communicationForm.classId) loadStudents(communicationForm.classId); }, [communicationForm.classId]);
  useEffect(() => { if (actionsForm.classId) loadStudents(actionsForm.classId); }, [actionsForm.classId]);
  useEffect(() => { loadInterventions(); }, [filters]);

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      if (result.success) setClasses(result.classes || []);
    } catch (error) { console.error("Failed to load classes:", error); }
  };

  const loadStudents = async (classId) => {
    try {
      const result = await apiService.getStudents(classId);
      if (result.success) setStudents(result.students || []);
    } catch (error) { console.error("Failed to load students:", error); }
  };

  const loadInterventions = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      if (filters.classId) filterParams.classId = filters.classId;
      if (filters.type) filterParams.type = filters.type;
      const result = await apiService.getInterventions(filterParams);
      setInterventions(result.success ? result.interventions || [] : []);
    } catch (error) {
      console.error("Failed to load interventions:", error);
      setInterventions([]);
    } finally { setLoading(false); }
  };

  const handleCommunicationChange = (e) => {
    const { name, value } = e.target;
    setCommunicationForm((prev) => ({ ...prev, [name]: value }));
  };

  const generateAutoMessage = () => {
    const studentName = students.find((s) => s.id === communicationForm.studentId)?.name || "Student";
    const templates = {
      "Parent Communication": `Dear Parent/Guardian,\n\nWe are reaching out regarding ${studentName}'s progress at school. We would like to discuss this matter with you at your earliest convenience.\n\nBest regards,\nSchool Administration`,
      "Attendance Warning": `Dear Parent/Guardian,\n\nWe have noticed that ${studentName} has had several absences recently. Regular attendance is crucial for academic success. Please ensure ${studentName} attends school regularly.\n\nBest regards,\nSchool Administration`,
      "Academic Support": `Dear Parent/Guardian,\n\nWe wanted to inform you that ${studentName} may benefit from additional academic support. We are happy to discuss ways to help improve performance.\n\nBest regards,\nSchool Administration`,
      "Counseling": `Dear Parent/Guardian,\n\nWe would like to schedule a counseling session for ${studentName} to support their overall well-being. Please let us know your availability.\n\nBest regards,\nSchool Administration`,
      "Home Visit": `Dear Parent/Guardian,\n\nAs part of our engagement program, we would like to schedule a home visit to discuss ${studentName}'s progress. Please let us know a convenient time.\n\nBest regards,\nSchool Administration`,
    };
    const template = templates[communicationForm.interventionType] || templates["Parent Communication"];
    setCommunicationForm((prev) => ({ ...prev, message: template }));
  };

  const resetCommunicationForm = () => {
    setCommunicationForm({
      classId: "", studentId: "", interventionType: "Parent Communication",
      channel: "Phone Call", contactTarget: "Parent", message: "",
      followUpDate: "", status: "Pending",
    });
    setEditingId(null);
    setShowCommunicationForm(false);
  };

  const resetActionsForm = () => {
    setActionsForm({
      classId: "", studentId: "", actionType: "Counseling Done",
      description: "", outcome: "",
      actionDate: new Date().toISOString().split("T")[0], nextStep: "",
    });
    setEditingId(null);
    setShowActionsForm(false);
  };

  const handleCommunicationSubmit = async (e) => {
    e.preventDefault();
    if (!communicationForm.classId || !communicationForm.studentId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }
    if ((communicationForm.channel === "SMS" || communicationForm.channel === "Email") && !communicationForm.message) {
      setMessage({ type: "error", text: "Please provide a message" });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = {
        studentId: communicationForm.studentId,
        interventionType: communicationForm.interventionType,
        title: `${communicationForm.channel} - ${communicationForm.contactTarget}`,
        description: communicationForm.message || `${communicationForm.channel} communication with ${communicationForm.contactTarget}`,
        actionPlan: communicationForm.followUpDate ? `Follow up on ${communicationForm.followUpDate}` : null,
        startDate: new Date().toISOString().split("T")[0],
        targetDate: communicationForm.followUpDate || null,
        status: communicationForm.status.toLowerCase(),
        priority: "medium",
      };
      const result = editingId
        ? await apiService.updateIntervention(editingId, data)
        : await apiService.createIntervention(data);
      if (result.success) {
        setMessage({ type: "success", text: editingId ? "✓ Communication updated!" : "✓ Communication logged!" });
        setTimeout(() => { resetCommunicationForm(); loadInterventions(); setMessage({ type: "", text: "" }); }, 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to save" });
    } finally { setLoading(false); }
  };

  const handleActionsSubmit = async (e) => {
    e.preventDefault();
    if (!actionsForm.classId || !actionsForm.studentId) {
      setMessage({ type: "error", text: "Please select class and student" });
      return;
    }
    if (!actionsForm.description) {
      setMessage({ type: "error", text: "Please describe the action taken" });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = {
        studentId: actionsForm.studentId,
        interventionType: actionsForm.actionType,
        title: actionsForm.actionType,
        description: actionsForm.description,
        actionPlan: actionsForm.nextStep || null,
        expectedOutcome: actionsForm.outcome || null,
        startDate: actionsForm.actionDate,
        status: "completed",
        priority: "medium",
      };
      const result = editingId
        ? await apiService.updateIntervention(editingId, data)
        : await apiService.createIntervention(data);
      if (result.success) {
        setMessage({ type: "success", text: editingId ? "✓ Action updated!" : "✓ Action logged!" });
        setTimeout(() => { resetActionsForm(); loadInterventions(); setMessage({ type: "", text: "" }); }, 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to save" });
    } finally { setLoading(false); }
  };

  const handleEdit = (intervention) => {
    if (intervention.type === "communication") {
      setCommunicationForm({
        classId: intervention.classId || "",
        studentId: intervention.studentId,
        interventionType: intervention.interventionType,
        channel: intervention.channel || "Phone Call",
        contactTarget: intervention.contactTarget || "Parent",
        message: intervention.message || "",
        followUpDate: intervention.followUpDate || "",
        status: intervention.status,
      });
      setEditingId(intervention.id);
      setShowCommunicationForm(true);
      setActiveSection("communication");
    } else {
      setActionsForm({
        classId: intervention.classId || "",
        studentId: intervention.studentId,
        actionType: intervention.actionType,
        description: intervention.description || "",
        outcome: intervention.outcome || "",
        actionDate: intervention.actionDate,
        nextStep: intervention.nextStep || "",
      });
      setEditingId(intervention.id);
      setShowActionsForm(true);
      setActiveSection("actions");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const result = await apiService.deleteIntervention(id);
      if (result.success) {
        setMessage({ type: "success", text: "✓ Entry deleted successfully" });
        loadInterventions();
        setTimeout(() => setMessage({ type: "", text: "" }), 1500);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete" });
    }
  };

  const getChannelIcon = (channel) => {
    const icons = { "Phone Call": <FaPhone />, SMS: <FaSms />, Email: <FaEnvelope />, "In-person Meeting": <FaUser /> };
    return icons[channel] || null;
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");
  const truncate = (str, n = 50) => str ? (str.length > n ? str.substring(0, n) + "…" : str) : "";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          {message.type === "success"
            ? <FaCheckCircle className="mt-0.5 flex-shrink-0" />
            : <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "var(--font-heading)", color: "var(--text-dark)", fontSize: "1.5rem", fontWeight: 600 }}>
          Intervention Actions
        </h3>
        <p style={{ color: "var(--gray)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Fast tracking for student support interventions
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeSection === "communication" ? "active" : ""}`} onClick={() => setActiveSection("communication")}>
          💬 Quick Communication
        </button>
        <button className={`tab-btn ${activeSection === "actions" ? "active" : ""}`} onClick={() => setActiveSection("actions")}>
          📋 Action &amp; Notes Log
        </button>
      </div>

      {/* ── COMMUNICATION SECTION ── */}
      {activeSection === "communication" && (
        <div className="section-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h4 className="section-title">⚡ Quick Communication Intervention</h4>
            <button
              onClick={() => setShowCommunicationForm(!showCommunicationForm)}
              className="horizon-btn-primary px-4 py-2 text-sm inline-flex items-center gap-2"
            >
              <FaPlus style={{ fontSize: "0.7rem" }} />
              {showCommunicationForm ? "Cancel" : "New Communication"}
            </button>
          </div>

          {showCommunicationForm && (
            <form onSubmit={handleCommunicationSubmit} style={{ borderTop: "1px solid rgba(26,111,181,0.1)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Class <span className="form-required">*</span></label>
                  <select name="classId" value={communicationForm.classId} onChange={handleCommunicationChange} className="horizon-input px-4 py-2.5 text-sm" required>
                    <option value="">Select class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Student <span className="form-required">*</span></label>
                  <select name="studentId" value={communicationForm.studentId} onChange={handleCommunicationChange} className="horizon-input px-4 py-2.5 text-sm" disabled={!communicationForm.classId} required>
                    <option value="">Select student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.enrollmentNo})</option>)}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Communication Type <span className="form-required">*</span></label>
                  <select name="interventionType" value={communicationForm.interventionType} onChange={handleCommunicationChange} className="horizon-input px-4 py-2.5 text-sm" required>
                    {communicationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Target <span className="form-required">*</span></label>
                  <div className="channel-selector">
                    {["Parent", "Student"].map(target => (
                      <button key={target} type="button" className={`channel-btn ${communicationForm.contactTarget === target ? "active" : ""}`} onClick={() => setCommunicationForm(p => ({ ...p, contactTarget: target }))}>
                        {target}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Channel <span className="form-required">*</span></label>
                <div className="channel-selector">
                  {["Phone Call", "SMS", "Email", "In-person Meeting"].map(ch => (
                    <button key={ch} type="button" className={`channel-btn ${communicationForm.channel === ch ? "active" : ""}`} onClick={() => setCommunicationForm(p => ({ ...p, channel: ch }))}>
                      {getChannelIcon(ch)} <span>{ch}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(communicationForm.channel === "SMS" || communicationForm.channel === "Email") && (
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Message <span className="form-required">*</span></label>
                    <button type="button" onClick={generateAutoMessage} className="horizon-btn-small inline-flex items-center gap-1">
                      <FaMagic /> Auto Generate
                    </button>
                  </div>
                  <textarea
                    name="message"
                    value={communicationForm.message}
                    onChange={handleCommunicationChange}
                    rows="4"
                    placeholder="Type your message here or click 'Auto Generate' for a template..."
                    className="horizon-input px-4 py-3 text-sm"
                    style={{ resize: "none" }}
                  />
                  {communicationForm.message && (
                    <div className="message-preview"><strong>Preview:</strong><br />{communicationForm.message}</div>
                  )}
                </div>
              )}

              <div className="form-grid" style={{ marginBottom: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Follow-up Date</label>
                  <input type="date" name="followUpDate" value={communicationForm.followUpDate} onChange={handleCommunicationChange} className="horizon-input px-4 py-2.5 text-sm" />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" value={communicationForm.status} onChange={handleCommunicationChange} className="horizon-input px-4 py-2.5 text-sm">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid rgba(26,111,181,0.1)" }}>
                <button type="button" onClick={resetCommunicationForm} className="horizon-btn-secondary px-4 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
                  {loading ? <><FaSpinner className="animate-spin" /> Saving…</> : (editingId ? "Update Communication" : "Log Communication")}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── ACTIONS SECTION ── */}
      {activeSection === "actions" && (
        <div className="section-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h4 className="section-title">📝 Action &amp; Follow-up Notes</h4>
            <button onClick={() => setShowActionsForm(!showActionsForm)} className="horizon-btn-primary px-4 py-2 text-sm inline-flex items-center gap-2">
              <FaPlus style={{ fontSize: "0.7rem" }} />
              {showActionsForm ? "Cancel" : "New Action"}
            </button>
          </div>

          {showActionsForm && (
            <form onSubmit={handleActionsSubmit} style={{ borderTop: "1px solid rgba(26,111,181,0.1)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Class <span className="form-required">*</span></label>
                  <select name="classId" value={actionsForm.classId} onChange={(e) => setActionsForm(p => ({ ...p, classId: e.target.value }))} className="horizon-input px-4 py-2.5 text-sm" required>
                    <option value="">Select class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Student <span className="form-required">*</span></label>
                  <select name="studentId" value={actionsForm.studentId} onChange={(e) => setActionsForm(p => ({ ...p, studentId: e.target.value }))} className="horizon-input px-4 py-2.5 text-sm" disabled={!actionsForm.classId} required>
                    <option value="">Select student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.enrollmentNo})</option>)}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Action Type <span className="form-required">*</span></label>
                  <select name="actionType" value={actionsForm.actionType} onChange={(e) => setActionsForm(p => ({ ...p, actionType: e.target.value }))} className="horizon-input px-4 py-2.5 text-sm" required>
                    {actionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date <span className="form-required">*</span></label>
                  <input type="date" name="actionDate" value={actionsForm.actionDate} onChange={(e) => setActionsForm(p => ({ ...p, actionDate: e.target.value }))} className="horizon-input px-4 py-2.5 text-sm" required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">What did you do? <span className="form-required">*</span></label>
                <textarea name="description" value={actionsForm.description} onChange={(e) => setActionsForm(p => ({ ...p, description: e.target.value }))} rows="3" placeholder="Describe the action taken…" className="horizon-input px-4 py-3 text-sm" style={{ resize: "none" }} required />
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Outcome (What changed?)</label>
                <textarea name="outcome" value={actionsForm.outcome} onChange={(e) => setActionsForm(p => ({ ...p, outcome: e.target.value }))} rows="3" placeholder="Describe any changes observed…" className="horizon-input px-4 py-3 text-sm" style={{ resize: "none" }} />
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Next Step</label>
                <input type="text" name="nextStep" value={actionsForm.nextStep} onChange={(e) => setActionsForm(p => ({ ...p, nextStep: e.target.value }))} placeholder="What's the next action needed?" className="horizon-input px-4 py-2.5 text-sm" />
              </div>

              <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid rgba(26,111,181,0.1)" }}>
                <button type="button" onClick={resetActionsForm} className="horizon-btn-secondary px-4 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
                  {loading ? <><FaSpinner className="animate-spin" /> Saving…</> : (editingId ? "Update Action" : "Log Action")}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="divider" />

      {/* ── FILTERS ── */}
      <div className="section-card">
        <h4 className="section-title" style={{ marginBottom: "0.75rem" }}>🔍 History Filters</h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Class</label>
            <select name="classId" value={filters.classId} onChange={(e) => setFilters(p => ({ ...p, classId: e.target.value }))} className="horizon-input px-4 py-2.5 text-sm">
              <option value="">All Classes</option>
              {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select name="type" value={filters.type} onChange={(e) => setFilters(p => ({ ...p, type: e.target.value }))} className="horizon-input px-4 py-2.5 text-sm">
              <option value="">All Types</option>
              <option value="communication">Communication</option>
              <option value="action">Action</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── HISTORY TABLE ── */}
      <div className="section-card">
        <h4 className="section-title" style={{ marginBottom: "1rem" }}>📊 Intervention History</h4>

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaSpinner className="animate-spin" /></div>
            <p className="empty-state-text">Loading interventions…</p>
          </div>
        ) : interventions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">No interventions logged yet</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="history-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Channel / Action</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((iv) => (
                    <tr key={iv.id}>
                      <td><strong>{iv.studentName}</strong></td>
                      <td>
                        <span className={`badge ${iv.type === "communication" ? "badge-communication" : "badge-action"}`}>
                          {iv.type === "communication" ? "💬 Communication" : "📋 Action"}
                        </span>
                      </td>
                      <td>
                        <div><strong>{iv.interventionType || iv.actionType}</strong></div>
                        <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: "0.2rem" }}>
                          {iv.type === "communication"
                            ? `${iv.contactTarget} — ${truncate(iv.message)}`
                            : truncate(iv.description)}
                        </div>
                      </td>
                      <td>
                        {iv.channel ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}>
                            {getChannelIcon(iv.channel)} {iv.channel}
                          </div>
                        ) : <span style={{ color: "var(--gray)" }}>—</span>}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatDate(iv.followUpDate || iv.actionDate)}</td>
                      <td>
                        <span className={`badge ${iv.status === "Completed" || iv.status === "completed" ? "badge-completed" : "badge-pending"}`}>
                          {iv.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(iv)} className="action-btn edit" title="Edit"><FaEdit /></button>
                          <button onClick={() => handleDelete(iv.id)} className="action-btn delete" title="Delete"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-card-view">
              {interventions.map((iv) => (
                <div key={iv.id} className="intervention-card">
                  <div className="intervention-card-header">
                    <div>
                      <div className="intervention-card-title">{iv.studentName}</div>
                      <span className={`badge ${iv.type === "communication" ? "badge-communication" : "badge-action"}`} style={{ marginTop: "0.3rem", display: "inline-flex" }}>
                        {iv.type === "communication" ? "💬 Communication" : "📋 Action"}
                      </span>
                    </div>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(iv)} className="action-btn edit" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDelete(iv.id)} className="action-btn delete" title="Delete"><FaTrash /></button>
                    </div>
                  </div>
                  <div className="intervention-card-body">
                    <div><strong>{iv.interventionType || iv.actionType}</strong></div>
                    <div style={{ marginTop: "0.2rem" }}>
                      {iv.type === "communication"
                        ? `${iv.contactTarget} — ${truncate(iv.message, 60)}`
                        : truncate(iv.description, 60)}
                    </div>
                  </div>
                  <div className="intervention-card-row">
                    {iv.channel ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        {getChannelIcon(iv.channel)} {iv.channel}
                      </div>
                    ) : <span>—</span>}
                    <span>{formatDate(iv.followUpDate || iv.actionDate)}</span>
                    <span className={`badge ${iv.status === "Completed" || iv.status === "completed" ? "badge-completed" : "badge-pending"}`}>
                      {iv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}