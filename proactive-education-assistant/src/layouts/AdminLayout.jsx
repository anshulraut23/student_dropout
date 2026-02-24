import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar';
import { useState } from 'react';
import { FaBars, FaGraduationCap, FaSignOutAlt } from 'react-icons/fa';

/* ── Header-scoped Horizon styles ──────────────────────────────────────── */
const LAYOUT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  /* ── Top header bar ── */
  .hal-header {
    height: 72px;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 30;
    gap: 1rem;
    background: #ffffff;
    border-bottom: 1px solid rgba(26,111,181,0.1);
    box-shadow: 0 1px 0 rgba(26,111,181,0.06), 0 4px 20px rgba(26,111,181,0.05);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Hamburger button ── */
  .hal-hamburger {
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid rgba(26,111,181,0.12);
    color: var(--slate, #3c4a5a);
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .hal-hamburger:hover {
    background: rgba(26,111,181,0.07);
    color: var(--sky, #1a6fb5);
    border-color: rgba(26,111,181,0.25);
  }

  /* ── Mobile logo icon ── */
  .hal-mobile-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #1a6fb5 0%, #2d8fd4 100%);
    box-shadow: 0 3px 12px rgba(26,111,181,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
  }

  /* ── Page title area ── */
  .hal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    color: var(--text, #1e2c3a);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .hal-subtitle {
    font-size: 0.7rem;
    color: var(--gray, #6b7a8d);
    letter-spacing: 0.03em;
    margin-top: 1px;
  }

  /* ── Breadcrumb pill ── */
  .hal-breadcrumb {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.85rem;
    border-radius: 30px;
    background: rgba(26,111,181,0.07);
    border: 1px solid rgba(26,111,181,0.12);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--sky, #1a6fb5);
    letter-spacing: 0.03em;
  }
  .hal-breadcrumb-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--sky, #1a6fb5);
    opacity: 0.5;
  }

  /* ── Right side ── */
  .hal-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* ── Notification dot badge ── */
  .hal-notif-btn {
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid rgba(26,111,181,0.12);
    color: var(--slate, #3c4a5a);
    cursor: pointer;
    position: relative;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .hal-notif-btn:hover { background: rgba(26,111,181,0.07); color: var(--sky, #1a6fb5); }
  .hal-notif-badge {
    position: absolute;
    top: 7px; right: 7px;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #ef4444;
    border: 1.5px solid white;
    animation: hal-pulse 2s ease-in-out infinite;
  }
  @keyframes hal-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%       { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
  }

  /* ── Divider line ── */
  .hal-vdivider {
    width: 1px; height: 28px;
    background: rgba(26,111,181,0.12);
    flex-shrink: 0;
  }

  /* ── User chip ── */
  .hal-user-chip {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.35rem 0.85rem 0.35rem 0.35rem;
    border-radius: 30px;
    background: var(--light, #f5f8fb);
    border: 1px solid rgba(26,111,181,0.12);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .hal-user-chip:hover {
    background: rgba(26,111,181,0.05);
    border-color: rgba(26,111,181,0.22);
  }
  .hal-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0e4a80, #2d8fd4);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(26,111,181,0.3);
  }
  .hal-user-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text, #1e2c3a);
  }
  .hal-user-role {
    font-size: 0.68rem;
    color: var(--sky, #1a6fb5);
    font-weight: 500;
  }

  /* ── Logout button ── */
  .hal-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(220,38,38,0.2);
    color: #dc2626;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .hal-logout-btn:hover {
    background: rgba(220,38,38,0.06);
    border-color: rgba(220,38,38,0.35);
    transform: translateY(-1px);
  }

  /* ── Mobile overlay ── */
  .hal-overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(14,74,128,0.35);
    backdrop-filter: blur(3px);
  }
`;

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('school_id');
    localStorage.removeItem('school_name');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('school_id');
    sessionStorage.removeItem('school_name');
    window.dispatchEvent(new Event('localStorageUpdate'));
    navigate('/');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LAYOUT_STYLES }} />

      <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--light, #f5f8fb)', alignItems: 'flex-start', margin: 0, padding: 0 }}>

        {/* ── Overlay when sidebar is open ──────────────────────────────── */}
        {sidebarOpen && (
          <div className="hal-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar with slide animation ──────────────────────────────── */}
        <div
          style={{ 
            flexShrink: 0, 
            margin: 0, 
            padding: 0, 
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 50,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* ── Main column ───────────────────────────────────────────────── */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          minWidth: 0,
          marginLeft: sidebarOpen ? '256px' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}>

          {/* ══ TOP HEADER ══════════════════════════════════════════════ */}
          <header className="hal-header">

            {/* Hamburger — only show when sidebar is closed */}
            {!sidebarOpen && (
              <button
                className="hal-hamburger"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FaBars style={{ fontSize: '0.9rem' }} />
              </button>
            )}

            {/* Mobile logo — show when sidebar is closed */}
            {!sidebarOpen && (
              <div className="hal-mobile-icon">
                <FaGraduationCap style={{ color: 'white', fontSize: '1.05rem' }} />
              </div>
            )}

            {/* Title + breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
              <div>
                <div className="hal-title">Admin Dashboard</div>
                <div className="hal-subtitle hidden sm:block">School Management System</div>
              </div>

              {/* Breadcrumb pill — desktop only */}
              <div className="hal-breadcrumb hidden md:inline-flex">
                <div className="hal-breadcrumb-dot" />
                EduShield
                <span style={{ color: 'rgba(26,111,181,0.35)', margin: '0 2px' }}>/</span>
                Admin
              </div>
            </div>

            {/* ── Right controls ── */}
            <div className="hal-right">

              {/* User chip — desktop - clickable to go to profile */}
              <button
                onClick={() => navigate('/admin/profile')}
                className="hal-user-chip hidden sm:flex"
                title="View Profile"
              >
                <div className="hal-avatar">AD</div>
                <div className="hidden md:block">
                  <div className="hal-user-name">Admin</div>
                  <div className="hal-user-role">Super Admin</div>
                </div>
              </button>

              <div className="hal-vdivider hidden sm:block" />

              {/* Logout */}
              <button className="hal-logout-btn" onClick={handleLogout} title="Logout">
                <FaSignOutAlt style={{ fontSize: '0.8rem' }} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* ── Page content ──────────────────────────────────────────── */}
          <main style={{ flex: 1, overflowY: 'auto' }}>
            <Outlet />
          </main>

        </div>
      </div>
    </>
  );
}

export default AdminLayout;
