import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import apiService from '../../services/apiService';
import AddEditTemplateModal from '../../components/admin/exams/AddEditTemplateModal';
import { injectHorizonStyles } from '../../styles/horizonTheme';

/* ══════════════════════════════════════════════════════════════════════════
   HORIZON THEME STYLES - EXAM TEMPLATE MANAGEMENT
   ══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --sky-blue: #1a6fb5;
    --sky-light: #2d8fd4;
    --sky-deep: #0e4a80;
    --accent-gold: #f0a500;
    --slate: #3c4a5a;
    --gray: #6b7a8d;
    --light-bg: #f5f8fb;
    --text-dark: #1e2c3a;
    --white: #ffffff;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .etm-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  /* Hero Section */
  .etm-hero {
    position: relative;
    background: linear-gradient(135deg, #1a5a96 0%, #1a6fb5 100%);
    padding: 2rem 3rem;
    color: white;
    border-radius: 20px;
    margin: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(26, 111, 181, 0.15);
  }

  .etm-hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .etm-hero-tag {
    display: inline-block;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .etm-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .etm-hero-subtitle {
    font-size: 0.9rem;
    font-weight: 300;
    color: white;
    margin: 0;
  }

  .etm-hero-actions {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 0.75rem;
  }

  /* Main Content */
  .etm-main {
    padding: 2.5rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Stats Section */
  .etm-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .etm-stat-badge {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    animation: fadeUp 0.6s ease-out 0.2s both;
  }

  .etm-stat-badge:hover {
    border-color: rgba(26, 111, 181, 0.25);
    box-shadow: 0 4px 12px rgba(26, 111, 181, 0.08);
  }

  .etm-stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--gray);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .etm-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--sky-blue);
  }

  /* Info Banner */
  .etm-info-banner {
    background: linear-gradient(135deg, rgba(26, 111, 181, 0.08) 0%, rgba(26, 111, 181, 0.04) 100%);
    border: 1px solid rgba(26, 111, 181, 0.15);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
    animation: fadeUp 0.8s ease-out 0.15s both;
  }

  .etm-info-icon {
    color: var(--sky-blue);
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  .etm-info-content {
    flex: 1;
  }

  .etm-info-title {
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .etm-info-text {
    font-size: 0.85rem;
    color: var(--gray);
    line-height: 1.5;
  }

  /* Filter Section */
  .etm-filter-tabs {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    animation: fadeUp 0.8s ease-out 0.2s both;
  }

  .etm-filter-btn {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    background: white;
    color: var(--text-dark);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .etm-filter-btn:hover {
    border-color: rgba(26, 111, 181, 0.4);
    background: rgba(26, 111, 181, 0.05);
  }

  .etm-filter-btn.active {
    background: var(--sky-blue);
    color: white;
    border-color: var(--sky-blue);
    box-shadow: 0 4px 12px rgba(26, 111, 181, 0.25);
  }

  /* Templates Grid */
  .etm-templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  /* Template Card */
  .etm-template-card {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    animation: fadeUp 0.6s ease-out 0.25s both;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .etm-template-card:hover {
    transform: translateY(-4px);
    border-color: rgba(26, 111, 181, 0.25);
    box-shadow: 0 8px 24px rgba(26, 111, 181, 0.1);
  }

  .etm-template-card.inactive {
    opacity: 0.75;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 248, 251, 0.8));
  }

  .etm-template-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 0.75rem;
  }

  .etm-template-info {
    flex: 1;
  }

  .etm-template-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  .etm-template-type {
    display: inline-block;
    background: rgba(26, 111, 181, 0.1);
    color: var(--sky-blue);
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .etm-template-status {
    font-size: 1.5rem;
  }

  .etm-template-description {
    font-size: 0.85rem;
    color: var(--gray);
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  /* Template Details Grid */
  .etm-template-details {
    background: linear-gradient(135deg, rgba(26, 111, 181, 0.04) 0%, rgba(26, 111, 181, 0.02) 100%);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .etm-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
  }

  .etm-detail-label {
    color: var(--gray);
    font-weight: 500;
  }

  .etm-detail-value {
    color: var(--sky-blue);
    font-weight: 700;
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
  }

  /* Usage Stats */
  .etm-usage-stats {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%);
    border: 1px solid rgba(16, 185, 129, 0.15);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
  }

  .etm-usage-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 0.5rem;
  }

  .etm-usage-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
  }

  .etm-usage-row:last-child {
    margin-bottom: 0;
  }

  .etm-usage-count {
    color: var(--success);
    font-weight: 700;
  }

  /* Template Actions */
  .etm-template-actions {
    display: grid;
    grid-template-columns: 1fr 1fr 0.5fr;
    gap: 0.5rem;
    margin-top: auto;
  }

  .etm-btn-edit, .etm-btn-toggle, .etm-btn-delete {
    padding: 0.65rem;
    border: none;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }

  .etm-btn-edit {
    background: rgba(26, 111, 181, 0.1);
    color: var(--sky-blue);
    border: 1px solid rgba(26, 111, 181, 0.2);
  }

  .etm-btn-edit:hover {
    background: rgba(26, 111, 181, 0.2);
    border-color: var(--sky-blue);
  }

  .etm-btn-toggle {
    background: rgba(240, 165, 0, 0.1);
    color: var(--accent-gold);
    border: 1px solid rgba(240, 165, 0, 0.2);
  }

  .etm-btn-toggle:hover {
    background: rgba(240, 165, 0, 0.2);
    border-color: var(--accent-gold);
  }

  .etm-btn-delete {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .etm-btn-delete:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
    border-color: var(--danger);
  }

  .etm-btn-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Empty State */
  .etm-empty-state {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 3rem 2rem;
    text-align: center;
    animation: fadeUp 0.6s ease-out 0.2s both;
  }

  .etm-empty-icon {
    font-size: 3rem;
    color: rgba(26, 111, 181, 0.3);
    margin-bottom: 1rem;
  }

  .etm-empty-text {
    color: var(--gray);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .etm-empty-btn {
    background: var(--sky-blue);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .etm-empty-btn:hover {
    background: var(--sky-deep);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 111, 181, 0.25);
  }

  /* Loading State */
  .etm-loading {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--gray);
  }

  .etm-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(26, 111, 181, 0.2);
    border-top-color: var(--sky-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Buttons */
  .etm-btn-primary {
    background: var(--accent-gold);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(240, 165, 0, 0.25);
  }

  .etm-btn-primary:hover {
    background: #e09400;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(240, 165, 0, 0.35);
  }
`;

export default function ExamTemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  // Inject both Horizon theme and Exam Template Management styles on mount
  useEffect(() => {
    injectHorizonStyles();
    // Inject ExamTemplateManagement styles
    const styleTag = document.createElement('style');
    styleTag.textContent = STYLES;
    document.head.appendChild(styleTag);
    return () => styleTag.remove();
  }, []);

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
    <div className="etm-container">
      {/* Hero Section */}
      <div className="etm-hero">
        <div className="etm-hero-content">
          <span className="etm-hero-tag">EXAM TEMPLATE MANAGEMENT</span>
          <h1 className="etm-hero-title">Manage Templates</h1>
          <p className="etm-hero-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="etm-hero-actions">
          <button onClick={handleCreate} className="etm-btn-primary">
            <FaPlus /> Create Template
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="etm-main">
        {/* Stats Section */}
        <div className="etm-stats">
          <div className="etm-stat-badge">
            <div className="etm-stat-label">Total Templates</div>
            <div className="etm-stat-value">{templates.length}</div>
          </div>
          <div className="etm-stat-badge">
            <div className="etm-stat-label">Active</div>
            <div className="etm-stat-value">{templates.filter(t => t.isActive).length}</div>
          </div>
          <div className="etm-stat-badge">
            <div className="etm-stat-label">In Use</div>
            <div className="etm-stat-value">{templates.filter(t => t.isUsed).length}</div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="etm-info-banner">
          <div className="etm-info-icon">
            <FaInfoCircle />
          </div>
          <div className="etm-info-content">
            <div className="etm-info-title">How Exam Templates Work</div>
            <div className="etm-info-text">
              When you create a template, the system automatically generates exams for ALL subjects in ALL classes. This ensures consistent marking schemes across your school and provides clean data for dropout prediction.
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="etm-filter-tabs">
          <button
            onClick={() => setFilter('all')}
            className={`etm-filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Templates
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`etm-filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`etm-filter-btn ${filter === 'inactive' ? 'active' : ''}`}
          >
            Inactive
          </button>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="etm-loading">
            <div className="etm-spinner"></div>
            <p>Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="etm-empty-state">
            <div className="etm-empty-icon">
              <FaFileAlt />
            </div>
            <p className="etm-empty-text">No templates found. Create your first template to get started.</p>
            <button onClick={handleCreate} className="etm-empty-btn">
              <FaPlus /> Create Template
            </button>
          </div>
        ) : (
          <div className="etm-templates-grid">
            {templates.map((template) => (
              <div key={template.id} className={`etm-template-card ${!template.isActive ? 'inactive' : ''}`}>
                {/* Header */}
                <div className="etm-template-header">
                  <div className="etm-template-info">
                    <div className="etm-template-name">{template.name}</div>
                    <span className="etm-template-type">{getTypeLabel(template.type)}</span>
                  </div>
                  <div className="etm-template-status">
                    {template.isActive ? (
                      <FaToggleOn style={{ color: '#10b981' }} />
                    ) : (
                      <FaToggleOff style={{ color: 'rgba(26, 111, 181, 0.3)' }} />
                    )}
                  </div>
                </div>

                {/* Description */}
                {template.description && (
                  <p className="etm-template-description">{template.description}</p>
                )}

                {/* Details Grid */}
                <div className="etm-template-details">
                  <div className="etm-detail-item">
                    <span className="etm-detail-label">Total Marks</span>
                    <span className="etm-detail-value">{template.totalMarks}</span>
                  </div>
                  <div className="etm-detail-item">
                    <span className="etm-detail-label">Passing</span>
                    <span className="etm-detail-value">{template.passingMarks}</span>
                  </div>
                  <div className="etm-detail-item">
                    <span className="etm-detail-label">Weightage</span>
                    <span className="etm-detail-value">{(template.weightage * 100).toFixed(0)}%</span>
                  </div>
                  <div className="etm-detail-item">
                    <span className="etm-detail-label">Order</span>
                    <span className="etm-detail-value">#{template.orderSequence}</span>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="etm-usage-stats">
                  <div className="etm-usage-label">Usage</div>
                  <div className="etm-usage-row">
                    <span>Periods:</span>
                    <span className="etm-usage-count">{template.periodsCount || 0}</span>
                  </div>
                  <div className="etm-usage-row">
                    <span>Exams:</span>
                    <span className="etm-usage-count">{template.examsCount || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="etm-template-actions">
                  <button onClick={() => handleEdit(template)} className="etm-btn-edit" title="Edit template">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleToggleStatus(template)} className="etm-btn-toggle" title={template.isActive ? 'Deactivate' : 'Activate'}>
                    {template.isActive ? <FaToggleOff /> : <FaToggleOn />}
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    disabled={template.isUsed}
                    className="etm-btn-delete"
                    title={template.isUsed ? 'Cannot delete template in use' : 'Delete template'}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
