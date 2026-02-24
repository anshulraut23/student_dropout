import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import ClassTable from '../../components/admin/classes/ClassTable';
import AddEditClassModal from '../../components/admin/classes/AddEditClassModal';
import { FaPlus, FaSchool, FaCheckCircle, FaUsers, FaDownload } from 'react-icons/fa';
import { injectHorizonStyles, HORIZON_COLORS } from '../../styles/horizonTheme';

/* ══════════════════════════════════════════════════════════════════════════
   HORIZON THEME STYLES - CLASS MANAGEMENT
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

  .cm-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  /* Hero Section */
  .cm-hero {
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

  .cm-hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .cm-hero-tag {
    display: inline-block;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .cm-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .cm-hero-subtitle {
    font-size: 0.9rem;
    font-weight: 300;
    color: white;
    margin: 0;
  }

  .cm-hero-actions {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 0.75rem;
  }

  /* Main Content */
  .cm-main {
    padding: 2.5rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .cm-section-header {
    margin-bottom: 2rem;
    animation: fadeUp 0.8s ease-out 0.1s both;
  }

  /* Stats Grid */
  .cm-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .cm-stat-card {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    animation: fadeUp 0.6s ease-out 0.2s both;
  }

  .cm-stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(26, 111, 181, 0.25);
    box-shadow: 0 8px 24px rgba(26, 111, 181, 0.1);
  }

  .cm-stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--gray);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cm-stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .cm-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--sky-blue);
    margin-top: 0.5rem;
  }

  /* Table Section */
  .cm-table-section {
    animation: fadeUp 0.8s ease-out 0.3s both;
  }

  .cm-table-card {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  /* Buttons */
  .cm-btn-primary {
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

  .cm-btn-primary:hover {
    background: #e09400;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(240, 165, 0, 0.35);
  }

  .cm-btn-secondary {
    background: transparent;
    color: var(--sky-blue);
    border: 1.5px solid var(--sky-blue);
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cm-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.08);
    border-color: var(--sky-light);
  }

  /* Modal Overlay */
  .cm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Loading Spinner */
  .cm-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(26, 111, 181, 0.2);
    border-top-color: var(--sky-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error State */
  .cm-error-box {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #dc2626;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }
`;

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState('');

  // Inject both Horizon theme and Class Management styles on mount
  useEffect(() => {
    injectHorizonStyles();
    // Inject ClassManagement styles
    const styleTag = document.createElement('style');
    styleTag.textContent = STYLES;
    document.head.appendChild(styleTag);
    return () => styleTag.remove();
  }, []);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getClasses();
      if (result.success) {
        setClasses(result.classes || []);
      } else {
        setError(result.error || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Load classes error:', err);
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setModalOpen(true);
  };

  const handleEditClass = (classData) => {
    setSelectedClass(classData);
    setModalOpen(true);
  };

  const handleDeactivate = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const result = await apiService.deleteClass(classId);
        if (result.success) {
          loadClasses();
        } else {
          alert(result.error || 'Failed to delete class');
        }
      } catch (err) {
        alert(err.message || 'Failed to delete class');
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
    setModalOpen(false);
  };

  const handleSuccess = () => {
    loadClasses();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="cm-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="cm-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cm-container">
        <div className="cm-main">
          <div className="cm-error-box">{error}</div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Classes',
      value: classes.length,
      icon: FaSchool,
      color: 'blue',
      bgColor: 'rgba(26, 111, 181, 0.15)'
    },
    {
      label: 'Active Classes',
      value: classes.filter(c => c.status === 'active').length,
      icon: FaCheckCircle,
      color: 'green',
      bgColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      label: 'Total Students',
      value: classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
      icon: FaUsers,
      color: 'purple',
      bgColor: 'rgba(139, 92, 246, 0.15)'
    }
  ];

  const colorMap = {
    blue: '#1a6fb5',
    green: '#10b981',
    purple: '#8b5cf6'
  };

  return (
    <div className="cm-container">
      {/* Hero Section */}
      <div className="cm-hero">
        <div className="cm-hero-content">
          <span className="cm-hero-tag">CLASS MANAGEMENT</span>
          <h1 className="cm-hero-title">Manage Classes</h1>
          <p className="cm-hero-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="cm-hero-actions">
          <button onClick={handleAddClass} className="cm-btn-primary">
            <FaPlus /> Add Class
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="cm-main">
        {/* Stats Section */}
        <div className="cm-stats">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="cm-stat-card">
                <div className="cm-stat-label">
                  <span>{stat.label}</span>
                  <div className="cm-stat-icon" style={{ background: stat.bgColor }}>
                    <Icon size={18} style={{ color: colorMap[stat.color] }} />
                  </div>
                </div>
                <p className="cm-stat-value">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Class Table Section */}
        <div className="cm-table-section">
          <div className="cm-table-card">
            <ClassTable
              classes={classes}
              onEdit={handleEditClass}
              onDeactivate={handleDeactivate}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditClassModal
          classData={selectedClass}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default ClassManagement;
