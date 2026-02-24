/* ─────────────────────────────────────────────────────────────────────────
   HORIZON THEME - Reusable Config for Admin Pages
   Complete Horizon theme system for all admin pages
   ────────────────────────────────────────────────────────────────────────── */

export const HORIZON_COLORS = {
  sky: '#1a6fb5',
  skyLight: '#2d8fd4',
  skyDeep: '#0e4a80',
  accent: '#f0a500',
  slate: '#3c4a5a',
  gray: '#6b7a8d',
  light: '#f5f8fb',
  white: '#ffffff',
  text: '#1e2c3a',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

export const HORIZON_FONTS = {
  heading: "'DM Serif Display', serif",
  body: "'DM Sans', sans-serif",
};

export const HORIZON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --sky:       #1a6fb5;
    --sky-light: #2d8fd4;
    --sky-deep:  #0e4a80;
    --accent:    #f0a500;
    --slate:     #3c4a5a;
    --gray:      #6b7a8d;
    --light:     #f5f8fb;
    --white:     #ffffff;
    --text:      #1e2c3a;
    --success:   #10b981;
    --danger:    #ef4444;
    --warning:   #f59e0b;
    --font-heading: 'DM Serif Display', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  /* ── Page background ── */
  .hd-page {
    background: var(--light);
    min-height: 100vh;
    font-family: var(--font-body);
    padding: 1.5rem;
  }

  /* ── Section title ── */
  .hd-section-title {
    font-family: var(--font-heading);
    color: var(--text);
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* ── Container ── */
  .hd-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Horizon card base ── */
  .hd-card {
    background: var(--white);
    border: 1px solid rgba(26,111,181,0.1);
    border-radius: 16px;
    padding: 1.4rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .hd-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--sky), var(--sky-light));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .hd-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(26,111,181,0.1);
    border-color: rgba(26,111,181,0.2);
  }
  .hd-card:hover::before { transform: scaleX(1); }

  /* ── Stat card special ── */
  .hd-stat-card {
    background: var(--white);
    border: 1px solid rgba(26,111,181,0.1);
    border-radius: 16px;
    padding: 1.4rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .hd-stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 80px; height: 80px;
    border-radius: 50%;
    opacity: 0.06;
    transform: translate(20px, 20px);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .hd-stat-card:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 16px 48px rgba(26,111,181,0.12); 
  }
  .hd-stat-card:hover::after { 
    transform: translate(10px, 10px); 
    opacity: 0.1; 
  }

  /* ── Stat number ── */
  .hd-stat-num {
    font-family: var(--font-heading);
    font-size: 2.4rem;
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .hd-stat-label {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--gray);
    letter-spacing: 0.01em;
  }

  /* ── Icon circle ── */
  .hd-icon-box {
    width: 46px; height: 46px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Section tag ── */
  .hd-tag {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--sky);
    margin-bottom: 0.2rem;
    display: block;
  }

  /* ── Header gradient strip ── */
  .hd-header-strip {
    background: linear-gradient(135deg, var(--sky-deep) 0%, var(--sky) 60%, var(--sky-light) 100%);
    border-radius: 16px;
    padding: 1.5rem 1.8rem;
    position: relative;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  /* ── Primary button ── */
  .hd-btn-primary {
    background: var(--sky);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.3rem;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .hd-btn-primary:hover {
    background: var(--sky-deep);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(26,111,181,0.3);
  }

  /* ── Secondary button ── */
  .hd-btn-secondary {
    background: var(--light);
    color: var(--sky);
    border: 1px solid rgba(26,111,181,0.2);
    border-radius: 8px;
    padding: 0.6rem 1.3rem;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .hd-btn-secondary:hover {
    background: rgba(26,111,181,0.05);
    border-color: rgba(26,111,181,0.3);
    transform: translateY(-1px);
  }

  /* ── Form inputs ── */
  .hd-input {
    border: 1.5px solid rgba(26,111,181,0.15);
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--text);
    background: var(--white);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
  }
  .hd-input:focus {
    outline: none;
    border-color: var(--sky);
    box-shadow: 0 0 0 3px rgba(26,111,181,0.1);
  }
  .hd-input::placeholder {
    color: var(--gray);
  }

  /* ── Label ── */
  .hd-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.35rem;
    display: block;
  }

  /* ── Spinner ── */
  @keyframes hd-spin { to { transform: rotate(360deg); } }
  .hd-spinner {
    width: 48px; height: 48px;
    border: 3px solid rgba(26,111,181,0.15);
    border-top-color: var(--sky);
    border-radius: 50%;
    animation: hd-spin 0.8s linear infinite;
  }

  /* ── Badge ── */
  .hd-badge {
    display: inline-block;
    padding: 0.4rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .hd-badge-danger {
    background: rgba(239,68,68,0.15);
    color: #ef4444;
    border: 1px solid rgba(239,68,68,0.3);
  }

  /* ── Fade animations ── */
  @keyframes hd-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hd-fade { animation: hd-fadeUp 0.5s ease both; }
  .hd-fade-1 { animation-delay: 0.05s; }
  .hd-fade-2 { animation-delay: 0.1s; }
  .hd-fade-3 { animation-delay: 0.15s; }

  /* ── Grid layouts ── */
  .hd-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
  .hd-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .hd-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }

  /* ── Flex utilities ── */
  .hd-flex { display: flex; }
  .hd-flex-center { display: flex; align-items: center; justify-content: center; }
  .hd-flex-between { display: flex; align-items: center; justify-content: space-between; }
  .hd-flex-col { display: flex; flex-direction: column; }
  .hd-gap-2 { gap: 1rem; }

  /* ── Text utilities ── */
  .hd-text-center { text-align: center; }
  .hd-text-muted { color: var(--gray); }
  .hd-text-sm { font-size: 0.875rem; }
  .hd-text-xs { font-size: 0.75rem; }
  .hd-font-semibold { font-weight: 600; }

  /* ── Section spacing ── */
  .hd-section { margin-bottom: 2rem; }
  .hd-section-header { margin-bottom: 1.5rem; }
`;

export function injectHorizonStyles(elementId = 'horizon-styles') {
  // Check if already injected
  if (document.getElementById(elementId)) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = elementId;
  styleElement.textContent = HORIZON_STYLES;
  document.head.appendChild(styleElement);
}

export default {
  HORIZON_COLORS,
  HORIZON_FONTS,
  HORIZON_STYLES,
  injectHorizonStyles,
};
