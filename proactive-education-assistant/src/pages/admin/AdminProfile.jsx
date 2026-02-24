import { useState, useEffect } from 'react';
import { FaUser, FaSchool, FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import apiService from '../../services/apiService';
import { injectHorizonStyles } from '../../styles/horizonTheme';

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN PROFILE HERO SECTION STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const HERO_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ap-hero {
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

  .ap-hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .ap-hero-tag {
    display: inline-block;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .ap-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .ap-hero-subtitle {
    font-size: 0.9rem;
    font-weight: 300;
    color: white;
    margin: 0;
  }

  .ap-hero-actions {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 0.75rem;
  }
`;

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Inject both Horizon theme and Hero styles on mount
  useEffect(() => {
    injectHorizonStyles();
    // Inject Hero styles
    const styleTag = document.createElement('style');
    styleTag.textContent = HERO_STYLES;
    document.head.appendChild(styleTag);
    return () => styleTag.remove();
  }, []);
  
  const [profileData, setProfileData] = useState({
    // Admin Personal Info
    fullName: '',
    email: '',
    phone: '',
    designation: '',
    
    // School Details
    schoolName: '',
    schoolType: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      
      if (response.success) {
        const data = {
          fullName: response.user.fullName || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          designation: response.user.designation || '',
          schoolName: response.school?.name || '',
          schoolType: response.school?.type || '',
          address: response.school?.address || '',
          city: response.school?.city || '',
          state: response.school?.state || '',
          pincode: response.school?.pincode || ''
        };
        
        setProfileData(data);
        setOriginalData(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    // Validation
    if (!profileData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return;
    }
    if (!profileData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const updates = {
        fullName: profileData.fullName,
        phone: profileData.phone,
        designation: profileData.designation
      };

      const response = await apiService.updateProfile(updates);
      
      if (response.success) {
        setOriginalData(profileData);
        setIsEditing(false);
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="hd-page hd-flex-center" style={{ minHeight: '100vh' }}>
        <div className="hd-spinner"></div>
      </div>
    );
  }

  return (
    <div className="hd-page">
      {/* Hero Section */}
      <div className="ap-hero">
        <div className="ap-hero-content">
          <span className="ap-hero-tag">Admin Settings</span>
          <h1 className="ap-hero-title">My Profile</h1>
          <p className="ap-hero-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="ap-hero-actions">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="hd-btn-primary"
            >
              <FaEdit />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="hd-btn-secondary"
                style={{ opacity: saving ? 0.5 : 1 }}
              >
                <FaTimes />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="hd-btn-primary"
                style={{ opacity: saving ? 0.5 : 1 }}
              >
                {saving ? <FaSpinner style={{ animation: 'hd-spin 0.8s linear infinite' }} /> : <FaSave />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="hd-container">
        {/* Message */}
        {message.text && (
          <div className={`hd-card hd-fade mb-6 hd-badge-danger`} style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: message.type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
            color: message.type === 'success' ? '#10b981' : '#ef4444'
          }}>
            {message.text}
          </div>
        )}

        {/* Personal Information Section */}
        <div className="hd-card hd-section mb-6">
          <div className="hd-flex hd-gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(26,111,181,0.1)' }}>
            <FaUser style={{ color: '#1a6fb5', fontSize: '1.25rem' }} />
            <h2 className="hd-section-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>Personal Information</h2>
          </div>

          <div className="hd-grid-2">
            <div>
              <label className="hd-label">
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="hd-input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="hd-label">
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={true}
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed' }}
                placeholder="your.email@example.com"
              />
              <p className="hd-text-xs hd-text-muted mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="hd-label">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="hd-input"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="hd-label">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={profileData.designation}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="hd-input"
                placeholder="e.g., Principal, Vice Principal"
              />
            </div>
          </div>
        </div>

        {/* School Information Section */}
        <div className="hd-card hd-section">
          <div className="hd-flex hd-gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(26,111,181,0.1)' }}>
            <FaSchool style={{ color: '#1a6fb5', fontSize: '1.25rem' }} />
            <h2 className="hd-section-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>School Information</h2>
          </div>

          <div className="hd-grid-2">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="hd-label">
                School Name
              </label>
              <input
                type="text"
                name="schoolName"
                value={profileData.schoolName}
                disabled={true}
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed' }}
              />
              <p className="hd-text-xs hd-text-muted mt-1">School information is managed by system administrators</p>
            </div>

            <div>
              <label className="hd-label">
                School Type
              </label>
              <input
                type="text"
                name="schoolType"
                value={profileData.schoolType}
                disabled={true}
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label className="hd-label">
                City
              </label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                disabled={true}
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label className="hd-label">
                State
              </label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                disabled={true}
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label className="hd-label">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={profileData.pincode}
                disabled={true}
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="hd-label">
                Address
              </label>
              <textarea
                name="address"
                value={profileData.address}
                disabled={true}
                rows="2"
                className="hd-input"
                style={{ background: '#f5f8fb', color: '#6b7a8d', cursor: 'not-allowed', resize: 'none' }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
