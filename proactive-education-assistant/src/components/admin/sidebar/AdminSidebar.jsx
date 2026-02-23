import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUserTie, 
  FaChalkboard, 
  FaBook,
  FaChartBar,
  FaGraduationCap,
  FaTimes,
  FaFileAlt
} from 'react-icons/fa';

/* ── Sidebar-scoped styles ─────────────────────────────────────────────── */
const SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .hs-sidebar {
    background: linear-gradient(180deg, #0e4a80 0%, #0a3660 45%, #071f3a 100%);
    position: relative;
    overflow: hidden;
  }

  /* Radial mesh glow behind content */
  .hs-sidebar::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(ellipse at 10% 15%,  rgba(45,143,212,0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 85%,  rgba(240,165,0,0.08)  0%, transparent 50%),
      radial-gradient(ellipse at 80% 10%,  rgba(26,111,181,0.12) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }

  /* Subtle dot-grid texture */
  .hs-sidebar::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='0.8' fill='%23ffffff' fill-opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* All direct children sit above the pseudo-element layers */
  .hs-sidebar > * { position: relative; z-index: 1; }

  /* ── Logo header ─────────────────────────────────────────────────────── */
  .hs-logo-wrap {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    background: rgba(0,0,0,0.15);
  }

  .hs-logo-icon {
    width: 44px; height: 44px;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #1a6fb5 0%, #2d8fd4 100%);
    box-shadow: 0 4px 18px rgba(26,111,181,0.55), inset 0 1px 0 rgba(255,255,255,0.22);
    position: relative;
    overflow: hidden;
  }

  /* Gloss on icon */
  .hs-logo-icon::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
    border-radius: 13px 13px 0 0;
  }

  .hs-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    color: white;
    line-height: 1.15;
    letter-spacing: -0.015em;
  }

  .hs-brand-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.67rem;
    color: rgba(255,255,255,0.38);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 1px;
  }

  /* ── Section labels ──────────────────────────────────────────────────── */
  .hs-section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    padding: 0 1.1rem;
    margin: 1.2rem 0 0.35rem;
  }

  /* ── Divider ─────────────────────────────────────────────────────────── */
  .hs-divider {
    height: 1px;
    margin: 0.8rem 1rem;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.08) 30%,
      rgba(255,255,255,0.08) 70%,
      transparent 100%);
  }

  /* ── Nav item ────────────────────────────────────────────────────────── */
  .hs-nav-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.62rem 0.85rem;
    border-radius: 10px;
    margin: 2px 0.6rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.855rem;
    font-weight: 500;
    color: #ffffff !important;
    text-decoration: none !important;
    position: relative;
    overflow: hidden;
    transition: color 0.22s ease, background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
  }

  .hs-nav-item:hover {
    color: #ffffff;
    background: rgba(255,255,255,0.1);
    transform: translateX(4px);
  }

  /* Active filled state */
  .hs-nav-item.hs-active {
    background: linear-gradient(135deg, rgba(26,111,181,0.85) 0%, rgba(45,143,212,0.75) 100%);
    color: white;
    font-weight: 600;
    transform: translateX(0);
    box-shadow: 0 4px 18px rgba(26,111,181,0.3), inset 0 1px 0 rgba(255,255,255,0.13);
  }

  /* Left accent bar */
  .hs-nav-item.hs-active::before {
    content: '';
    position: absolute;
    left: 0; top: 18%; bottom: 18%;
    width: 3px;
    background: linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5));
    border-radius: 0 3px 3px 0;
  }

  /* Subtle right shimmer on active */
  .hs-nav-item.hs-active::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04));
    pointer-events: none;
  }

  /* ── Icon box ────────────────────────────────────────────────────────── */
  .hs-nav-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 0.85rem;
    transition: background 0.22s ease, color 0.22s ease;
    background: rgba(255,255,255,0.1);
    color: #ffffff;
  }

  .hs-nav-item:hover .hs-nav-icon {
    background: rgba(255,255,255,0.16);
    color: #ffffff;
  }

  .hs-nav-item.hs-active .hs-nav-icon {
    background: rgba(255,255,255,0.22);
    color: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  /* ── Footer ──────────────────────────────────────────────────────────── */
  .hs-footer {
    padding: 0.85rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.12);
  }

  .hs-footer-card {
    border-radius: 12px;
    padding: 0.8rem 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    position: relative;
    overflow: hidden;
  }

  .hs-footer-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }

  .hs-status-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
    background: #34d399;
    box-shadow: 0 0 0 3px rgba(52,211,153,0.18), 0 0 10px rgba(52,211,153,0.5);
    animation: hs-pulse 2.5s ease-in-out infinite;
  }

  @keyframes hs-pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(52,211,153,0.18), 0 0 10px rgba(52,211,153,0.4); }
    50%       { box-shadow: 0 0 0 5px rgba(52,211,153,0.1),  0 0 16px rgba(52,211,153,0.6); }
  }

  .hs-footer-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255,255,255,0.78);
    line-height: 1.2;
  }

  .hs-version-tag {
    display: inline-block;
    margin-top: 3px;
    font-size: 0.6rem;
    padding: 1px 7px;
    border-radius: 30px;
    background: rgba(26,111,181,0.25);
    color: rgba(255,255,255,0.42);
    border: 1px solid rgba(26,111,181,0.28);
    letter-spacing: 0.04em;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Mobile close ────────────────────────────────────────────────────── */
  .hs-close-btn {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.45);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
  }
  .hs-close-btn:hover {
    color: white;
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.18);
  }

  /* ── Slim scrollbar ──────────────────────────────────────────────────── */
  .hs-nav-scroll { overflow-y: auto; }
  .hs-nav-scroll::-webkit-scrollbar { width: 3px; }
  .hs-nav-scroll::-webkit-scrollbar-track { background: transparent; }
  .hs-nav-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 99px;
  }
  .hs-nav-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.2);
  }
`;

function AdminSidebar({ onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard',      label: 'Dashboard',      icon: FaChartLine  },
    { path: '/admin/teachers',       label: 'Teachers',       icon: FaUserTie    },
    { path: '/admin/classes',        label: 'Classes',        icon: FaChalkboard },
    { path: '/admin/subjects',       label: 'Subjects',       icon: FaBook       },
    { path: '/admin/exam-templates', label: 'Exam Templates', icon: FaFileAlt    },
    { path: '/admin/analytics',      label: 'Analytics',      icon: FaChartBar   },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SIDEBAR_STYLES }} />

      <aside className="hs-sidebar w-64 min-h-screen flex flex-col">

        {/* ── Logo / Header ─────────────────────────────────────────────── */}
        <div className="hs-logo-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="hs-logo-icon">
              <FaGraduationCap style={{ color: 'white', fontSize: '1.15rem', position: 'relative', zIndex: 1 }} />
            </div>
            <div>
              <div className="hs-brand-name">EduShield</div>
              <div className="hs-brand-sub">Admin Panel</div>
            </div>
          </div>

          {/* Mobile close — hidden on lg+ */}
          <button className="hs-close-btn lg:hidden" onClick={onClose} aria-label="Close menu">
            <FaTimes style={{ fontSize: '0.9rem' }} />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <nav className="hs-nav-scroll flex-1 py-3">

          <div className="hs-section-label">Overview</div>

          {/* First group: Dashboard, Teachers, Classes */}
          {menuItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`hs-nav-item${active ? ' hs-active' : ''}`}
                style={{ color: '#ffffff', textDecoration: 'none' }}
              >
                <span className="hs-nav-icon"><Icon style={{ color: '#ffffff' }} /></span>
                <span style={{ color: '#ffffff' }}>{item.label}</span>
              </Link>
            );
          })}

          <div className="hs-divider" />
          <div className="hs-section-label">Academic</div>

          {/* Second group: Subjects, Exam Templates, Analytics */}
          {menuItems.slice(3).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`hs-nav-item${active ? ' hs-active' : ''}`}
                style={{ color: '#ffffff', textDecoration: 'none' }}
              >
                <span className="hs-nav-icon"><Icon style={{ color: '#ffffff' }} /></span>
                <span style={{ color: '#ffffff' }}>{item.label}</span>
              </Link>
            );
          })}

        </nav>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="hs-footer">
          <div className="hs-footer-card">
            <div className="hs-status-dot" />
            <div>
              <div className="hs-footer-name">School Management</div>
              <span className="hs-version-tag">Version 1.0.0</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;