import { useState, useEffect } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave,
  FaTimes, FaSpinner, FaShieldAlt, FaCheckCircle,
  FaExclamationCircle, FaLock, FaGlobeAsia, FaStar
} from 'react-icons/fa';
import apiService from '../../services/apiService';

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
    --font-heading: 'DM Serif Display', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  .sp-page {
    min-height: 100vh;
    background: var(--light);
    font-family: var(--font-body);
    padding-bottom: 2.5rem;
  }

  /* ── Hero ── */
  .sp-hero {
    background: linear-gradient(145deg, #0e4a80 0%, #1a6fb5 55%, #2d8fd4 100%);
    padding: 2rem 2rem 5rem;
    position: relative; overflow: hidden;
  }
  .sp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
  }
  .sp-hero-blob {
    position: absolute; top: -60px; right: -60px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .sp-hero-blob2 {
    position: absolute; bottom: -30px; left: 5%;
    width: 160px; height: 160px; border-radius: 50%;
    background: radial-gradient(circle, rgba(240,165,0,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .sp-hero-inner { position: relative; z-index: 1; }
  .sp-hero-tag {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
    display: block; margin-bottom: 0.4rem;
  }
  .sp-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 4vw, 2rem);
    color: white; margin: 0 0 0.35rem; letter-spacing: -0.02em;
  }
  .sp-hero-sub { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin: 0; }

  /* ── Avatar card (overlaps hero) ── */
  .sp-avatar-wrap {
    padding: 0 1.5rem;
    margin-top: -3.2rem;
    position: relative; z-index: 2;
    max-width: 860px; margin-left: auto; margin-right: auto;
    padding-left: 1.5rem; padding-right: 1.5rem;
  }
  .sp-avatar-card {
    background: var(--white);
    border-radius: 20px;
    border: 1px solid rgba(26,111,181,0.1);
    box-shadow: 0 8px 32px rgba(14,74,128,0.12);
    padding: 1.5rem;
    display: flex; align-items: center; gap: 1.25rem;
    flex-wrap: wrap;
  }
  .sp-avatar-circle {
    width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #0e4a80, #2d8fd4);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 18px rgba(26,111,181,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
    position: relative;
  }
  .sp-avatar-circle::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
    border-radius: 50% 50% 0 0;
  }
  .sp-avatar-name {
    font-family: var(--font-heading);
    font-size: 1.3rem; color: var(--text); margin: 0 0 4px; letter-spacing: -0.01em;
  }
  .sp-avatar-role {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 30px;
    background: rgba(26,111,181,0.08);
    border: 1px solid rgba(26,111,181,0.15);
    font-size: 0.72rem; font-weight: 700; color: var(--sky);
    letter-spacing: 0.04em;
  }
  .sp-avatar-actions { margin-left: auto; display: flex; gap: 0.5rem; flex-wrap: wrap; }

  /* ── Buttons ── */
  .sp-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1.1rem; border-radius: 9px;
    font-family: var(--font-body); font-size: 0.855rem; font-weight: 600;
    cursor: pointer; border: none;
    transition: background 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease;
  }
  .sp-btn:active { transform: scale(0.97); }
  .sp-btn-primary {
    background: linear-gradient(135deg, var(--sky-deep), var(--sky));
    color: white;
    box-shadow: 0 3px 12px rgba(26,111,181,0.25);
  }
  .sp-btn-primary:hover { box-shadow: 0 5px 18px rgba(26,111,181,0.35); }
  .sp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .sp-btn-ghost {
    background: var(--light);
    color: var(--gray);
    border: 1px solid rgba(26,111,181,0.12);
  }
  .sp-btn-ghost:hover { background: rgba(26,111,181,0.06); color: var(--text); }
  .sp-btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }
  .sp-btn-edit {
    background: rgba(26,111,181,0.07);
    color: var(--sky);
    border: 1px solid rgba(26,111,181,0.18);
  }
  .sp-btn-edit:hover { background: rgba(26,111,181,0.12); }

  /* ── Content area ── */
  .sp-content {
    max-width: 860px; margin: 0 auto;
    padding: 1.5rem 1.5rem 0;
    display: flex; flex-direction: column; gap: 1.25rem;
  }

  /* ── Card ── */
  .sp-card {
    background: var(--white);
    border-radius: 18px;
    border: 1px solid rgba(26,111,181,0.09);
    box-shadow: 0 2px 16px rgba(14,74,128,0.07);
    overflow: hidden;
  }
  .sp-card-header {
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid rgba(26,111,181,0.07);
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(240,244,249,0.5);
  }
  .sp-card-title {
    font-family: var(--font-heading);
    font-size: 1rem; color: var(--text); margin: 0;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .sp-card-title-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem;
  }
  .sp-card-body { padding: 1.4rem; }

  /* ── Form grid ── */
  .sp-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (max-width: 600px) { .sp-form-grid { grid-template-columns: 1fr; } }

  /* ── Field ── */
  .sp-field label {
    display: block;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; color: var(--gray);
    margin-bottom: 0.4rem;
  }
  .sp-field-wrap {
    position: relative; display: flex; align-items: center;
  }
  .sp-field-icon {
    position: absolute; left: 0.85rem;
    color: rgba(26,111,181,0.4); font-size: 0.85rem;
    pointer-events: none; z-index: 1;
  }
  .sp-input {
    width: 100%; padding: 0.65rem 0.9rem;
    border: 1.5px solid rgba(26,111,181,0.15);
    border-radius: 10px;
    font-family: var(--font-body); font-size: 0.9rem;
    color: var(--text); background: var(--white);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    box-sizing: border-box;
  }
  .sp-input:focus {
    border-color: var(--sky);
    box-shadow: 0 0 0 3px rgba(26,111,181,0.1);
  }
  .sp-input:disabled {
    background: var(--light); color: var(--gray);
    cursor: not-allowed; border-color: rgba(26,111,181,0.08);
  }
  .sp-input.has-icon { padding-left: 2.4rem; }
  .sp-field-hint {
    font-size: 0.68rem; color: var(--gray); margin-top: 0.3rem;
    display: flex; align-items: center; gap: 4px;
  }

  /* ── Toast / message ── */
  .sp-toast {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.8rem 1rem; border-radius: 12px;
    font-size: 0.855rem; font-weight: 500;
    animation: sp-fadeUp 0.3s ease both;
  }
  .sp-toast-success {
    background: rgba(16,185,129,0.08);
    border: 1px solid rgba(16,185,129,0.22);
    color: #10b981;
  }
  .sp-toast-error {
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    color: #ef4444;
  }

  /* ── Account details rows ── */
  .sp-detail-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 0;
    border-bottom: 1px solid rgba(26,111,181,0.06);
  }
  .sp-detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .sp-detail-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.855rem; color: var(--gray);
  }
  .sp-detail-label-icon {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; flex-shrink: 0;
  }
  .sp-detail-value {
    font-size: 0.875rem; font-weight: 600; color: var(--text);
  }
  .sp-detail-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 30px;
    font-size: 0.72rem; font-weight: 700;
  }

  /* ── Spinner ── */
  @keyframes sp-spin { to { transform: rotate(360deg); } }
  .sp-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid rgba(26,111,181,0.15);
    border-top-color: var(--sky);
    animation: sp-spin 0.75s linear infinite; margin: 0 auto 1rem;
  }

  /* ── Fade up ── */
  @keyframes sp-fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sp-fade   { animation: sp-fadeUp 0.45s ease both; }
  .sp-d1 { animation-delay: 0.05s; }
  .sp-d2 { animation-delay: 0.1s;  }
  .sp-d3 { animation-delay: 0.15s; }
`;

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function SuperAdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [message,   setMessage]   = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    fullName: '', email: '', phone: '', designation: '',
  });
  const [originalData, setOriginalData] = useState({});

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      if (response.success) {
        const data = {
          fullName:    response.user.fullName    || '',
          email:       response.user.email       || '',
          phone:       response.user.phone       || '',
          designation: response.user.designation || 'Super Administrator',
        };
        setProfileData(data);
        setOriginalData(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit   = () => { setIsEditing(true);  setMessage({ type: '', text: '' }); };
  const handleCancel = () => { setProfileData(originalData); setIsEditing(false); setMessage({ type: '', text: '' }); };

  const handleSave = async () => {
    if (!profileData.fullName.trim()) { setMessage({ type: 'error', text: 'Full name is required' }); return; }
    if (!profileData.email.trim())    { setMessage({ type: 'error', text: 'Email is required' });     return; }
    try {
      setSaving(true); setMessage({ type: '', text: '' });
      const response = await apiService.updateProfile({
        fullName:    profileData.fullName,
        phone:       profileData.phone,
        designation: profileData.designation,
      });
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setOriginalData(profileData);
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Save profile error:', error);
      setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="sp-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="sp-spinner" />
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
              Loading profile…
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="sp-page">

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <div className="sp-hero sp-fade">
          <div className="sp-hero-blob" /><div className="sp-hero-blob2" />
          <div className="sp-hero-inner">
            <span className="sp-hero-tag">
              <FaGlobeAsia style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              Super Administrator
            </span>
            <h1 className="sp-hero-title">My Profile</h1>
            <p className="sp-hero-sub">Manage your account information and preferences</p>
          </div>
        </div>

        {/* ── Avatar card (overlaps hero) ─────────────────────────────── */}
        <div className="sp-avatar-wrap sp-fade sp-d1">
          <div className="sp-avatar-card">
            {/* Avatar */}
            <div className="sp-avatar-circle">
              <FaShieldAlt style={{ color: 'white', fontSize: '1.6rem', position: 'relative', zIndex: 1 }} />
            </div>

            {/* Name + role */}
            <div>
              <div className="sp-avatar-name">
                {profileData.fullName || 'Super Administrator'}
              </div>
              <div style={{ marginTop: '6px' }}>
                <span className="sp-avatar-role">
                  <FaStar style={{ fontSize: '0.55rem' }} />
                  {profileData.designation || 'Super Administrator'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="sp-avatar-actions">
              {!isEditing ? (
                <button className="sp-btn sp-btn-edit" onClick={handleEdit}>
                  <FaEdit style={{ fontSize: '0.8rem' }} /> Edit Profile
                </button>
              ) : (
                <>
                  <button className="sp-btn sp-btn-ghost" onClick={handleCancel} disabled={saving}>
                    <FaTimes style={{ fontSize: '0.8rem' }} /> Cancel
                  </button>
                  <button className="sp-btn sp-btn-primary" onClick={handleSave} disabled={saving}>
                    {saving
                      ? <><FaSpinner style={{ animation: 'sp-spin 0.75s linear infinite', fontSize: '0.8rem' }} /> Saving…</>
                      : <><FaSave style={{ fontSize: '0.8rem' }} /> Save Changes</>
                    }
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="sp-content">

          {/* Toast */}
          {message.text && (
            <div className={`sp-toast ${message.type === 'success' ? 'sp-toast-success' : 'sp-toast-error'}`}>
              {message.type === 'success'
                ? <FaCheckCircle style={{ flexShrink: 0 }} />
                : <FaExclamationCircle style={{ flexShrink: 0 }} />
              }
              {message.text}
            </div>
          )}

          {/* ── Personal Information card ── */}
          <div className="sp-card sp-fade sp-d2">
            <div className="sp-card-header">
              <h3 className="sp-card-title">
                <div className="sp-card-title-icon" style={{ background: 'rgba(26,111,181,0.1)', color: 'var(--sky)' }}>
                  <FaUser />
                </div>
                Personal Information
              </h3>
            </div>
            <div className="sp-card-body">
              <div className="sp-form-grid">

                {/* Full Name */}
                <div className="sp-field">
                  <label>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div className="sp-field-wrap">
                    <FaUser className="sp-field-icon" />
                    <input
                      type="text" name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="sp-input has-icon"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sp-field">
                  <label>Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div className="sp-field-wrap">
                    <FaEnvelope className="sp-field-icon" />
                    <input
                      type="email" name="email"
                      value={profileData.email}
                      disabled
                      className="sp-input has-icon"
                    />
                  </div>
                  <div className="sp-field-hint">
                    <FaLock style={{ fontSize: '0.6rem', color: 'var(--gray)' }} />
                    Email cannot be changed
                  </div>
                </div>

                {/* Phone */}
                <div className="sp-field">
                  <label>Phone Number</label>
                  <div className="sp-field-wrap">
                    <FaPhone className="sp-field-icon" />
                    <input
                      type="tel" name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="sp-input has-icon"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Designation */}
                <div className="sp-field">
                  <label>Designation</label>
                  <div className="sp-field-wrap">
                    <FaShieldAlt className="sp-field-icon" />
                    <input
                      type="text" name="designation"
                      value={profileData.designation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="sp-input has-icon"
                      placeholder="Your designation"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Account Details card ── */}
          <div className="sp-card sp-fade sp-d3">
            <div className="sp-card-header">
              <h3 className="sp-card-title">
                <div className="sp-card-title-icon" style={{ background: 'rgba(240,165,0,0.1)', color: 'var(--accent)' }}>
                  <FaShieldAlt />
                </div>
                Account Details
              </h3>
            </div>
            <div className="sp-card-body" style={{ padding: '0.5rem 1.4rem 1.4rem' }}>

              {[
                {
                  label: 'Account Type', icon: <FaUser />, iconBg: 'rgba(26,111,181,0.1)', iconColor: 'var(--sky)',
                  value: <span className="sp-detail-value">Super Administrator</span>
                },
                {
                  label: 'Access Level', icon: <FaGlobeAsia />, iconBg: 'rgba(124,58,237,0.1)', iconColor: '#7c3aed',
                  value: (
                    <span className="sp-detail-badge" style={{ background: 'rgba(26,111,181,0.08)', color: 'var(--sky)', border: '1px solid rgba(26,111,181,0.18)' }}>
                      Full Platform Access
                    </span>
                  )
                },
                {
                  label: 'Permissions', icon: <FaShieldAlt />, iconBg: 'rgba(16,185,129,0.1)', iconColor: 'var(--success)',
                  value: (
                    <span className="sp-detail-badge" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      All Schools Management
                    </span>
                  )
                },
              ].map(row => (
                <div key={row.label} className="sp-detail-row">
                  <div className="sp-detail-label">
                    <div className="sp-detail-label-icon" style={{ background: row.iconBg, color: row.iconColor }}>
                      {row.icon}
                    </div>
                    {row.label}
                  </div>
                  {row.value}
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}