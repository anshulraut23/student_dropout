import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import SubjectTable from '../../components/admin/subjects/SubjectTable';
import AddEditSubjectModal from '../../components/admin/subjects/AddEditSubjectModal';
import { FaPlus, FaBook, FaCheckCircle, FaUsers, FaFilter } from 'react-icons/fa';
import { injectHorizonStyles, HORIZON_COLORS } from '../../styles/horizonTheme';

/* ══════════════════════════════════════════════════════════════════════════
   HORIZON THEME STYLES - SUBJECT MANAGEMENT
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

  .sm-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  /* Hero Section */
  .sm-hero {
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

  .sm-hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .sm-hero-tag {
    display: inline-block;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .sm-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .sm-hero-subtitle {
    font-size: 0.9rem;
    font-weight: 300;
    color: white;
    margin: 0;
  }

  .sm-hero-actions {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 0.75rem;
  }

  /* Main Content */
  .sm-main {
    padding: 2.5rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Stats Grid */
  .sm-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .sm-stat-card {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    animation: fadeUp 0.6s ease-out 0.2s both;
  }

  .sm-stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(26, 111, 181, 0.25);
    box-shadow: 0 8px 24px rgba(26, 111, 181, 0.1);
  }

  .sm-stat-label {
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

  .sm-stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .sm-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--sky-blue);
    margin-top: 0.5rem;
  }

  /* Filter Section */
  .sm-filter-section {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    animation: fadeUp 0.8s ease-out 0.25s both;
  }

  .sm-filter-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sm-filter-select {
    width: 100%;
    max-width: 350px;
    padding: 0.85rem 1rem;
    border: 1.5px solid rgba(26, 111, 181, 0.15);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: var(--text-dark);
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .sm-filter-select:focus {
    outline: none;
    border-color: var(--sky-blue);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.1);
  }

  .sm-filter-select:hover {
    border-color: rgba(26, 111, 181, 0.25);
  }

  /* Table Section */
  .sm-table-section {
    animation: fadeUp 0.8s ease-out 0.3s both;
  }

  .sm-table-card {
    background: white;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  /* Buttons */
  .sm-btn-primary {
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

  .sm-btn-primary:hover {
    background: #e09400;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(240, 165, 0, 0.35);
  }

  /* Loading Spinner */
  .sm-spinner {
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
  .sm-error-box {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #dc2626;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }
`;

function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // Inject both Horizon theme and Subject Management styles on mount
  useEffect(() => {
    injectHorizonStyles();
    // Inject SubjectManagement styles
    const styleTag = document.createElement('style');
    styleTag.textContent = STYLES;
    document.head.appendChild(styleTag);
    return () => styleTag.remove();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [subjectsResult, classesResult] = await Promise.all([
        apiService.getSubjects(),
        apiService.getClasses()
      ]);

      if (subjectsResult.success) {
        setSubjects(subjectsResult.subjects || []);
      }

      if (classesResult.success) {
        setClasses(classesResult.classes || []);
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setModalOpen(true);
  };

  const handleEditSubject = (subjectData) => {
    setSelectedSubject(subjectData);
    setModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        const result = await apiService.deleteSubject(subjectId);
        if (result.success) {
          loadData();
        } else {
          alert(result.error || 'Failed to delete subject');
        }
      } catch (err) {
        alert(err.message || 'Failed to delete subject');
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedSubject(null);
    setModalOpen(false);
  };

  const handleSuccess = () => {
    loadData();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="sm-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="sm-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sm-container">
        <div className="sm-main">
          <div className="sm-error-box">{error}</div>
        </div>
      </div>
    );
  }

  // Filter subjects by selected class
  const filteredSubjects = selectedClassFilter === 'all' 
    ? subjects 
    : subjects.filter(s => s.classId === selectedClassFilter);

  const stats = [
    {
      label: 'Total Subjects',
      value: subjects.length,
      icon: FaBook,
      color: 'blue',
      bgColor: 'rgba(26, 111, 181, 0.15)'
    },
    {
      label: 'Active Subjects',
      value: subjects.filter(s => s.status === 'active').length,
      icon: FaCheckCircle,
      color: 'green',
      bgColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      label: 'Assigned Teachers',
      value: subjects.filter(s => s.teacherId).length,
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
    <div className="sm-container">
      {/* Hero Section */}
      <div className="sm-hero">
        <div className="sm-hero-content">
          <span className="sm-hero-tag">SUBJECT MANAGEMENT</span>
          <h1 className="sm-hero-title">Manage Subjects</h1>
          <p className="sm-hero-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="sm-hero-actions">
          <button onClick={handleAddSubject} className="sm-btn-primary">
            <FaPlus /> Add Subject
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="sm-main">
        {/* Stats Section */}
        <div className="sm-stats">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="sm-stat-card">
                <div className="sm-stat-label">
                  <span>{stat.label}</span>
                  <div className="sm-stat-icon" style={{ background: stat.bgColor }}>
                    <Icon size={18} style={{ color: colorMap[stat.color] }} />
                  </div>
                </div>
                <p className="sm-stat-value">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Filter Section */}
        <div className="sm-filter-section">
          <label className="sm-filter-label">
            <FaFilter /> Filter by Class
          </label>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="sm-filter-select"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - Grade {cls.grade}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Table Section */}
        <div className="sm-table-section">
          <div className="sm-table-card">
            <SubjectTable
              subjects={filteredSubjects}
              onEdit={handleEditSubject}
              onDelete={handleDeleteSubject}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditSubjectModal
          subjectData={selectedSubject}
          classes={classes}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default SubjectManagement;
