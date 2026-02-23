import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  AlertCircle, 
  UserCheck, 
  Activity, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  BarChart3,
  UserPlus,
  BookPlus,
  Settings
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

/* ── Dashboard-scoped Horizon styles ───────────────────────────────────── */
const DASHBOARD_STYLES = `
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
  .hd-stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,111,181,0.12); }
  .hd-stat-card:hover::after { transform: translate(10px, 10px); opacity: 0.1; }

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

  /* ── Trend badge ── */
  .hd-trend {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 30px;
    font-size: 0.72rem;
    font-weight: 700;
  }
  .hd-trend-up   { background: rgba(16,185,129,0.1);  color: #10b981; }
  .hd-trend-down { background: rgba(239,68,68,0.1);   color: #ef4444; }

  /* ── Icon circle ── */
  .hd-icon-box {
    width: 46px; height: 46px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Quick action card ── */
  .hd-action-card {
    background: var(--white);
    border: 1px solid rgba(26,111,181,0.1);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    position: relative;
    overflow: hidden;
  }
  .hd-action-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
    transition: opacity 0.22s ease;
    opacity: 0;
  }
  .hd-action-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(26,111,181,0.12);
  }
  .hd-action-card:hover::before { opacity: 1; }

  /* ── Alert row ── */
  .hd-alert-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0.9rem;
    border-radius: 10px;
    background: var(--light);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }
  .hd-alert-row:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(26,111,181,0.08);
  }

  /* ── Activity item ── */
  .hd-activity-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    background: var(--light);
    transition: background 0.2s ease;
  }
  .hd-activity-item:hover { background: rgba(26,111,181,0.06); }

  /* ── Status row ── */
  .hd-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
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
  .hd-header-strip::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1.2' fill='%23ffffff' fill-opacity='0.06'/%3E%3C/svg%3E");
  }
  .hd-header-strip::after {
    content: '';
    position: absolute;
    bottom: -30px; right: -30px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }

  /* ── Risk badge ── */
  .hd-risk-high   { background: rgba(239,68,68,0.1);  color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
  .hd-risk-medium { background: rgba(240,165,0,0.1);  color: #d97706; border: 1px solid rgba(240,165,0,0.25); }
  .hd-risk-low    { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.25);}

  /* ── Chart card ── */
  .hd-chart-card {
    background: var(--white);
    border: 1px solid rgba(26,111,181,0.1);
    border-radius: 16px;
    padding: 1.4rem;
  }

  /* ── Divider ── */
  .hd-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(26,111,181,0.1), transparent);
    margin: 1rem 0;
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

  /* ── Full-width button ── */
  .hd-btn-full {
    width: 100%;
    margin-top: 1rem;
    background: linear-gradient(135deg, var(--sky-deep), var(--sky));
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .hd-btn-full:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── Spinner ── */
  @keyframes hd-spin { to { transform: rotate(360deg); } }
  .hd-spinner {
    width: 48px; height: 48px;
    border: 3px solid rgba(26,111,181,0.15);
    border-top-color: var(--sky);
    border-radius: 50%;
    animation: hd-spin 0.8s linear infinite;
  }

  /* ── Avatar circle ── */
  .hd-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--sky-deep), var(--sky-light));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-weight: 700;
    font-size: 0.85rem;
    color: white;
    box-shadow: 0 2px 8px rgba(26,111,181,0.3);
  }

  /* ── Scrollbar ── */
  .hd-scroll::-webkit-scrollbar { width: 4px; }
  .hd-scroll::-webkit-scrollbar-track { background: transparent; }
  .hd-scroll::-webkit-scrollbar-thumb { background: rgba(26,111,181,0.2); border-radius: 99px; }

  /* ── Fade in ── */
  @keyframes hd-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hd-fade { animation: hd-fadeUp 0.5s ease both; }
  .hd-fade-1 { animation-delay: 0.05s; }
  .hd-fade-2 { animation-delay: 0.1s; }
  .hd-fade-3 { animation-delay: 0.15s; }
  .hd-fade-4 { animation-delay: 0.2s; }
  .hd-fade-5 { animation-delay: 0.25s; }
`;

/* ── Sub-components ─────────────────────────────────────────────────────── */

const StatCard = ({ title, value, icon: Icon, color, bgColor, trend, trendValue, delay = '' }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  return (
    <div className={`hd-stat-card hd-fade ${delay}`} style={{ '--blob-color': color }}>
      {/* top-right blob */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '100px', height: '100px', borderRadius: '50%',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        transform: 'translate(30px,-30px)',
        pointerEvents: 'none'
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div className="hd-icon-box" style={{ background: bgColor }}>
          <Icon size={22} style={{ color }} />
        </div>
        {trendValue && (
          <span className={`hd-trend ${isPositive ? 'hd-trend-up' : 'hd-trend-down'}`}>
            <TrendIcon size={11} />
            {trendValue}%
          </span>
        )}
      </div>
      <div className="hd-stat-num" style={{ color }}>{value}</div>
      <div className="hd-stat-label">{title}</div>
    </div>
  );
};

const QuickActionCard = ({ icon: Icon, title, description, onClick, color, bgColor, borderColor }) => (
  <div
    className="hd-action-card"
    onClick={onClick}
    style={{ '--action-color': color }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = borderColor;
      e.currentTarget.querySelector('.hd-action-left-bar').style.opacity = '1';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(26,111,181,0.1)';
      e.currentTarget.querySelector('.hd-action-left-bar').style.opacity = '0';
    }}
  >
    <div className="hd-action-left-bar" style={{
      position: 'absolute', left: 0, top: 0, bottom: 0,
      width: '3px', background: color, borderRadius: '3px 0 0 3px',
      opacity: 0, transition: 'opacity 0.22s ease'
    }} />
    <div className="hd-icon-box" style={{ background: bgColor, width: '42px', height: '42px', borderRadius: '10px' }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--gray)' }}>{description}</div>
    </div>
    <ArrowRight size={15} style={{ color: 'var(--gray)', flexShrink: 0 }} />
  </div>
);

const ActivityItem = ({ icon: Icon, title, description, time, color, bgColor }) => (
  <div className="hd-activity-item">
    <div className="hd-icon-box" style={{ background: bgColor, width: '34px', height: '34px', borderRadius: '8px' }}>
      <Icon size={15} style={{ color }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.835rem', fontWeight: 500, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '2px' }}>{description}</div>
    </div>
    <span style={{ fontSize: '0.72rem', color: 'var(--gray)', flexShrink: 0 }}>{time}</span>
  </div>
);

/* ── Main Component ─────────────────────────────────────────────────────── */
export const AdminDashboard = () => {
  const { stats, riskDistribution, riskTrendData, alerts, teachers, classes, loading } = useAdmin();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--light)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="hd-spinner" style={{ margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray)', fontFamily: 'var(--font-body)' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const pendingTeachers = teachers.filter(t => t.status === 'pending').length;
  const approvedTeachers = teachers.filter(t => t.status === 'approved').length;
  const activeClasses = classes.filter(c => c.status === 'active').length;
  const totalStudentsInClasses = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  const recentActivities = [
    { icon: UserPlus,      title: 'New Teacher Request',  description: 'Dr. Anjali Sharma requested access',   time: '2h ago',  color: 'var(--sky)',     bgColor: 'rgba(26,111,181,0.1)'  },
    { icon: CheckCircle,   title: 'Class Created',        description: 'Grade 10-A has been created',           time: '5h ago',  color: '#10b981',        bgColor: 'rgba(16,185,129,0.1)'  },
    { icon: AlertTriangle, title: 'High Risk Alert',      description: '3 students flagged as high risk',       time: '1d ago',  color: '#ef4444',        bgColor: 'rgba(239,68,68,0.1)'   },
    { icon: FileText,      title: 'Exam Template Added',  description: 'Mid-term exam template created',        time: '2d ago',  color: 'var(--accent)',  bgColor: 'rgba(240,165,0,0.1)'   },
  ];

  const teacherStatusData = [
    { name: 'Approved', value: approvedTeachers, color: '#10b981' },
    { name: 'Pending',  value: pendingTeachers,  color: 'var(--accent)' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DASHBOARD_STYLES }} />

      <div className="hd-page">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* ── Hero Header Strip ─────────────────────────────────────────── */}
          <div className="hd-header-strip hd-fade">
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '0.3rem' }}>
                  Admin Panel
                </span>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: 0, lineHeight: 1.2 }}>
                  Dashboard Overview
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)' }}>
                  <Calendar size={13} />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button className="hd-btn-primary" onClick={() => navigate('/admin/analytics')}
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}>
                <BarChart3 size={15} />
                View Analytics
              </button>
            </div>
          </div>

          {/* ── Stat Cards ────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard title="Total Teachers"     value={stats?.totalTeachers    || teachers.length}         icon={UserCheck}   color="var(--sky)"    bgColor="rgba(26,111,181,0.1)"  trend="up"   trendValue="8"  delay="hd-fade-1" />
            <StatCard title="Total Classes"      value={stats?.totalClasses     || classes.length}          icon={BookOpen}    color="#10b981"       bgColor="rgba(16,185,129,0.1)"  trend="up"   trendValue="12" delay="hd-fade-2" />
            <StatCard title="Total Students"     value={stats?.totalStudents    || totalStudentsInClasses}  icon={Users}       color="#7c3aed"       bgColor="rgba(124,58,237,0.1)"  trend="up"   trendValue="5"  delay="hd-fade-3" />
            <StatCard title="High Risk Students" value={stats?.highRiskStudents || 0}                       icon={AlertCircle} color="#ef4444"       bgColor="rgba(239,68,68,0.1)"   trend="down" trendValue="15" delay="hd-fade-4" />
          </div>

          {/* ── Quick Actions ─────────────────────────────────────────────── */}
          <div className="hd-card hd-fade hd-fade-2" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span className="hd-tag">Shortcuts</span>
                <h2 className="hd-section-title" style={{ margin: 0 }}>Quick Actions</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <QuickActionCard icon={UserPlus}  title="Manage Teachers"  description={`${pendingTeachers} pending approvals`}   onClick={() => navigate('/admin/teachers')}       color="var(--sky)"    bgColor="rgba(26,111,181,0.08)"   borderColor="rgba(26,111,181,0.25)" />
              <QuickActionCard icon={BookPlus}  title="Manage Classes"   description={`${activeClasses} active classes`}         onClick={() => navigate('/admin/classes')}        color="#10b981"       bgColor="rgba(16,185,129,0.08)"   borderColor="rgba(16,185,129,0.3)"  />
              <QuickActionCard icon={FileText}  title="Exam Templates"   description="Create & manage templates"                 onClick={() => navigate('/admin/exam-templates')} color="var(--accent)" bgColor="rgba(240,165,0,0.08)"    borderColor="rgba(240,165,0,0.3)"   />
              <QuickActionCard icon={Settings}  title="School Settings"  description="Configure school details"                  onClick={() => navigate('/admin/school')}         color="#7c3aed"       bgColor="rgba(124,58,237,0.08)"   borderColor="rgba(124,58,237,0.25)" />
            </div>
          </div>

          {/* ── Charts Row ────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>

            {/* Risk Distribution */}
            {riskDistribution.length > 0 && (
              <div className="hd-chart-card hd-fade hd-fade-3">
                <span className="hd-tag">Analytics</span>
                <h3 className="hd-section-title">Student Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={riskDistribution} cx="50%" cy="50%" labelLine={false}
                      label={({ value }) => `${value}`} outerRadius={72} dataKey="value">
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} students`}
                      contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(26,111,181,0.12)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px rgba(26,111,181,0.1)' }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-body)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Teacher Status Bar */}
            <div className="hd-chart-card hd-fade hd-fade-3">
              <span className="hd-tag">Teachers</span>
              <h3 className="hd-section-title">Teacher Status</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={teacherStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,111,181,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--gray)', fontFamily: 'var(--font-body)' }} stroke="rgba(26,111,181,0.15)" />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--gray)', fontFamily: 'var(--font-body)' }} stroke="rgba(26,111,181,0.15)" />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid rgba(26,111,181,0.12)', fontFamily: 'var(--font-body)' }} />
                  <Bar dataKey="value" radius={[8,8,0,0]}>
                    {teacherStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="hd-chart-card hd-fade hd-fade-4">
              <span className="hd-tag">Activity</span>
              <h3 className="hd-section-title">Recent Activity</h3>
              <div className="hd-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
                {recentActivities.map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Alerts + System Status ────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: alerts.length > 0 ? '1fr 320px' : '1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>

            {/* High-Risk Alerts */}
            {alerts.length > 0 && (
              <div className="hd-card hd-fade hd-fade-4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="hd-icon-box" style={{ background: 'rgba(239,68,68,0.1)', width: '34px', height: '34px', borderRadius: '8px' }}>
                      <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                    </div>
                    <div>
                      <span className="hd-tag" style={{ marginBottom: 0 }}>Attention Required</span>
                      <h3 className="hd-section-title" style={{ margin: 0 }}>High-Risk Student Alerts</h3>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: '30px',
                    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.2)'
                  }}>
                    {alerts.length} students
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="hd-alert-row"
                      style={{ borderLeft: `3px solid ${alert.riskLevel === 'High' ? '#ef4444' : 'var(--accent)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                        <div className="hd-avatar">{alert.name.charAt(0)}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.855rem', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {alert.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                            <span>{alert.class}</span>
                            <span>·</span>
                            <Clock size={11} />
                            <span>{alert.lastIntervention}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span className={`hd-trend ${alert.riskLevel === 'High' ? 'hd-risk-high' : 'hd-risk-medium'}`}
                          style={{ padding: '3px 10px', borderRadius: '30px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {alert.riskLevel}
                        </span>
                        <ArrowRight size={14} style={{ color: 'var(--gray)' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="hd-btn-full" onClick={() => navigate('/admin/analytics')}>
                  View All Students <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* System Status */}
            <div className="hd-card hd-fade hd-fade-5">
              <span className="hd-tag">Infrastructure</span>
              <h3 className="hd-section-title">System Status</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Database',     status: 'Online',  color: '#10b981', bg: 'rgba(16,185,129,0.06)',  icon: CheckCircle },
                  { label: 'API Services', status: 'Active',  color: '#10b981', bg: 'rgba(16,185,129,0.06)',  icon: CheckCircle },
                  { label: 'AI Engine',    status: 'Running', color: 'var(--sky)', bg: 'rgba(26,111,181,0.06)', icon: Activity },
                ].map((s) => (
                  <div key={s.label} className="hd-status-row" style={{ background: s.bg }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <s.icon size={16} style={{ color: s.color }} />
                      <span style={{ fontSize: '0.855rem', fontWeight: 500, color: 'var(--text)' }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color }}>{s.status}</span>
                  </div>
                ))}

                {/* Pending tasks */}
                <div className="hd-status-row" style={{ background: 'rgba(240,165,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <AlertTriangle size={16} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.855rem', fontWeight: 500, color: 'var(--text)' }}>Pending Tasks</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>{pendingTeachers}</span>
                </div>

                <div className="hd-divider" />

                {/* Last backup */}
                <div style={{
                  padding: '0.75rem', borderRadius: '10px', background: 'var(--light)',
                  borderLeft: '3px solid var(--sky)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>Last Backup</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>{new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 30-Day Risk Trend ─────────────────────────────────────────── */}
          {riskTrendData.length > 0 && (
            <div className="hd-chart-card hd-fade hd-fade-5">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="hd-tag">Trend Analysis</span>
                  <h3 className="hd-section-title" style={{ margin: 0 }}>30-Day Risk Trend</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {[{ color: '#ef4444', label: 'High Risk' }, { color: 'var(--accent)', label: 'Medium Risk' }].map(l => (
                    <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: 'var(--gray)' }}>
                      <span style={{ width: '12px', height: '3px', background: l.color, borderRadius: '2px', display: 'inline-block' }} />
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={riskTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,111,181,0.07)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--gray)', fontFamily: 'var(--font-body)' }} stroke="rgba(26,111,181,0.15)" />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--gray)', fontFamily: 'var(--font-body)' }} stroke="rgba(26,111,181,0.15)" />
                  <Tooltip contentStyle={{
                    backgroundColor: 'var(--white)', border: '1px solid rgba(26,111,181,0.12)',
                    borderRadius: '10px', fontFamily: 'var(--font-body)', boxShadow: '0 8px 24px rgba(26,111,181,0.1)', fontSize: '12px'
                  }} formatter={(value) => `${value} students`} />
                  <Line type="monotone" dataKey="highRisk"   stroke="#ef4444"       strokeWidth={2.5} dot={{ fill: '#ef4444',       r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="High Risk"   />
                  <Line type="monotone" dataKey="mediumRisk" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Medium Risk" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;