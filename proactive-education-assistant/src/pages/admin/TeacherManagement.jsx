import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { approvalService } from '../../services/approvalService';
import apiService from '../../services/apiService';
import { injectHorizonStyles } from '../../styles/horizonTheme';
import { 
  FaUserCheck, FaUserClock, FaUserTimes, FaUsers, FaChalkboard,
  FaSearch, FaFilter, FaDownload, FaTimes, FaCheck, FaUserPlus,
  FaEye, FaSort, FaCheckCircle, FaTimesCircle, FaClock, FaStar
} from 'react-icons/fa';

/* ══════════════════════════════════════════════════════════════════════════
   HORIZON THEME STYLES - COMPLETE REDESIGN
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

  .tm-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--light-bg) 0%, #ffffff 100%);
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }

  /* Hero Section */
  .tm-hero {
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

  .tm-hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .tm-hero-tag {
    display: inline-block;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .tm-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
  }

  .tm-hero-title .tm-accent-word {
    color: white;
  }

  .tm-hero-subtitle {
    font-size: 0.9rem;
    font-weight: 300;
    color: white;
    margin: 0;
  }

  .tm-hero-actions {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 0.75rem;
  }

  /* Main Content */
  .tm-main {
    padding: 2.5rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .tm-section-header {
    margin-bottom: 2rem;
    animation: fadeUp 0.8s ease-out 0.1s both;
  }

  .tm-section-tag {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sky-blue);
    margin-bottom: 0.5rem;
    display: inline-block;
  }

  .tm-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;
    animation: fadeUp 0.8s ease-out 0.2s both;
  }

  .tm-header-left h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    color: var(--text-dark);
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }

  .tm-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.75rem;
    color: var(--text-dark);
    line-height: 1.2;
    margin: 0;
  }

  .tm-subtitle {
    font-size: 0.875rem;
    color: var(--gray);
    margin-top: 0.5rem;
    font-weight: 300;
  }

  .tm-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    animation: slideInRight 0.8s ease-out 0.3s both;
  }

  .tm-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .tm-btn-primary {
    background: var(--sky-blue);
    color: white;
  }
  
  .tm-btn-primary:hover {
    background: #0e4a80;
    transform: translateY(-2px);
  }

  .tm-btn-secondary {
    background: white;
    color: var(--text-dark);
    border: 1px solid rgba(26, 111, 181, 0.15);
  }
  
  .tm-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.05);
    border-color: var(--sky-blue);
  }

  .tm-hero .tm-btn-secondary {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .tm-hero .tm-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.6);
  }

  .tm-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Stats Cards */
  .tm-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .tm-stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(26, 111, 181, 0.08);
    transition: all 0.25s ease;
    position: relative;
  }

  .tm-stat-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent-color);
    border-radius: 12px 0 0 12px;
  }

  .tm-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(26, 111, 181, 0.1);
  }

  .tm-stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .tm-stat-label {
    font-size: 0.75rem;
    color: var(--gray);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tm-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--icon-bg);
    color: var(--icon-color);
    font-size: 1.1rem;
  }

  .tm-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    color: var(--text-dark);
    font-weight: 700;
    line-height: 1;
  }

  /* Filter Bar */
  .tm-filter-bar {
    background: white;
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid rgba(26, 111, 181, 0.08);
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(26, 111, 181, 0.02);
  }

  .tm-filter-row {
    display: flex;
    gap: 1.25rem;
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
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray);
    font-size: 0.85rem;
  }

  .tm-search-input {
    width: 100%;
    padding: 0.75rem 0.875rem 0.75rem 2.5rem;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
    background: white;
  }

  .tm-search-input:focus {
    outline: none;
    border-color: var(--sky-blue);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
  }

  .tm-search-input::placeholder {
    color: var(--gray);
  }

  .tm-filter-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tm-tab {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: rgba(26, 111, 181, 0.05);
    color: var(--gray);
    white-space: nowrap;
  }

  .tm-tab:hover {
    background: rgba(26, 111, 181, 0.1);
  }

  .tm-tab.active {
    background: var(--sky-blue);
    color: white;
  }
  /* Table */
  .tm-table-container {
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(26, 111, 181, 0.08);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(26, 111, 181, 0.02);
    animation: fadeUp 0.6s ease-out;
  }

  .tm-table {
    width: 100%;
    border-collapse: collapse;
  }

  .tm-table thead {
    background: linear-gradient(135deg, rgba(26, 111, 181, 0.05) 0%, rgba(26, 111, 181, 0.02) 100%);
    border-bottom: 1px solid rgba(26, 111, 181, 0.1);
  }

  .tm-table th {
    padding: 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'DM Sans', sans-serif;
  }

  .tm-table td {
    padding: 1rem;
    border-bottom: 1px solid rgba(26, 111, 181, 0.05);
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
    border-radius: 10px;
    background: linear-gradient(135deg, var(--sky-blue) 0%, var(--sky-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.85rem;
    box-shadow: 0 2px 6px rgba(26, 111, 181, 0.15);
  }

  .tm-teacher-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .tm-teacher-name {
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.125rem;
  }

  .tm-teacher-email {
    font-size: 0.75rem;
    color: var(--gray);
  }

  .tm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .tm-badge-pending {
    background: rgba(240, 165, 0, 0.1);
    color: var(--accent-gold);
    border-color: rgba(240, 165, 0, 0.25);
  }

  .tm-badge-approved {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border-color: rgba(16, 185, 129, 0.25);
  }

  .tm-badge-rejected {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.25);
  }

  .tm-subject-tag {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    background: rgba(124, 58, 237, 0.1);
    color: #7c3aed;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 500;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
  }

  .tm-action-btn {
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;
    background: transparent;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .tm-action-approve {
    color: #10b981;
    border-color: rgba(16, 185, 129, 0.25);
  }
  .tm-action-approve:hover {
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
  }

  .tm-action-assign {
    color: var(--sky-blue);
    border-color: rgba(26, 111, 181, 0.25);
  }
  .tm-action-assign:hover {
    background: rgba(26, 111, 181, 0.1);
    border-color: var(--sky-blue);
  }

  .tm-action-view {
    color: var(--gray);
    border-color: rgba(107, 122, 141, 0.25);
  }
  .tm-action-view:hover {
    background: rgba(107, 122, 141, 0.08);
    border-color: var(--gray);
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
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(26, 111, 181, 0.2);
  }

  .tm-modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(26, 111, 181, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tm-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.25rem;
    color: var(--text-dark);
    font-weight: 700;
    margin: 0;
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
    color: var(--gray);
    font-size: 1.1rem;
  }
  .tm-modal-close:hover {
    background: rgba(26, 111, 181, 0.1);
    color: var(--sky-blue);
  }

  .tm-modal-body {
    padding: 1.5rem;
  }

  .tm-modal-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid rgba(26, 111, 181, 0.08);
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .tm-info-card {
    background: rgba(26, 111, 181, 0.04);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(26, 111, 181, 0.08);
    margin-bottom: 1.25rem;
  }

  .tm-info-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
    font-size: 0.875rem;
  }

  .tm-info-label {
    font-weight: 600;
    color: var(--text-dark);
    min-width: 75px;
  }

  .tm-info-value {
    color: var(--gray);
  }

  .tm-class-option {
    padding: 0.875rem;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 8px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tm-class-option:hover {
    border-color: var(--sky-blue);
    background: rgba(26, 111, 181, 0.02);
  }

  .tm-class-option.selected {
    border-color: var(--sky-blue);
    background: rgba(26, 111, 181, 0.08);
  }

  .tm-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba(26, 111, 181, 0.1);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: white;
    resize: vertical;
    min-height: 100px;
  }

  .tm-textarea:focus {
    outline: none;
    border-color: var(--sky-blue);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
  }
  /* Empty State */
  .tm-empty {
    text-align: center;
    padding: 3rem 1.5rem;
    color: var(--gray);
  }

  .tm-empty-icon {
    font-size: 3rem;
    color: rgba(26, 111, 181, 0.15);
    margin-bottom: 1rem;
  }

  .tm-empty p {
    font-size: 1rem;
    color: var(--gray);
    margin: 0;
  }

  /* Loading State */
  .tm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    min-height: 60vh;
  }

  .tm-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(26, 111, 181, 0.1);
    border-top-color: var(--sky-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .tm-hero-title {
      font-size: 1.7rem;
    }
    .tm-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .tm-container {
      padding: 0;
    }

    .tm-hero {
      padding: 1.5rem;
      margin: 1rem;
      flex-direction: column;
      text-align: center;
    }

    .tm-hero-title {
      font-size: 1.4rem;
    }

    .tm-hero-actions {
      justify-content: center;
      margin-top: 1.25rem;
      width: 100%;
    }

    .tm-main {
      padding: 1.25rem;
    }

    .tm-stats {
      grid-template-columns: 1fr;
      margin-bottom: 1.25rem;
    }

    .tm-filter-row {
      flex-direction: column;
    }

    .tm-search-box {
      min-width: 100%;
    }

    .tm-table th,
    .tm-table td {
      padding: 0.75rem 0.5rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .tm-hero {
      padding: 1rem;
      margin: 0.5rem;
    }

    .tm-hero-title {
      font-size: 1.2rem;
    }

    .tm-hero-subtitle {
      font-size: 0.85rem;
    }

    .tm-hero-actions {
      width: 100%;
    }

    .tm-hero-actions .tm-btn {
      flex: 1;
      justify-content: center;
    }

    .tm-filter-tabs {
      gap: 0.3rem;
    }

    .tm-tab {
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
    }

    .tm-modal-footer {
      flex-direction: column;
      gap: 0.5rem;
    }

    .tm-modal-footer .tm-btn {
      width: 100%;
    }
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

  // Inject Horizon theme on mount
  useEffect(() => {
    injectHorizonStyles();
  }, []);

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
        {/* Hero Section - Dashboard Style */}
        <div className="tm-hero">
          <div className="tm-hero-content">
            <div className="tm-hero-tag">ADMIN PANEL</div>
            <h1 className="tm-hero-title">Teacher Management</h1>
            <p className="tm-hero-subtitle">Tuesday, February 24, 2026</p>
          </div>
          <div className="tm-hero-actions">
            <button className="tm-btn tm-btn-secondary" onClick={exportToCSV}>
              📊 Export Data
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="tm-main">
          {/* Stats */}
          <div className="tm-stats">
            <div className="tm-stat-card" style={{ '--accent-color': '#1a6fb5', '--icon-bg': 'rgba(26,111,181,0.1)', '--icon-color': '#1a6fb5' }}>
              <div className="tm-stat-header">
                <span className="tm-stat-label">Total Teachers</span>
                <div className="tm-stat-icon"><FaUsers /></div>
              </div>
              <div className="tm-stat-value">{stats.total}</div>
            </div>

            <div className="tm-stat-card" style={{ '--accent-color': '#f0a500', '--icon-bg': 'rgba(240,165,0,0.1)', '--icon-color': '#f0a500' }}>
              <div className="tm-stat-header">
                <span className="tm-stat-label">Pending Approval</span>
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

            <div className="tm-stat-card" style={{ '--accent-color': '#1a6fb5', '--icon-bg': 'rgba(26,111,181,0.1)', '--icon-color': '#1a6fb5' }}>
              <div className="tm-stat-header">
                <span className="tm-stat-label">Class Assigned</span>
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
                  ✓ Approved ({stats.approved})
                </button>
                <button
                  className={`tm-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('rejected')}
                >
                  ✗ Rejected ({stats.rejected})
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
                              color: '#1a6fb5', 
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
