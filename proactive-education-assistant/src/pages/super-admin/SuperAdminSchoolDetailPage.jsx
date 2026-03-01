import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import {
  FaUsers, FaUserTie, FaExclamationTriangle, FaChartLine,
  FaHandsHelping, FaChevronLeft, FaTimes, FaCircle,
  FaClipboardList, FaShieldAlt, FaLightbulb, FaPhone,
  FaUserFriends, FaChevronRight,
} from 'react-icons/fa';

/* ══════════════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --sky:       #1a6fb5;
    --sky-light: #2d8fd4;
    --sky-deep:  #0e4a80;
    --accent:    #f0a500;
    --text:      #1e2c3a;
    --gray:      #6b7a8d;
    --light:     #f0f4f9;
    --white:     #ffffff;
    --success:   #10b981;
    --danger:    #ef4444;
    --warning:   #f59e0b;
    --font-heading: 'DM Serif Display', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  .sd-page {
    min-height: 100vh;
    background: var(--light);
    font-family: var(--font-body);
    padding-bottom: 2.5rem;
  }

  /* ── Hero ── */
  .sd-hero {
    background: linear-gradient(145deg, #0e4a80 0%, #1a6fb5 55%, #2d8fd4 100%);
    padding: 1.5rem 1.75rem 4rem;
    position: relative; overflow: hidden;
  }
  .sd-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
  }
  .sd-hero-blob {
    position: absolute; top: -50px; right: -50px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .sd-hero-blob2 {
    position: absolute; bottom: -30px; left: 8%;
    width: 150px; height: 150px; border-radius: 50%;
    background: radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .sd-hero-inner { position: relative; z-index: 1; }

  /* Back button */
  .sd-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px 6px 8px; border-radius: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85); font-size: 0.78rem; font-weight: 600;
    cursor: pointer; font-family: var(--font-body);
    transition: background 0.2s; margin-bottom: 1rem;
  }
  .sd-back-btn:hover { background: rgba(255,255,255,0.2); }

  .sd-hero-tag {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    display: block; margin-bottom: 0.35rem;
  }
  .sd-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(1.4rem, 4vw, 2rem);
    color: white; margin: 0 0 0.3rem; letter-spacing: -0.02em; line-height: 1.15;
  }
  .sd-hero-sub { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin: 0; }

  /* ── Stats wrap (overlaps hero) ── */
  .sd-stats-wrap {
    padding: 0 1.5rem;
    margin-top: -2.2rem;
    position: relative; z-index: 2;
    max-width: 1100px; margin-left: auto; margin-right: auto;
    padding-left: 1.5rem; padding-right: 1.5rem;
  }
  .sd-stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }
  @media (max-width: 1024px) { .sd-stats-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 600px)  { .sd-stats-grid { grid-template-columns: repeat(2, 1fr); } }

  .sd-stat-card {
    background: var(--white);
    border-radius: 16px; padding: 1rem 0.9rem 0.9rem;
    border: 1px solid rgba(26,111,181,0.09);
    box-shadow: 0 4px 18px rgba(14,74,128,0.09);
    position: relative; overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .sd-stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(14,74,128,0.13); }
  .sd-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease;
  }
  .sd-stat-card:hover::before { transform: scaleX(1); }
  .sd-stat-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.88rem; margin-bottom: 0.55rem;
  }
  .sd-stat-num {
    font-family: var(--font-heading);
    font-size: 1.75rem; line-height: 1; margin-bottom: 0.2rem;
  }
  .sd-stat-label {
    font-size: 0.68rem; font-weight: 700; color: var(--gray);
    letter-spacing: 0.04em; text-transform: uppercase;
  }

  /* ── Content area ── */
  .sd-content {
    max-width: 1100px; margin: 0 auto;
    padding: 1.5rem 1.5rem 0;
    display: flex; flex-direction: column; gap: 1.25rem;
  }

  /* ── Card ── */
  .sd-card {
    background: var(--white);
    border-radius: 18px;
    border: 1px solid rgba(26,111,181,0.09);
    box-shadow: 0 2px 16px rgba(14,74,128,0.07);
    overflow: hidden;
  }
  .sd-card-header {
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid rgba(26,111,181,0.07);
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(240,244,249,0.5);
  }
  .sd-card-title {
    font-family: var(--font-heading);
    font-size: 1rem; color: var(--text); margin: 0;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .sd-card-title-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
  }
  .sd-count-badge {
    font-size: 0.7rem; font-weight: 700; padding: 2px 9px; border-radius: 30px;
    background: rgba(239,68,68,0.1); color: #ef4444;
    border: 1px solid rgba(239,68,68,0.2);
  }

  /* ── Table ── */
  .sd-table { width: 100%; border-collapse: collapse; font-family: var(--font-body); }
  .sd-table thead tr {
    background: var(--light); border-bottom: 1px solid rgba(26,111,181,0.1);
  }
  .sd-table th {
    padding: 0.75rem 1rem; text-align: left;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray); white-space: nowrap;
  }
  .sd-table td {
    padding: 0.8rem 1rem; font-size: 0.875rem; color: var(--text);
    border-bottom: 1px solid rgba(26,111,181,0.05);
  }
  .sd-table tbody tr { transition: background 0.18s ease; }
  .sd-table tbody tr:hover { background: rgba(26,111,181,0.03); }
  .sd-table tbody tr:last-child td { border-bottom: none; }

  /* Student avatar initials */
  .sd-student-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #0e4a80, #2d8fd4);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; color: white;
    box-shadow: 0 2px 6px rgba(26,111,181,0.25);
  }
  .sd-student-name { display: flex; align-items: center; gap: 9px; }
  .sd-student-label { font-weight: 600; color: var(--text); }

  /* Risk badge */
  .sd-risk-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 30px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .sd-risk-critical { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.22); }
  .sd-risk-high     { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.22); }

  /* Score bar */
  .sd-score-wrap { display: flex; align-items: center; gap: 7px; min-width: 90px; }
  .sd-score-bar  { flex: 1; height: 5px; border-radius: 3px; background: rgba(239,68,68,0.1); overflow: hidden; }
  .sd-score-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #ef4444, #fca5a5); }
  .sd-score-val  { font-size: 0.78rem; font-weight: 700; color: #ef4444; min-width: 30px; }

  /* View profile btn */
  .sd-view-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 8px;
    font-size: 0.78rem; font-weight: 600;
    background: rgba(26,111,181,0.07);
    color: var(--sky); border: 1px solid rgba(26,111,181,0.18);
    cursor: pointer; font-family: var(--font-body);
    transition: background 0.2s, transform 0.15s;
  }
  .sd-view-btn:hover { background: rgba(26,111,181,0.13); }
  .sd-view-btn:active { transform: scale(0.96); }

  /* Update type pill */
  .sd-type-pill {
    display: inline-block; padding: 2px 9px; border-radius: 30px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em;
    background: rgba(26,111,181,0.08); color: var(--sky);
    border: 1px solid rgba(26,111,181,0.15);
  }
  .sd-status-pill {
    display: inline-block; padding: 2px 9px; border-radius: 30px;
    font-size: 0.68rem; font-weight: 700;
    background: rgba(16,185,129,0.08); color: #10b981;
    border: 1px solid rgba(16,185,129,0.2);
  }

  /* Activity dot */
  .sd-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: rgba(26,111,181,0.25);
  }
  .sd-activity-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid rgba(26,111,181,0.05);
  }
  .sd-activity-row:last-child { border-bottom: none; }
  .sd-activity-line {
    display: flex; flex-direction: column; align-items: center; gap: 0; padding-top: 4px;
  }
  .sd-activity-stem {
    width: 1px; flex: 1; min-height: 20px; background: rgba(26,111,181,0.12); margin-top: 4px;
  }

  /* ── Mobile cards ── */
  .sd-table-desktop { display: block; }
  .sd-mobile-list   { display: none; padding: 0.75rem; }
  @media (max-width: 767px) {
    .sd-table-desktop { display: none; }
    .sd-mobile-list   { display: block; }
  }

  .sd-mob-card {
    background: var(--white);
    border-radius: 13px;
    border: 1px solid rgba(26,111,181,0.09);
    padding: 0.9rem; margin-bottom: 0.6rem;
    box-shadow: 0 2px 8px rgba(14,74,128,0.06);
    position: relative; overflow: hidden;
  }
  .sd-mob-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, #ef4444, #fca5a5);
    border-radius: 3px 0 0 3px;
  }
  .sd-mob-card-top {
    display: flex; align-items: center; gap: 9px; margin-bottom: 8px;
  }
  .sd-mob-stats {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;
  }
  .sd-mob-stat {
    background: var(--light); border-radius: 7px; padding: 7px 9px;
    font-size: 0.7rem; color: var(--gray);
  }
  .sd-mob-stat strong { display: block; font-size: 0.85rem; color: var(--text); margin-top: 1px; }

  /* Update mobile card */
  .sd-upd-card {
    background: var(--white);
    border-radius: 13px;
    border: 1px solid rgba(26,111,181,0.09);
    padding: 0.9rem; margin-bottom: 0.6rem;
    box-shadow: 0 2px 8px rgba(14,74,128,0.06);
    position: relative; overflow: hidden;
  }
  .sd-upd-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, var(--sky), var(--sky-light));
    border-radius: 3px 0 0 3px;
  }

  /* ── Error ── */
  .sd-error {
    margin: 1.25rem 1.5rem 0; padding: 0.85rem 1rem; border-radius: 12px;
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18);
    color: #ef4444; font-size: 0.855rem; font-weight: 500;
    display: flex; align-items: center; gap: 0.5rem;
  }

  /* ── Empty state ── */
  .sd-empty {
    padding: 2.5rem 1rem; text-align: center;
    color: var(--gray); font-size: 0.875rem;
  }

  /* ── Spinner ── */
  @keyframes sd-spin { to { transform: rotate(360deg); } }
  .sd-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid rgba(26,111,181,0.15);
    border-top-color: var(--sky);
    animation: sd-spin 0.75s linear infinite; margin: 0 auto 1rem;
  }

  /* ── Fade ── */
  @keyframes sd-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sd-fade { animation: sd-fadeUp 0.4s ease both; }
  .sd-d1 { animation-delay: 0.05s; }
  .sd-d2 { animation-delay: 0.1s;  }
  .sd-d3 { animation-delay: 0.15s; }

  /* ══════════════════════════════════════════════════════════════════════
     MODAL
  ══════════════════════════════════════════════════════════════════════ */
  .sd-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(14,74,128,0.45);
    backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    animation: sd-fadeUp 0.25s ease both;
  }
  .sd-modal {
    width: 100%; max-width: 520px;
    background: var(--white); border-radius: 20px;
    border: 1px solid rgba(26,111,181,0.12);
    box-shadow: 0 24px 60px rgba(14,74,128,0.22);
    overflow: hidden;
    animation: sd-modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes sd-modal-in {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .sd-modal-hero {
    background: linear-gradient(135deg, #0e4a80, #2d8fd4);
    padding: 1.25rem 1.4rem;
    display: flex; align-items: flex-start; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .sd-modal-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='0.8' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/svg%3E");
  }
  .sd-modal-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 700; color: white;
    font-family: var(--font-heading);
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    flex-shrink: 0; position: relative; z-index: 1;
  }
  .sd-modal-name {
    font-family: var(--font-heading); font-size: 1.2rem; color: white; margin: 0 0 3px;
    position: relative; z-index: 1;
  }
  .sd-modal-class { font-size: 0.78rem; color: rgba(255,255,255,0.65); position: relative; z-index: 1; }
  .sd-modal-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: white; font-size: 0.85rem;
    transition: background 0.2s; position: relative; z-index: 1; flex-shrink: 0;
  }
  .sd-modal-close:hover { background: rgba(255,255,255,0.25); }

  .sd-modal-body { padding: 1.25rem 1.4rem; }
  .sd-info-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem;
    margin-bottom: 1rem;
  }
  .sd-info-item {
    background: var(--light); border-radius: 10px; padding: 0.75rem 0.85rem;
    border: 1px solid rgba(26,111,181,0.07);
  }
  .sd-info-label {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray); margin-bottom: 3px;
    display: flex; align-items: center; gap: 4px;
  }
  .sd-info-value { font-size: 0.9rem; font-weight: 600; color: var(--text); }

  .sd-rec-header {
    font-family: var(--font-heading); font-size: 0.95rem; color: var(--text);
    margin: 0 0 0.65rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .sd-rec-item {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 0.6rem 0.75rem; border-radius: 8px; margin-bottom: 0.4rem;
    background: rgba(26,111,181,0.04); border: 1px solid rgba(26,111,181,0.08);
    font-size: 0.83rem; color: var(--text); line-height: 1.4;
  }
  .sd-rec-num {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    background: rgba(26,111,181,0.12); color: var(--sky);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 700;
  }
`;

/* ── Helpers ──────────────────────────────────────────────────────────── */
function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function riskClass(level) {
  return level === 'critical' ? 'sd-risk-critical' : 'sd-risk-high';
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function formatType(type) {
  if (type === 'admin_registration') return 'Admin Registration';
  if (type === 'teacher_request')    return 'Teacher Request';
  if (type === 'intervention')       return 'Intervention';
  return type || '-';
}

/* ══════════════════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════════════════ */
function StatCard({ title, value, icon: Icon, color, bg, topGrad }) {
  return (
    <div className="sd-stat-card">
      <style>{`.sd-stat-card:hover::before { background: ${topGrad}; }`}</style>
      <div className="sd-stat-icon" style={{ background: bg, color }}><Icon /></div>
      <div className="sd-stat-num" style={{ color }}>{value}</div>
      <div className="sd-stat-label">{title}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function SuperAdminSchoolDetailPage() {
  const { schoolId } = useParams();
  const navigate     = useNavigate();

  const [summary, setSummary]                 = useState(null);
  const [updates, setUpdates]                 = useState([]);
  const [highRiskStudents, setHighRiskStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');

  useEffect(() => {
    if (!schoolId) return;
    (async () => {
      try {
        setLoading(true); setError('');
        const [summaryRes, updatesRes, highRiskRes] = await Promise.all([
          apiService.getSchoolSummary(schoolId),
          apiService.getSchoolUpdates(schoolId),
          apiService.getSchoolHighRiskStudents(schoolId),
        ]);
        setSummary(summaryRes.summary || null);
        setUpdates(updatesRes.updates || []);
        setHighRiskStudents(highRiskRes.students || []);
      } catch (err) {
        setError(err.message || 'Failed to load school details');
      } finally {
        setLoading(false);
      }
    })();
  }, [schoolId]);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="sd-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="sd-spinner" />
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
              Loading school details…
            </p>
          </div>
        </div>
      </>
    );
  }

  const statItems = [
    { title: 'Students',    value: summary?.totalStudents       ?? 0,    icon: FaUsers,            color: 'var(--sky)',  bg: 'rgba(26,111,181,0.1)',  topGrad: 'linear-gradient(90deg,#0e4a80,#2d8fd4)' },
    { title: 'Teachers',    value: summary?.totalTeachers       ?? 0,    icon: FaUserTie,          color: '#7c3aed',     bg: 'rgba(124,58,237,0.1)',  topGrad: 'linear-gradient(90deg,#7c3aed,#a855f7)' },
    { title: 'High Risk',   value: summary?.highRiskStudents    ?? 0,    icon: FaExclamationTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   topGrad: 'linear-gradient(90deg,#ef4444,#f87171)' },
    { title: 'Risk %',      value: `${summary?.riskPercentage  ?? 0}%`, icon: FaChartLine,         color: '#f59e0b',    bg: 'rgba(245,158,11,0.1)',  topGrad: 'linear-gradient(90deg,#f59e0b,#fbbf24)' },
    { title: 'Interventions', value: summary?.activeInterventions ?? 0, icon: FaHandsHelping,       color: '#10b981',   bg: 'rgba(16,185,129,0.1)',  topGrad: 'linear-gradient(90deg,#10b981,#34d399)'  },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="sd-page">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="sd-hero sd-fade">
          <div className="sd-hero-blob" /><div className="sd-hero-blob2" />
          <div className="sd-hero-inner">
            <button className="sd-back-btn" onClick={() => navigate(-1)}>
              <FaChevronLeft style={{ fontSize: '0.7rem' }} /> All Schools
            </button>
            <span className="sd-hero-tag">School Overview</span>
            <h1 className="sd-hero-title">{summary?.schoolName || 'School Details'}</h1>
            <p className="sd-hero-sub">Live metrics and recent activity</p>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div className="sd-stats-wrap sd-fade sd-d1">
          <div className="sd-stats-grid">
            {statItems.map(s => <StatCard key={s.title} {...s} />)}
          </div>
        </div>

        {/* ── Error ────────────────────────────────────────────────────── */}
        {error && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
            <div className="sd-error">
              <FaExclamationTriangle style={{ flexShrink: 0 }} /> {error}
            </div>
          </div>
        )}

        <div className="sd-content">

          {/* ── High-Risk Students ───────────────────────────────────── */}
          <div className="sd-card sd-fade sd-d2">
            <div className="sd-card-header">
              <h2 className="sd-card-title">
                <div className="sd-card-title-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <FaExclamationTriangle />
                </div>
                High-Risk Students
              </h2>
              {highRiskStudents.length > 0 && (
                <span className="sd-count-badge">{highRiskStudents.length} students</span>
              )}
            </div>

            {/* Desktop table */}
            <div className="sd-table-desktop">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Risk Level</th>
                    <th>Risk Score</th>
                    <th>Confidence</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="sd-student-name">
                          <div className="sd-student-avatar">{initials(student.name)}</div>
                          <span className="sd-student-label">{student.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--gray)' }}>{student.className || '-'}</td>
                      <td>
                        <span className={`sd-risk-badge ${riskClass(student.riskLevel)}`}>
                          <FaCircle style={{ fontSize: '0.4rem' }} />
                          {student.riskLevel || '-'}
                        </span>
                      </td>
                      <td>
                        {student.riskScore != null ? (
                          <div className="sd-score-wrap">
                            <div className="sd-score-bar">
                              <div className="sd-score-fill" style={{ width: `${Math.min(student.riskScore, 100)}%` }} />
                            </div>
                            <span className="sd-score-val">{student.riskScore}%</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{student.confidence || '-'}</td>
                      <td>
                        <button type="button" className="sd-view-btn" onClick={() => setSelectedStudent(student)}>
                          View <FaChevronRight style={{ fontSize: '0.6rem' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!highRiskStudents.length && (
                    <tr><td colSpan={6}><div className="sd-empty">No high-risk students found</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sd-mobile-list">
              {highRiskStudents.map(student => (
                <div key={student.id} className="sd-mob-card">
                  <div className="sd-mob-card-top">
                    <div className="sd-student-avatar">{initials(student.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 4 }}>
                        {student.name}
                      </div>
                      <span className={`sd-risk-badge ${riskClass(student.riskLevel)}`}>
                        <FaCircle style={{ fontSize: '0.4rem' }} /> {student.riskLevel || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="sd-mob-stats">
                    {[
                      { label: 'Class',       val: student.className || '-' },
                      { label: 'Risk Score',  val: student.riskScore != null ? `${student.riskScore}%` : '-' },
                      { label: 'Confidence',  val: student.confidence || '-' },
                    ].map(s => (
                      <div key={s.label} className="sd-mob-stat">
                        {s.label}<strong style={{ color: s.label === 'Risk Score' ? '#ef4444' : 'var(--text)' }}>{s.val}</strong>
                      </div>
                    ))}
                  </div>
                  {student.riskScore != null && (
                    <div style={{ marginBottom: 8 }}>
                      <div className="sd-score-bar" style={{ height: 6, borderRadius: 3 }}>
                        <div className="sd-score-fill" style={{ width: `${Math.min(student.riskScore, 100)}%` }} />
                      </div>
                    </div>
                  )}
                  <button
                    type="button" className="sd-view-btn"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    View Full Profile <FaChevronRight style={{ fontSize: '0.6rem' }} />
                  </button>
                </div>
              ))}
              {!highRiskStudents.length && <div className="sd-empty">No high-risk students found</div>}
            </div>
          </div>

          {/* ── Recent School Updates ────────────────────────────────── */}
          <div className="sd-card sd-fade sd-d3">
            <div className="sd-card-header">
              <h2 className="sd-card-title">
                <div className="sd-card-title-icon" style={{ background: 'rgba(26,111,181,0.1)', color: 'var(--sky)' }}>
                  <FaClipboardList />
                </div>
                Recent School Updates
              </h2>
              {updates.length > 0 && (
                <span style={{ fontSize: '0.72rem', color: 'var(--gray)', fontWeight: 600 }}>
                  {updates.length} update{updates.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Desktop table */}
            <div className="sd-table-desktop">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Update</th>
                    <th>Actor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {updates.map(item => (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--gray)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {formatDateTime(item.time)}
                      </td>
                      <td><span className="sd-type-pill">{formatType(item.type)}</span></td>
                      <td style={{ fontWeight: 600 }}>{item.title}</td>
                      <td style={{ color: 'var(--gray)' }}>{item.actorName || '-'}</td>
                      <td>
                        {item.status
                          ? <span className="sd-status-pill">{item.status}</span>
                          : <span style={{ color: 'var(--gray)' }}>-</span>
                        }
                      </td>
                    </tr>
                  ))}
                  {!updates.length && (
                    <tr><td colSpan={5}><div className="sd-empty">No updates found for this school</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile activity feed */}
            <div className="sd-mobile-list" style={{ padding: '0.75rem 1rem' }}>
              {updates.map((item, idx) => (
                <div key={item.id} className="sd-activity-row">
                  <div className="sd-activity-line">
                    <div className="sd-dot" />
                    {idx < updates.length - 1 && <div className="sd-activity-stem" />}
                  </div>
                  <div className="sd-upd-card" style={{ flex: 1, marginBottom: 0, padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>{item.title}</div>
                      {item.status && <span className="sd-status-pill" style={{ flexShrink: 0 }}>{item.status}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="sd-type-pill">{formatType(item.type)}</span>
                      {item.actorName && <span style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>{item.actorName}</span>}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--gray)', marginTop: 5 }}>{formatDateTime(item.time)}</div>
                  </div>
                </div>
              ))}
              {!updates.length && <div className="sd-empty">No updates found for this school</div>}
            </div>
          </div>

        </div>
      </div>

      {/* ══ Student Profile Modal ══════════════════════════════════════════ */}
      {selectedStudent && (
        <div className="sd-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="sd-modal" onClick={e => e.stopPropagation()}>

            {/* Modal hero */}
            <div className="sd-modal-hero">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', position: 'relative', zIndex: 1 }}>
                <div className="sd-modal-avatar">{initials(selectedStudent.name)}</div>
                <div>
                  <div className="sd-modal-name">{selectedStudent.name}</div>
                  <div className="sd-modal-class">{selectedStudent.className || 'Unknown class'}</div>
                  <div style={{ marginTop: 5 }}>
                    <span className={`sd-risk-badge ${riskClass(selectedStudent.riskLevel)}`}
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }}>
                      <FaCircle style={{ fontSize: '0.4rem' }} />
                      {selectedStudent.riskLevel || '-'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="sd-modal-close" onClick={() => setSelectedStudent(null)}>
                <FaTimes />
              </button>
            </div>

            {/* Modal body */}
            <div className="sd-modal-body">
              <div className="sd-info-grid">
                {[
                  { label: 'Risk Score',   icon: <FaChartLine style={{ fontSize: '0.6rem' }} />,    value: selectedStudent.riskScore != null ? `${selectedStudent.riskScore}%` : '-',  color: '#ef4444' },
                  { label: 'Confidence',   icon: <FaShieldAlt style={{ fontSize: '0.6rem' }} />,    value: selectedStudent.confidence    || '-', color: 'var(--sky)' },
                  { label: 'Contact',      icon: <FaPhone style={{ fontSize: '0.6rem' }} />,         value: selectedStudent.contactNumber || '-', color: 'var(--text)' },
                  { label: 'Father Name',  icon: <FaUserFriends style={{ fontSize: '0.6rem' }} />,  value: selectedStudent.fatherName    || '-', color: 'var(--text)' },
                  { label: 'Mother Name',  icon: <FaUserFriends style={{ fontSize: '0.6rem' }} />,  value: selectedStudent.motherName    || '-', color: 'var(--text)' },
                ].map(info => (
                  <div key={info.label} className="sd-info-item">
                    <div className="sd-info-label">{info.icon} {info.label}</div>
                    <div className="sd-info-value" style={{ color: info.color }}>{info.value}</div>
                  </div>
                ))}
              </div>

              {Array.isArray(selectedStudent.recommendations) && selectedStudent.recommendations.length > 0 && (
                <div>
                  <div className="sd-rec-header">
                    <FaLightbulb style={{ color: 'var(--accent)', fontSize: '0.9rem' }} />
                    Recommendations
                  </div>
                  {selectedStudent.recommendations.slice(0, 5).map((item, idx) => (
                    <div key={`${selectedStudent.id}-rec-${idx}`} className="sd-rec-item">
                      <div className="sd-rec-num">{idx + 1}</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}