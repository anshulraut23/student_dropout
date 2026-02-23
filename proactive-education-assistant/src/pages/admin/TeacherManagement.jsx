import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { approvalService } from '../../services/approvalService';
import apiService from '../../services/apiService';
import { 
  FaUserCheck, FaUserClock, FaUserTimes, FaUsers, FaChalkboard,
  FaSearch, FaFilter, FaDownload, FaTimes, FaCheck, FaUserPlus,
  FaEye, FaSort, FaCheckCircle, FaTimesCircle, FaClock
} from 'react-icons/fa';

/* ══════════════════════════════════════════════════════════════════════════
   HORIZON THEME STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .tm-container {
    min-height: 100vh;
    background: var(--light, #f5f8fb);
    padding: 1.5rem;
    font-family: 'DM Sans', sans-serif;
  }

  .tm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .tm-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.75rem;
    color: var(--text, #1e2c3a);
    line-height: 1.2;
    margin: 0;
  }

  .tm-subtitle {
    font-size: 0.875rem;
    color: var(--gray, #6b7a8d);
    margin-top: 0.25rem;
  }

  .tm-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .tm-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .tm-btn-primary {
    background: var(--sky, #1a6fb5);
    color: white;
  }
  .tm-btn-primary:hover {
    background: var(--sky-deep, #0e4a80);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 111, 181, 0.3);
  }

  .tm-btn-secondary {
    background: white;
    color: var(--text, #1e2c3a);
    border: 1px solid rgba(26, 111, 181, 0.2);
  }
  .tm-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.05);
    border-color: var(--sky, #1a6fb5);
  }

  /* Stats Cards */
  .tm-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .tm-stat-card {
    background: white;
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid rgba(26, 111, 181, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .tm-stat-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent-color);
  }

  .tm-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(26, 111, 181, 0.15);
  }

  .tm-stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .tm-stat-label {
    font-size: 0.8rem;
    color: var(--gray, #6b7a8d);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tm-stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--icon-bg);
    color: var(--icon-color);
  }

  .tm-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    color: var(--text, #1e2c3a);
    font-weight: 600;
    line-height: 1;
  }

  /* Filter Bar */
  .tm-filter-bar {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(26, 111, 181, 0.1);
    margin-bottom: 1.5rem;
  }

  .tm-filter-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .tm-search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
  }

  .tm-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray, #6b7a8d);
  }

  .tm-search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }

  .tm-search-input:focus {
    outline: none;
    border-color: var(--sky, #1a6fb5);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.1);
  }

  .tm-filter-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tm-tab {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    background: transparent;
    color: var(--gray, #6b7a8d);
  }

  .tm-tab:hover {
    background: rgba(26, 111, 181, 0.05);
  }

  .tm-tab.active {
    background: var(--sky, #1a6fb5);
    color: white;
    border-color: var(--sky, #1a6fb5);
  }

  /* Table */
  .tm-table-container {
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(26, 111, 181, 0.1);
    overflow: hidden;
  }

  .tm-table {
    width: 100%;
    border-collapse: collapse;
  }

  .tm-table thead {
    background: linear-gradient(135deg, rgba(26, 111, 181, 0.05) 0%, rgba(26, 111, 181, 0.02) 100%);
  }

  .tm-table th {
    padding: 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text, #1e2c3a);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid rgba(26, 111, 181, 0.1);
  }

  .tm-table td {
    padding: 1rem;
    border-bottom: 1px solid rgba(26, 111, 181, 0.06);
    font-size: 0.875rem;
  }

  .tm-table tbody tr {
    transition: background 0.2s ease;
  }

  .tm-table tbody tr:hover {
    background: rgba(26, 111, 181, 0.02);
  }

  .tm-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--sky, #1a6fb5), #2d8fd4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
  }

  .tm-teacher-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .tm-teacher-name {
    font-weight: 600;
    color: var(--text, #1e2c3a);
    margin-bottom: 0.125rem;
  }

  .tm-teacher-email {
    font-size: 0.75rem;
    color: var(--gray, #6b7a8d);
  }

  .tm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid;
  }

  .tm-badge-pending {
    background: rgba(240, 165, 0, 0.1);
    color: var(--accent, #f0a500);
    border-color: rgba(240, 165, 0, 0.3);
  }

  .tm-badge-approved {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border-color: rgba(16, 185, 129, 0.3);
  }

  .tm-badge-rejected {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }

  .tm-subject-tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: rgba(124, 58, 237, 0.1);
    color: #7c3aed;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .tm-action-btn {
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .tm-action-approve {
    color: #10b981;
    border-color: rgba(16, 185, 129, 0.3);
  }
  .tm-action-approve:hover {
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
  }

  .tm-action-assign {
    color: var(--sky, #1a6fb5);
    border-color: rgba(26, 111, 181, 0.3);
  }
  .tm-action-assign:hover {
    background: rgba(26, 111, 181, 0.1);
    border-color: var(--sky, #1a6fb5);
  }

  .tm-action-view {
    color: var(--gray, #6b7a8d);
    border-color: rgba(107, 122, 141, 0.3);
  }
  .tm-action-view:hover {
    background: rgba(107, 122, 141, 0.1);
    border-color: var(--gray, #6b7a8d);
  }

  /* Modal */
  .tm-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(14, 74, 128, 0.4);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .tm-modal {
    background: white;
    border-radius: 16px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(26, 111, 181, 0.3);
  }

  .tm-modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(26, 111, 181, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tm-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.25rem;
    color: var(--text, #1e2c3a);
  }

  .tm-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    color: var(--gray, #6b7a8d);
  }
  .tm-modal-close:hover {
    background: rgba(26, 111, 181, 0.1);
    color: var(--sky, #1a6fb5);
  }

  .tm-modal-body {
    padding: 1.5rem;
  }

  .tm-modal-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(26, 111, 181, 0.1);
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    background: rgba(26, 111, 181, 0.02);
  }

  .tm-info-card {
    background: rgba(26, 111, 181, 0.05);
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid rgba(26, 111, 181, 0.1);
    margin-bottom: 1.5rem;
  }

  .tm-info-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .tm-info-label {
    font-weight: 600;
    color: var(--text, #1e2c3a);
    min-width: 80px;
  }

  .tm-info-value {
    color: var(--gray, #6b7a8d);
  }

  .tm-class-option {
    padding: 1rem;
    border: 2px solid rgba(26, 111, 181, 0.15);
    border-radius: 10px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tm-class-option:hover {
    border-color: var(--sky, #1a6fb5);
    background: rgba(26, 111, 181, 0.02);
  }

  .tm-class-option.selected {
    border-color: var(--sky, #1a6fb5);
    background: rgba(26, 111, 181, 0.08);
  }

  .tm-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    resize: vertical;
    min-height: 100px;
  }

  .tm-textarea:focus {
    outline: none;
    border-color: var(--sky, #1a6fb5);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.1);
  }

  .tm-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--gray, #6b7a8d);
  }

  .tm-empty-icon {
    font-size: 3rem;
    color: rgba(26, 111, 181, 0.2);
    margin-bottom: 1rem;
  }

  .tm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .tm-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(26, 111, 181, 0.1);
    border-top-color: var(--sky, #1a6fb5);
    border-radius: 50%;
    animation: tm-spin 0.8s linear infinite;
  }

  @keyframes tm-spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .tm-container { padding: 1rem; }
    .tm-title { font-size: 1.5rem; }
    .tm-stats { grid-template-columns: 1fr; }
    .tm-table-container { overflow-x: auto; }
    .tm-table { min-width: 800px; }
  }
`;


/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
function TeacherManagement() {
  const { teachers, classes, loading, refreshTeachers } = useAdmin();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch available classes when needed
  useEffect(() => {
    if (modalType === 'approval' || modalType === 'assign') {
      fetchAvailableClasses();
    }
  }, [modalType]);

  const fetchAvailableClasses = async () => {
    try {
      const result = await apiService.getClasses();
      if (result.success) {
        const available = (result.classes || []).filter(
          cls => cls.status === 'active' && (!cls.teacherId || cls.teacherId === selectedTeacher?.id)
        );
        setAvailableClasses(available);
        
        // Set current class if editing
        if (modalType === 'assign') {
          const currentClass = available.find(cls => cls.teacherId === selectedTeacher?.id);
          if (currentClass) {
            setSelectedClassId(currentClass.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || teacher.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: teachers.length,
    pending: teachers.filter(t => t.status === 'pending').length,
    approved: teachers.filter(t => t.status === 'approved').length,
    rejected: teachers.filter(t => t.status === 'rejected').length,
    withClass: teachers.filter(t => t.inchargeClass).length
  };

  // Handlers
  const handleApprove = (teacher) => {
    setSelectedTeacher(teacher);
    setModalType('approval');
    setSelectedClassId('');
    setRejectionReason('');
  };

  const handleAssign = (teacher) => {
    setSelectedTeacher(teacher);
    setModalType('assign');
    setSelectedClassId('');
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setModalType(null);
    setSelectedClassId('');
    setRejectionReason('');
  };

  const handleConfirmApproval = async () => {
    setProcessing(true);
    try {
      const result = await approvalService.approveTeacher(
        selectedTeacher.id,
        selectedClassId ? [selectedClassId] : []
      );
      
      if (result.success) {
        alert('Teacher approved successfully!');
        await refreshTeachers();
        handleCloseModal();
      } else {
        alert('Failed to approve teacher: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      const result = await approvalService.rejectTeacher(selectedTeacher.id, rejectionReason);
      
      if (result.success) {
        alert('Teacher rejected');
        await refreshTeachers();
        handleCloseModal();
      } else {
        alert('Failed to reject teacher: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmAssignment = async () => {
    if (!selectedClassId) {
      alert('Please select a class');
      return;
    }

    setProcessing(true);
    try {
      // Find current class
      const currentClass = classes.find(cls => cls.teacherId === selectedTeacher.id);
      
      // Remove from old class if exists
      if (currentClass && currentClass.id !== selectedClassId) {
        await apiService.updateClass(currentClass.id, { teacherId: null });
      }
      
      // Assign to new class
      const result = await apiService.updateClass(selectedClassId, {
        teacherId: selectedTeacher.id
      });
      
      if (result.success) {
        alert('Class assigned successfully!');
        await refreshTeachers();
        handleCloseModal();
      } else {
        alert('Failed to assign class: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveFromClass = async () => {
    if (!window.confirm('Remove this teacher as class incharge?')) return;

    setProcessing(true);
    try {
      const currentClass = classes.find(cls => cls.teacherId === selectedTeacher.id);
      if (currentClass) {
        const result = await apiService.updateClass(currentClass.id, { teacherId: null });
        if (result.success) {
          alert('Teacher removed from class');
          await refreshTeachers();
          handleCloseModal();
        }
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Status', 'Subjects', 'Class', 'Join Date'],
      ...filteredTeachers.map(t => [
        t.name,
        t.email,
        t.status,
        (t.subjects || []).join('; '),
        t.inchargeClass || 'None',
        t.createdAt || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="tm-loading">
          <div className="tm-spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      <div className="tm-container">
        {/* Header */}
        <div className="tm-header">
          <div>
            <h1 className="tm-title">Teacher Management</h1>
            <p className="tm-subtitle">Manage teacher approvals and class assignments</p>
          </div>
          <div className="tm-actions">
            <button className="tm-btn tm-btn-secondary" onClick={exportToCSV}>
              <FaDownload /> Export
            </button>
            <button className="tm-btn tm-btn-primary" onClick={refreshTeachers}>
              <FaUserCheck /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="tm-stats">
          <div className="tm-stat-card" style={{ '--accent-color': 'var(--sky)', '--icon-bg': 'rgba(26,111,181,0.1)', '--icon-color': 'var(--sky)' }}>
            <div className="tm-stat-header">
              <span className="tm-stat-label">Total Teachers</span>
              <div className="tm-stat-icon"><FaUsers /></div>
            </div>
            <div className="tm-stat-value">{stats.total}</div>
          </div>

          <div className="tm-stat-card" style={{ '--accent-color': 'var(--accent)', '--icon-bg': 'rgba(240,165,0,0.1)', '--icon-color': 'var(--accent)' }}>
            <div className="tm-stat-header">
              <span className="tm-stat-label">Pending</span>
              <div className="tm-stat-icon"><FaUserClock /></div>
            </div>
            <div className="tm-stat-value">{stats.pending}</div>
          </div>

          <div className="tm-stat-card" style={{ '--accent-color': '#10b981', '--icon-bg': 'rgba(16,185,129,0.1)', '--icon-color': '#10b981' }}>
            <div className="tm-stat-header">
              <span className="tm-stat-label">Approved</span>
              <div className="tm-stat-icon"><FaCheckCircle /></div>
            </div>
            <div className="tm-stat-value">{stats.approved}</div>
          </div>

          <div className="tm-stat-card" style={{ '--accent-color': 'var(--sky)', '--icon-bg': 'rgba(26,111,181,0.1)', '--icon-color': 'var(--sky)' }}>
            <div className="tm-stat-header">
              <span className="tm-stat-label">With Class</span>
              <div className="tm-stat-icon"><FaChalkboard /></div>
            </div>
            <div className="tm-stat-value">{stats.withClass}</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="tm-filter-bar">
          <div className="tm-filter-row">
            <div className="tm-search-box">
              <FaSearch className="tm-search-icon" />
              <input
                type="text"
                className="tm-search-input"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="tm-filter-tabs">
              <button
                className={`tm-tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({stats.total})
              </button>
              <button
                className={`tm-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending ({stats.pending})
              </button>
              <button
                className={`tm-tab ${statusFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved ({stats.approved})
              </button>
              <button
                className={`tm-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="tm-table-container">
          {filteredTeachers.length === 0 ? (
            <div className="tm-empty">
              <div className="tm-empty-icon"><FaUsers /></div>
              <p>No teachers found</p>
            </div>
          ) : (
            <table className="tm-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Subjects</th>
                  <th>Status</th>
                  <th>Class Assigned</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="tm-teacher-info">
                        <div className="tm-avatar">{getInitials(teacher.name)}</div>
                        <div>
                          <div className="tm-teacher-name">{teacher.name}</div>
                          <div className="tm-teacher-email">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {teacher.subjects && teacher.subjects.length > 0 ? (
                        teacher.subjects.map((subject, idx) => (
                          <span key={idx} className="tm-subject-tag">{subject}</span>
                        ))
                      ) : (
                        <span style={{ color: 'var(--gray)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                          No subjects
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`tm-badge tm-badge-${teacher.status}`}>
                        {teacher.status === 'pending' && <FaClock />}
                        {teacher.status === 'approved' && <FaCheckCircle />}
                        {teacher.status === 'rejected' && <FaTimesCircle />}
                        {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {teacher.inchargeClass ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 500 }}>{teacher.inchargeClass}</span>
                          <span className="tm-badge" style={{ 
                            background: 'rgba(26,111,181,0.1)', 
                            color: 'var(--sky)', 
                            borderColor: 'rgba(26,111,181,0.3)',
                            fontSize: '0.7rem'
                          }}>
                            Incharge
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                        {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {teacher.status === 'pending' && (
                          <button
                            className="tm-action-btn tm-action-approve"
                            onClick={() => handleApprove(teacher)}
                          >
                            <FaCheck /> Approve
                          </button>
                        )}
                        {teacher.status === 'approved' && (
                          <button
                            className="tm-action-btn tm-action-assign"
                            onClick={() => handleAssign(teacher)}
                          >
                            <FaUserPlus /> {teacher.inchargeClass ? 'Edit' : 'Assign'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Approval Modal */}
        {modalType === 'approval' && selectedTeacher && (
          <div className="tm-modal-overlay" onClick={handleCloseModal}>
            <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tm-modal-header">
                <h2 className="tm-modal-title">Teacher Approval</h2>
                <button className="tm-modal-close" onClick={handleCloseModal}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="tm-modal-body">
                <div className="tm-info-card">
                  <div className="tm-info-row">
                    <span className="tm-info-label">Name:</span>
                    <span className="tm-info-value">{selectedTeacher.name}</span>
                  </div>
                  <div className="tm-info-row">
                    <span className="tm-info-label">Email:</span>
                    <span className="tm-info-value">{selectedTeacher.email}</span>
                  </div>
                  <div className="tm-info-row">
                    <span className="tm-info-label">Subjects:</span>
                    <span className="tm-info-value">
                      {selectedTeacher.subjects?.join(', ') || 'None'}
                    </span>
                  </div>
                </div>

                {modalType === 'approval' && !rejectionReason && (
                  <>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      marginBottom: '0.75rem',
                      color: 'var(--text)'
                    }}>
                      Assign as Class Incharge (Optional)
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gray)', 
                      marginBottom: '1rem' 
                    }}>
                      You can assign this teacher as incharge of a class during approval.
                    </p>

                    {availableClasses.length === 0 ? (
                      <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(107,122,141,0.05)', 
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'var(--gray)',
                        fontSize: '0.875rem'
                      }}>
                        No available classes. All classes have incharge assigned.
                      </div>
                    ) : (
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <div 
                          className={`tm-class-option ${!selectedClassId ? 'selected' : ''}`}
                          onClick={() => setSelectedClassId('')}
                        >
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            Skip class assignment
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                            Approve without assigning a class
                          </div>
                        </div>
                        
                        {availableClasses.map((cls) => (
                          <div
                            key={cls.id}
                            className={`tm-class-option ${selectedClassId === cls.id ? 'selected' : ''}`}
                            onClick={() => setSelectedClassId(cls.id)}
                          >
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                              {cls.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                              Grade {cls.grade}{cls.section ? ` - ${cls.section}` : ''} • {cls.academicYear}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {rejectionReason !== '' && (
                  <>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      marginBottom: '0.75rem',
                      color: 'var(--text)'
                    }}>
                      Reason for Rejection
                    </h3>
                    <textarea
                      className="tm-textarea"
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </>
                )}
              </div>

              <div className="tm-modal-footer">
                {rejectionReason === '' ? (
                  <>
                    <button
                      className="tm-btn tm-btn-secondary"
                      onClick={() => setRejectionReason(' ')}
                      style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      <FaTimes /> Reject
                    </button>
                    <button
                      className="tm-btn tm-btn-primary"
                      onClick={handleConfirmApproval}
                      disabled={processing}
                      style={{ background: '#10b981' }}
                    >
                      <FaCheck /> {processing ? 'Approving...' : 'Approve Teacher'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="tm-btn tm-btn-secondary"
                      onClick={() => setRejectionReason('')}
                    >
                      Back
                    </button>
                    <button
                      className="tm-btn tm-btn-primary"
                      onClick={handleConfirmRejection}
                      disabled={processing || !rejectionReason.trim()}
                      style={{ background: '#ef4444' }}
                    >
                      {processing ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assign Class Modal */}
        {modalType === 'assign' && selectedTeacher && (
          <div className="tm-modal-overlay" onClick={handleCloseModal}>
            <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tm-modal-header">
                <h2 className="tm-modal-title">Assign Class Incharge</h2>
                <button className="tm-modal-close" onClick={handleCloseModal}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="tm-modal-body">
                <div className="tm-info-card">
                  <div className="tm-info-row">
                    <span className="tm-info-label">Teacher:</span>
                    <span className="tm-info-value">{selectedTeacher.name}</span>
                  </div>
                  <div className="tm-info-row">
                    <span className="tm-info-label">Email:</span>
                    <span className="tm-info-value">{selectedTeacher.email}</span>
                  </div>
                </div>

                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  marginBottom: '0.75rem',
                  color: 'var(--text)'
                }}>
                  Select Class
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--gray)', 
                  marginBottom: '1rem' 
                }}>
                  A teacher can be incharge of only ONE class.
                </p>

                {availableClasses.length === 0 ? (
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(107,122,141,0.05)', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'var(--gray)',
                    fontSize: '0.875rem'
                  }}>
                    No available classes. All classes have incharge assigned.
                  </div>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {availableClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className={`tm-class-option ${selectedClassId === cls.id ? 'selected' : ''}`}
                        onClick={() => setSelectedClassId(cls.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600 }}>{cls.name}</span>
                          {cls.teacherId === selectedTeacher.id && (
                            <span className="tm-badge" style={{ 
                              background: 'rgba(16,185,129,0.1)', 
                              color: '#10b981', 
                              borderColor: 'rgba(16,185,129,0.3)',
                              fontSize: '0.7rem'
                            }}>
                              Current
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                          Grade {cls.grade}{cls.section ? ` - ${cls.section}` : ''} • {cls.academicYear}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="tm-modal-footer">
                {selectedTeacher.inchargeClass && (
                  <button
                    className="tm-btn tm-btn-secondary"
                    onClick={handleRemoveFromClass}
                    disabled={processing}
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', marginRight: 'auto' }}
                  >
                    <FaTimes /> Remove from Class
                  </button>
                )}
                <button
                  className="tm-btn tm-btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="tm-btn tm-btn-primary"
                  onClick={handleConfirmAssignment}
                  disabled={processing || !selectedClassId}
                >
                  {processing ? 'Saving...' : 'Assign as Incharge'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default TeacherManagement;
