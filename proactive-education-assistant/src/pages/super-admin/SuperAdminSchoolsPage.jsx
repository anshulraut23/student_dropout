import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import {
  FaSchool, FaUsers, FaUserTie, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaCircle, FaSpinner, FaEnvelope,
  FaMapMarkerAlt, FaToggleOn, FaToggleOff, FaClock,
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

  .ss-page {
    min-height: 100vh;
    background: var(--light);
    font-family: var(--font-body);
    padding-bottom: 2.5rem;
  }

  /* ── Hero ── */
  .ss-hero {
    background: linear-gradient(145deg, #0e4a80 0%, #1a6fb5 55%, #2d8fd4 100%);
    padding: 2rem 2rem 4rem;
    position: relative; overflow: hidden;
  }
  .ss-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
  }
  .ss-hero-blob  { position: absolute; top: -60px; right: -60px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); pointer-events: none; }
  .ss-hero-blob2 { position: absolute; bottom: -30px; left: 8%; width: 160px; height: 160px; border-radius: 50%; background: radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%); pointer-events: none; }
  .ss-hero-inner { position: relative; z-index: 1; }

  .ss-hero-tag {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    display: block; margin-bottom: 0.4rem;
  }
  .ss-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 4vw, 2rem);
    color: white; margin: 0 0 0.35rem; letter-spacing: -0.02em; line-height: 1.1;
  }
  .ss-hero-sub { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin: 0; }

  /* ── Summary chips (overlap hero) ── */
  .ss-chips-wrap {
    padding: 0 1.5rem;
    margin-top: -1.5rem;
    position: relative; z-index: 2;
    max-width: 1100px; margin-left: auto; margin-right: auto;
    padding-left: 1.5rem; padding-right: 1.5rem;
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .ss-chip {
    background: var(--white);
    border-radius: 12px; padding: 0.65rem 1rem;
    border: 1px solid rgba(26,111,181,0.1);
    box-shadow: 0 4px 16px rgba(14,74,128,0.1);
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 0.82rem; font-weight: 600; color: var(--text);
    white-space: nowrap;
  }
  .ss-chip-icon {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; flex-shrink: 0;
  }

  /* ── Content ── */
  .ss-content {
    max-width: 1100px; margin: 1.5rem auto 0;
    padding: 0 1.5rem;
    display: flex; flex-direction: column; gap: 1.25rem;
  }

  /* ── Section card ── */
  .ss-card {
    background: var(--white);
    border-radius: 18px;
    border: 1px solid rgba(26,111,181,0.09);
    box-shadow: 0 2px 16px rgba(14,74,128,0.07);
    overflow: hidden;
  }
  .ss-card-header {
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid rgba(26,111,181,0.07);
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(240,244,249,0.5);
  }
  .ss-card-title {
    font-family: var(--font-heading);
    font-size: 1rem; color: var(--text); margin: 0;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .ss-card-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
  }
  .ss-pending-badge {
    padding: 2px 9px; border-radius: 30px;
    font-size: 0.7rem; font-weight: 700;
    background: rgba(240,165,0,0.12); color: var(--warning);
    border: 1px solid rgba(240,165,0,0.25);
    display: flex; align-items: center; gap: 4px;
  }

  /* ── Table ── */
  .ss-table { width: 100%; border-collapse: collapse; font-family: var(--font-body); }
  .ss-table thead tr { background: var(--light); border-bottom: 1px solid rgba(26,111,181,0.1); }
  .ss-table th {
    padding: 0.75rem 1rem; text-align: left;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray); white-space: nowrap;
  }
  .ss-table td {
    padding: 0.85rem 1rem; font-size: 0.875rem; color: var(--text);
    border-bottom: 1px solid rgba(26,111,181,0.05);
    vertical-align: middle;
  }
  .ss-table tbody tr { transition: background 0.18s ease; }
  .ss-table tbody tr:hover { background: rgba(26,111,181,0.03); }
  .ss-table tbody tr:last-child td { border-bottom: none; }

  /* Admin avatar */
  .ss-admin-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #0e4a80, #2d8fd4);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: white;
    box-shadow: 0 2px 8px rgba(26,111,181,0.25);
  }
  .ss-admin-name { display: flex; align-items: center; gap: 9px; }
  .ss-admin-label { font-weight: 600; color: var(--text); }

  /* School avatar */
  .ss-school-avatar {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, #0e4a80, #1a6fb5);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: white;
    box-shadow: 0 2px 8px rgba(26,111,181,0.22);
  }

  /* Badges */
  .ss-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 30px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.03em;
  }
  .ss-badge-active   { background: rgba(16,185,129,0.1);  color: #10b981; border: 1px solid rgba(16,185,129,0.22); }
  .ss-badge-inactive { background: rgba(107,122,141,0.1); color: var(--gray); border: 1px solid rgba(107,122,141,0.2); }

  /* Action buttons */
  .ss-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 8px;
    font-family: var(--font-body); font-size: 0.8rem; font-weight: 600;
    cursor: pointer; border: none; transition: background 0.2s, transform 0.15s, opacity 0.2s;
  }
  .ss-btn:active { transform: scale(0.96); }
  .ss-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .ss-btn-approve { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.22); }
  .ss-btn-approve:hover:not(:disabled) { background: rgba(16,185,129,0.18); }
  .ss-btn-reject  { background: rgba(239,68,68,0.08);  color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
  .ss-btn-reject:hover:not(:disabled)  { background: rgba(239,68,68,0.15); }
  .ss-btn-toggle-off { background: rgba(16,185,129,0.08); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
  .ss-btn-toggle-off:hover:not(:disabled) { background: rgba(16,185,129,0.15); }
  .ss-btn-toggle-on  { background: rgba(107,122,141,0.08); color: var(--gray); border: 1px solid rgba(107,122,141,0.18); }
  .ss-btn-toggle-on:hover:not(:disabled)  { background: rgba(107,122,141,0.15); }

  /* Location cell */
  .ss-location { display: flex; align-items: center; gap: 4px; color: var(--gray); font-size: 0.82rem; }

  /* Email cell */
  .ss-email { display: flex; align-items: center; gap: 5px; color: var(--gray); font-size: 0.82rem; }

  /* ── Mobile cards ── */
  .ss-table-desktop { display: block; }
  .ss-mobile-list   { display: none; padding: 0.75rem; }
  @media (max-width: 767px) {
    .ss-table-desktop { display: none; }
    .ss-mobile-list   { display: block; }
  }

  .ss-mob-req-card {
    background: var(--white); border-radius: 14px;
    border: 1px solid rgba(240,165,0,0.18);
    padding: 1rem; margin-bottom: 0.6rem;
    box-shadow: 0 2px 10px rgba(14,74,128,0.07);
    position: relative; overflow: hidden;
  }
  .ss-mob-req-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, var(--warning), #fbbf24);
    border-radius: 3px 0 0 3px;
  }

  .ss-mob-school-card {
    background: var(--white); border-radius: 14px;
    border: 1px solid rgba(26,111,181,0.1);
    padding: 1rem; margin-bottom: 0.6rem;
    box-shadow: 0 2px 10px rgba(14,74,128,0.07);
    position: relative; overflow: hidden;
  }
  .ss-mob-school-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, var(--sky), var(--sky-light));
    border-radius: 3px 0 0 3px;
  }
  .ss-mob-card-top  { display: flex; align-items: center; gap: 9px; margin-bottom: 9px; }
  .ss-mob-card-info { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
  .ss-mob-card-actions { display: flex; gap: 7px; margin-top: 10px; }
  .ss-mob-card-actions .ss-btn { flex: 1; justify-content: center; }
  .ss-mob-meta-row { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--gray); }

  /* ── Error ── */
  .ss-error {
    margin: 0; padding: 0.8rem 1rem; border-radius: 12px;
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.18);
    color: #ef4444; font-size: 0.855rem; font-weight: 500;
    display: flex; align-items: center; gap: 0.5rem;
  }

  /* ── Empty ── */
  .ss-empty { padding: 2.5rem 1rem; text-align: center; color: var(--gray); font-size: 0.875rem; }

  /* ── Spinner ── */
  @keyframes ss-spin { to { transform: rotate(360deg); } }
  .ss-spin { animation: ss-spin 0.7s linear infinite; }
  .ss-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid rgba(26,111,181,0.15); border-top-color: var(--sky); animation: ss-spin 0.75s linear infinite; margin: 0 auto 1rem; }

  /* ── Fade ── */
  @keyframes ss-fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .ss-fade { animation: ss-fadeUp 0.4s ease both; }
  .ss-d1 { animation-delay: 0.05s; }
  .ss-d2 { animation-delay: 0.1s;  }
  .ss-d3 { animation-delay: 0.15s; }
`;

/* ── Helpers ──────────────────────────────────────────────────────────── */
function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function SuperAdminSchoolsPage() {
  const [schools, setSchools]                       = useState([]);
  const [pendingAdminRequests, setPendingAdminRequests] = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [processingAdminId, setProcessingAdminId]   = useState('');
  const [error, setError]                           = useState('');

  const loadData = async () => {
    try {
      setLoading(true); setError('');
      const [schoolsRes, requestsRes] = await Promise.all([
        apiService.getAllSchoolsSummary(),
        apiService.getPendingAdminRequests(),
      ]);
      setSchools(schoolsRes.schools || []);
      setPendingAdminRequests(requestsRes.requests || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleStatus = async (school) => {
    try {
      setError('');
      await apiService.updateSchoolStatus(school.id, !school.isActive);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update school status');
    }
  };

  const handleAdminRequestAction = async (adminId, action) => {
    try {
      setError(''); setProcessingAdminId(adminId);
      if (action === 'approve') await apiService.approveAdminRequest(adminId);
      else                      await apiService.rejectAdminRequest(adminId);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to process admin request');
    } finally {
      setProcessingAdminId('');
    }
  };

  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="ss-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="ss-spinner" />
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>Loading school data…</p>
          </div>
        </div>
      </>
    );
  }

  const activeCount   = schools.filter(s => s.isActive).length;
  const inactiveCount = schools.length - activeCount;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="ss-page">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <div className="ss-hero ss-fade">
          <div className="ss-hero-blob" /><div className="ss-hero-blob2" />
          <div className="ss-hero-inner">
            <span className="ss-hero-tag">
              <FaSchool style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Platform Administration
            </span>
            <h1 className="ss-hero-title">School Management</h1>
            <p className="ss-hero-sub">Review pending admin registrations and control school access</p>
          </div>
        </div>

        {/* ── Summary chips ─────────────────────────────────────────── */}
        <div className="ss-chips-wrap ss-fade ss-d1">
          {[
            { icon: <FaSchool />,      bg: 'rgba(26,111,181,0.1)',  color: 'var(--sky)',     label: `${schools.length} Schools` },
            { icon: <FaCheckCircle />, bg: 'rgba(16,185,129,0.1)',  color: '#10b981',        label: `${activeCount} Active` },
            { icon: <FaTimesCircle />, bg: 'rgba(107,122,141,0.1)', color: 'var(--gray)',    label: `${inactiveCount} Inactive` },
            { icon: <FaClock />,       bg: 'rgba(240,165,0,0.1)',   color: 'var(--warning)', label: `${pendingAdminRequests.length} Pending` },
          ].map(c => (
            <div key={c.label} className="ss-chip">
              <div className="ss-chip-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
              {c.label}
            </div>
          ))}
        </div>

        <div className="ss-content">

          {/* ── Error ── */}
          {error && (
            <div className="ss-error">
              <FaExclamationTriangle style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* ══ Pending Admin Requests ════════════════════════════════ */}
          <div className="ss-card ss-fade ss-d2">
            <div className="ss-card-header">
              <h2 className="ss-card-title">
                <div className="ss-card-icon" style={{ background: 'rgba(240,165,0,0.12)', color: 'var(--warning)' }}>
                  <FaClock />
                </div>
                Pending Admin Requests
              </h2>
              {pendingAdminRequests.length > 0 && (
                <span className="ss-pending-badge">
                  <FaCircle style={{ fontSize: '0.4rem' }} />
                  {pendingAdminRequests.length} awaiting
                </span>
              )}
            </div>

            {/* Desktop */}
            <div className="ss-table-desktop">
              <table className="ss-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Email</th>
                    <th>School</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAdminRequests.map(req => {
                    const isProcessing = processingAdminId === req.id;
                    return (
                      <tr key={req.id}>
                        <td>
                          <div className="ss-admin-name">
                            <div className="ss-admin-avatar">{initials(req.fullName)}</div>
                            <span className="ss-admin-label">{req.fullName}</span>
                          </div>
                        </td>
                        <td>
                          <div className="ss-email">
                            <FaEnvelope style={{ fontSize: '0.7rem', flexShrink: 0 }} />
                            {req.email}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{req.schoolName || '-'}</td>
                        <td>
                          <div className="ss-location">
                            <FaMapMarkerAlt style={{ fontSize: '0.7rem', flexShrink: 0 }} />
                            {[req.schoolCity, req.schoolState].filter(Boolean).join(', ') || '-'}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 7 }}>
                            <button
                              type="button"
                              className="ss-btn ss-btn-approve"
                              onClick={() => handleAdminRequestAction(req.id, 'approve')}
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? <FaSpinner className="ss-spin" style={{ fontSize: '0.75rem' }} />
                                : <FaCheckCircle style={{ fontSize: '0.75rem' }} />
                              }
                              Approve
                            </button>
                            <button
                              type="button"
                              className="ss-btn ss-btn-reject"
                              onClick={() => handleAdminRequestAction(req.id, 'reject')}
                              disabled={isProcessing}
                            >
                              <FaTimesCircle style={{ fontSize: '0.75rem' }} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!pendingAdminRequests.length && (
                    <tr><td colSpan={5}><div className="ss-empty">✓ No pending admin requests</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="ss-mobile-list">
              {pendingAdminRequests.map(req => {
                const isProcessing = processingAdminId === req.id;
                return (
                  <div key={req.id} className="ss-mob-req-card">
                    <div className="ss-mob-card-top">
                      <div className="ss-admin-avatar">{initials(req.fullName)}</div>
                      <div className="ss-mob-card-info">
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{req.fullName}</div>
                        <div className="ss-mob-meta-row"><FaEnvelope style={{ fontSize: '0.65rem' }} />{req.email}</div>
                      </div>
                    </div>
                    <div className="ss-mob-meta-row" style={{ marginBottom: 4 }}>
                      <FaSchool style={{ fontSize: '0.65rem' }} />
                      {req.schoolName || '-'}
                    </div>
                    <div className="ss-mob-meta-row">
                      <FaMapMarkerAlt style={{ fontSize: '0.65rem' }} />
                      {[req.schoolCity, req.schoolState].filter(Boolean).join(', ') || '-'}
                    </div>
                    <div className="ss-mob-card-actions">
                      <button type="button" className="ss-btn ss-btn-approve" onClick={() => handleAdminRequestAction(req.id, 'approve')} disabled={isProcessing}>
                        {isProcessing ? <FaSpinner className="ss-spin" style={{ fontSize: '0.75rem' }} /> : <FaCheckCircle style={{ fontSize: '0.75rem' }} />}
                        Approve
                      </button>
                      <button type="button" className="ss-btn ss-btn-reject" onClick={() => handleAdminRequestAction(req.id, 'reject')} disabled={isProcessing}>
                        <FaTimesCircle style={{ fontSize: '0.75rem' }} /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
              {!pendingAdminRequests.length && <div className="ss-empty">✓ No pending admin requests</div>}
            </div>
          </div>

          {/* ══ All Schools ═══════════════════════════════════════════ */}
          <div className="ss-card ss-fade ss-d3">
            <div className="ss-card-header">
              <h2 className="ss-card-title">
                <div className="ss-card-icon" style={{ background: 'rgba(26,111,181,0.1)', color: 'var(--sky)' }}>
                  <FaSchool />
                </div>
                All Schools
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray)', fontWeight: 600 }}>
                {schools.length} school{schools.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Desktop */}
            <div className="ss-table-desktop">
              <table className="ss-table">
                <thead>
                  <tr>
                    <th>School</th>
                    <th>City</th>
                    <th>Students</th>
                    <th>Teachers</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map(school => (
                    <tr key={school.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div className="ss-school-avatar">{initials(school.name)}</div>
                          <span style={{ fontWeight: 600 }}>{school.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="ss-location">
                          <FaMapMarkerAlt style={{ fontSize: '0.7rem', flexShrink: 0 }} />
                          {school.city || '-'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--sky)', fontWeight: 600 }}>
                          <FaUsers style={{ fontSize: '0.75rem', opacity: 0.7 }} /> {school.studentsCount}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7c3aed', fontWeight: 600 }}>
                          <FaUserTie style={{ fontSize: '0.75rem', opacity: 0.7 }} /> {school.teachersCount}
                        </div>
                      </td>
                      <td>
                        <span className={`ss-badge ${school.isActive ? 'ss-badge-active' : 'ss-badge-inactive'}`}>
                          <FaCircle style={{ fontSize: '0.4rem' }} />
                          {school.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`ss-btn ${school.isActive ? 'ss-btn-toggle-on' : 'ss-btn-toggle-off'}`}
                          onClick={() => handleToggleStatus(school)}
                        >
                          {school.isActive
                            ? <><FaToggleOff style={{ fontSize: '0.85rem' }} /> Deactivate</>
                            : <><FaToggleOn  style={{ fontSize: '0.85rem' }} /> Activate</>
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!schools.length && (
                    <tr><td colSpan={6}><div className="ss-empty">No schools available</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="ss-mobile-list">
              {schools.map(school => (
                <div key={school.id} className="ss-mob-school-card">
                  <div className="ss-mob-card-top">
                    <div className="ss-school-avatar">{initials(school.name)}</div>
                    <div className="ss-mob-card-info">
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 3 }}>{school.name}</div>
                      <div className="ss-mob-meta-row">
                        <FaMapMarkerAlt style={{ fontSize: '0.65rem' }} /> {school.city || 'No city'}
                      </div>
                    </div>
                    <span className={`ss-badge ${school.isActive ? 'ss-badge-active' : 'ss-badge-inactive'}`}>
                      <FaCircle style={{ fontSize: '0.4rem' }} />
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    <div style={{ background: 'var(--light)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontWeight: 600, color: 'var(--sky)' }}>
                      <FaUsers style={{ fontSize: '0.7rem' }} /> {school.studentsCount} Students
                    </div>
                    <div style={{ background: 'var(--light)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed' }}>
                      <FaUserTie style={{ fontSize: '0.7rem' }} /> {school.teachersCount} Teachers
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`ss-btn ${school.isActive ? 'ss-btn-toggle-on' : 'ss-btn-toggle-off'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => handleToggleStatus(school)}
                  >
                    {school.isActive
                      ? <><FaToggleOff style={{ fontSize: '0.85rem' }} /> Deactivate School</>
                      : <><FaToggleOn  style={{ fontSize: '0.85rem' }} /> Activate School</>
                    }
                  </button>
                </div>
              ))}
              {!schools.length && <div className="ss-empty">No schools available</div>}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}