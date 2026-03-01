import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import {
  FaSchool,
  FaUserTie,
  FaUsers,
  FaExclamationTriangle,
  FaHandsHelping,
  FaChevronRight,
  FaCircle,
  FaArrowUp,
  FaGlobeAsia,
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

  .sa-page {
    min-height: 100vh;
    background: var(--light);
    font-family: var(--font-body);
  }

  /* ── Hero strip ── */
  .sa-hero {
    background: linear-gradient(145deg, #0e4a80 0%, #1a6fb5 55%, #2d8fd4 100%);
    padding: 2rem 2rem 3.5rem;
    position: relative; overflow: hidden;
  }
  .sa-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
  }
  .sa-hero-blob {
    position: absolute; top: -60px; right: -60px;
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .sa-hero-blob2 {
    position: absolute; bottom: -40px; left: 10%;
    width: 180px; height: 180px; border-radius: 50%;
    background: radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .sa-hero-content { position: relative; z-index: 1; }

  .sa-hero-tag {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    display: block; margin-bottom: 0.4rem;
  }
  .sa-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    color: white; margin: 0 0 0.4rem; line-height: 1.1; letter-spacing: -0.02em;
  }
  .sa-hero-sub {
    font-size: 0.83rem; color: rgba(255,255,255,0.6); margin: 0;
  }

  /* ── Stats grid (overlaps hero) ── */
  .sa-stats-wrap {
    padding: 0 1.5rem;
    margin-top: -2rem;
    position: relative; z-index: 2;
  }
  .sa-stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
  }
  @media (max-width: 1100px) { .sa-stats-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px)  { .sa-stats-grid { grid-template-columns: repeat(2, 1fr); } }

  .sa-stat-card {
    background: var(--white);
    border-radius: 16px;
    padding: 1.1rem 1rem 1rem;
    border: 1px solid rgba(26,111,181,0.09);
    box-shadow: 0 4px 20px rgba(14,74,128,0.09);
    position: relative; overflow: hidden;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .sa-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(14,74,128,0.13);
  }
  .sa-stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s ease;
  }
  .sa-stat-card:hover::before { transform: scaleX(1); }

  .sa-stat-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 0.65rem;
  }
  .sa-stat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; flex-shrink: 0;
  }
  .sa-stat-trend {
    font-size: 0.65rem; font-weight: 700;
    display: flex; align-items: center; gap: 2px;
    padding: 2px 6px; border-radius: 30px;
  }
  .sa-stat-num {
    font-family: var(--font-heading);
    font-size: 2rem; line-height: 1; margin-bottom: 0.2rem;
  }
  .sa-stat-label {
    font-size: 0.72rem; font-weight: 600; color: var(--gray);
    letter-spacing: 0.03em; text-transform: uppercase;
  }

  /* ── Section ── */
  .sa-section { padding: 1.75rem 1.5rem 0; }
  .sa-section-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1rem;
  }
  .sa-section-title {
    font-family: var(--font-heading);
    font-size: 1.15rem; color: var(--text); margin: 0;
  }
  .sa-tag {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--sky); display: block; margin-bottom: 2px;
  }

  /* ── Table card ── */
  .sa-table-card {
    background: var(--white);
    border-radius: 18px;
    border: 1px solid rgba(26,111,181,0.09);
    box-shadow: 0 2px 16px rgba(14,74,128,0.07);
    overflow: hidden;
  }

  /* Desktop table */
  .sa-table {
    width: 100%; border-collapse: collapse;
    font-family: var(--font-body);
  }
  .sa-table thead tr {
    background: var(--light);
    border-bottom: 1px solid rgba(26,111,181,0.1);
  }
  .sa-table th {
    padding: 0.8rem 1rem; text-align: left;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray);
    white-space: nowrap;
  }
  .sa-table td {
    padding: 0.85rem 1rem;
    font-size: 0.875rem; color: var(--text);
    border-bottom: 1px solid rgba(26,111,181,0.05);
  }
  .sa-table tbody tr {
    cursor: pointer;
    transition: background 0.18s ease, transform 0.15s ease;
  }
  .sa-table tbody tr:hover { background: rgba(26,111,181,0.04); }
  .sa-table tbody tr:last-child td { border-bottom: none; }

  /* School name cell */
  .sa-school-name {
    display: flex; align-items: center; gap: 10px;
  }
  .sa-school-avatar {
    width: 34px; height: 34px; border-radius: 9px;
    background: linear-gradient(135deg, var(--sky-deep), var(--sky-light));
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.8rem; color: white; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(26,111,181,0.25);
  }
  .sa-school-label { font-weight: 600; color: var(--text); }

  /* Risk bar */
  .sa-risk-bar-wrap {
    display: flex; align-items: center; gap: 8px; min-width: 100px;
  }
  .sa-risk-bar-bg {
    flex: 1; height: 5px; border-radius: 3px;
    background: rgba(26,111,181,0.1); overflow: hidden;
  }
  .sa-risk-bar-fill {
    height: 100%; border-radius: 3px;
    transition: width 0.5s ease;
  }
  .sa-risk-pct {
    font-size: 0.78rem; font-weight: 700; min-width: 36px; text-align: right;
  }

  /* Status badge */
  .sa-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 30px;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em;
  }
  .sa-badge-active   { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
  .sa-badge-inactive { background: rgba(107,122,141,0.1); color: var(--gray); border: 1px solid rgba(107,122,141,0.2); }

  /* Chevron cell */
  .sa-chevron-cell { color: rgba(26,111,181,0.3); transition: color 0.2s, transform 0.2s; }
  .sa-table tbody tr:hover .sa-chevron-cell { color: var(--sky); transform: translateX(3px); }

  /* ── Mobile cards ── */
  .sa-mobile-cards { display: none; padding: 1rem; }
  @media (max-width: 767px) {
    .sa-table-desktop { display: none; }
    .sa-mobile-cards  { display: block; }
  }

  .sa-school-card {
    background: var(--white);
    border-radius: 14px;
    border: 1px solid rgba(26,111,181,0.09);
    padding: 1rem;
    margin-bottom: 0.65rem;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(14,74,128,0.06);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    display: block; width: 100%; text-align: left;
    position: relative; overflow: hidden;
  }
  .sa-school-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, var(--sky), var(--sky-light));
    border-radius: 3px 0 0 3px;
  }
  .sa-school-card:active { transform: scale(0.98); }

  .sa-card-top {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .sa-card-stats {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .sa-card-stat {
    background: var(--light); border-radius: 8px; padding: 8px 10px;
  }
  .sa-card-stat-label { font-size: 0.62rem; color: var(--gray); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .sa-card-stat-value { font-family: var(--font-heading); font-size: 1.1rem; color: var(--text); margin-top: 1px; }

  /* ── Error banner ── */
  .sa-error {
    margin: 1.25rem 1.5rem 0;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    color: #ef4444;
    font-size: 0.855rem; font-weight: 500;
    display: flex; align-items: center; gap: 0.5rem;
  }

  /* ── Loading ── */
  @keyframes sa-spin { to { transform: rotate(360deg); } }
  .sa-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid rgba(26,111,181,0.15);
    border-top-color: var(--sky);
    animation: sa-spin 0.75s linear infinite;
    margin: 0 auto 1rem;
  }

  /* ── Fade in ── */
  @keyframes sa-fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sa-fade  { animation: sa-fadeUp 0.45s ease both; }
  .sa-d1 { animation-delay: 0.05s; }
  .sa-d2 { animation-delay: 0.1s;  }
  .sa-d3 { animation-delay: 0.15s; }

  /* ── Bottom spacing ── */
  .sa-spacer { height: 2rem; }
`;

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════════ */
function riskColor(pct) {
  if (pct >= 30) return '#ef4444';
  if (pct >= 15) return '#f59e0b';
  return '#10b981';
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ══════════════════════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════════════════════ */
function StatCard({ title, value, icon: Icon, color, bg, topColor }) {
  return (
    <div className="sa-stat-card" style={{ '--top': topColor }}>
      <style>{`.sa-stat-card:hover::before { background: ${topColor}; }`}</style>
      <div className="sa-stat-top">
        <div className="sa-stat-icon" style={{ background: bg, color }}>
          <Icon />
        </div>
        <span className="sa-stat-trend" style={{ background: `${color}18`, color }}>
          <FaArrowUp style={{ fontSize: '0.55rem' }} />
        </span>
      </div>
      <div className="sa-stat-num" style={{ color }}>{value.toLocaleString()}</div>
      <div className="sa-stat-label">{title}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════ */
export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError('');
        const [statsRes, schoolsRes] = await Promise.all([
          apiService.getPlatformStats(),
          apiService.getAllSchoolsSummary(),
        ]);
        setStats(statsRes.stats || null);
        setSchools(schoolsRes.schools || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="sa-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="sa-spinner" />
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
              Loading platform data…
            </p>
          </div>
        </div>
      </>
    );
  }

  const statItems = [
    { title: 'Total Schools',       value: stats?.totalSchools               ?? 0, icon: FaSchool,           color: 'var(--sky)',     bg: 'rgba(26,111,181,0.1)',  topColor: 'linear-gradient(90deg,#0e4a80,#2d8fd4)' },
    { title: 'Total Teachers',      value: stats?.totalTeachers              ?? 0, icon: FaUserTie,          color: '#7c3aed',        bg: 'rgba(124,58,237,0.1)',  topColor: 'linear-gradient(90deg,#7c3aed,#a855f7)' },
    { title: 'Total Students',      value: stats?.totalStudents              ?? 0, icon: FaUsers,            color: '#10b981',        bg: 'rgba(16,185,129,0.1)',  topColor: 'linear-gradient(90deg,#10b981,#34d399)'  },
    { title: 'High Risk Students',  value: stats?.totalHighRiskStudents      ?? 0, icon: FaExclamationTriangle, color: '#ef4444',     bg: 'rgba(239,68,68,0.1)',   topColor: 'linear-gradient(90deg,#ef4444,#f87171)'  },
    { title: 'Active Interventions',value: stats?.totalActiveInterventions   ?? 0, icon: FaHandsHelping,     color: '#f59e0b',        bg: 'rgba(245,158,11,0.1)',  topColor: 'linear-gradient(90deg,#f59e0b,#fbbf24)'  },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="sa-page">

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <div className="sa-hero sa-fade">
          <div className="sa-hero-blob" /><div className="sa-hero-blob2" />
          <div className="sa-hero-content">
            <span className="sa-hero-tag">
              <FaGlobeAsia style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
              Platform Governance
            </span>
            <h1 className="sa-hero-title">Super Admin Dashboard</h1>
            <p className="sa-hero-sub">Cross-school platform risk & intervention overview</p>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="sa-stats-wrap sa-fade sa-d1">
          <div className="sa-stats-grid">
            {statItems.map(s => <StatCard key={s.title} {...s} />)}
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────────────── */}
        {error && (
          <div className="sa-error">
            <FaExclamationTriangle style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* ── Schools Table ───────────────────────────────────────────── */}
        <div className="sa-section sa-fade sa-d2">
          <div className="sa-section-head">
            <div>
              <span className="sa-tag">All Schools</span>
              <h2 className="sa-section-title">School-wise Risk Breakdown</h2>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray)', fontWeight: 600 }}>
              {schools.length} school{schools.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Desktop table ─────────────────────────────────────────── */}
          <div className="sa-table-card sa-table-desktop">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Students</th>
                  <th>High Risk</th>
                  <th>Risk Level</th>
                  <th>Intervention</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {schools.map(school => {
                  const rc = riskColor(school.riskPercentage);
                  return (
                    <tr key={school.id} onClick={() => navigate(`/super-admin/schools/${school.id}`)}>
                      <td>
                        <div className="sa-school-name">
                          <div className="sa-school-avatar">{initials(school.name)}</div>
                          <span className="sa-school-label">{school.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{school.studentsCount}</td>
                      <td style={{ fontWeight: 700, color: '#ef4444' }}>{school.highRiskCount}</td>
                      <td>
                        <div className="sa-risk-bar-wrap">
                          <div className="sa-risk-bar-bg">
                            <div
                              className="sa-risk-bar-fill"
                              style={{ width: `${Math.min(school.riskPercentage, 100)}%`, background: rc }}
                            />
                          </div>
                          <span className="sa-risk-pct" style={{ color: rc }}>
                            {school.riskPercentage}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--sky)' }}>
                          {school.interventionPercentage}%
                        </span>
                      </td>
                      <td>
                        <span className={`sa-badge ${school.isActive ? 'sa-badge-active' : 'sa-badge-inactive'}`}>
                          <FaCircle style={{ fontSize: '0.4rem' }} />
                          {school.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <FaChevronRight className="sa-chevron-cell" style={{ fontSize: '0.75rem' }} />
                      </td>
                    </tr>
                  );
                })}
                {!schools.length && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gray)' }}>
                      No schools found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ──────────────────────────────────────────── */}
          <div className="sa-mobile-cards">
            {schools.map(school => {
              const rc = riskColor(school.riskPercentage);
              return (
                <button
                  key={school.id}
                  className="sa-school-card"
                  type="button"
                  onClick={() => navigate(`/super-admin/schools/${school.id}`)}
                >
                  <div className="sa-card-top">
                    <div className="sa-school-avatar">{initials(school.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem', marginBottom: '3px' }}>
                        {school.name}
                      </div>
                      <span className={`sa-badge ${school.isActive ? 'sa-badge-active' : 'sa-badge-inactive'}`}>
                        <FaCircle style={{ fontSize: '0.4rem' }} />
                        {school.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <FaChevronRight style={{ color: 'rgba(26,111,181,0.3)', fontSize: '0.75rem', flexShrink: 0 }} />
                  </div>

                  <div className="sa-card-stats">
                    {[
                      { label: 'Students',     value: school.studentsCount,         color: 'var(--text)' },
                      { label: 'High Risk',    value: school.highRiskCount,          color: '#ef4444' },
                      { label: 'Risk %',       value: `${school.riskPercentage}%`,   color: rc },
                      { label: 'Intervention', value: `${school.interventionPercentage}%`, color: 'var(--sky)' },
                    ].map(s => (
                      <div key={s.label} className="sa-card-stat">
                        <div className="sa-card-stat-label">{s.label}</div>
                        <div className="sa-card-stat-value" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Risk bar */}
                  <div style={{ marginTop: '10px' }}>
                    <div className="sa-risk-bar-bg" style={{ height: '6px', borderRadius: '3px' }}>
                      <div
                        className="sa-risk-bar-fill"
                        style={{ width: `${Math.min(school.riskPercentage, 100)}%`, background: rc }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
            {!schools.length && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)', fontSize: '0.875rem' }}>
                No schools found
              </div>
            )}
          </div>
        </div>

        <div className="sa-spacer" />
      </div>
    </>
  );
}