import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import RiskSummaryCards from '../../components/admin/analytics/RiskSummaryCards';
import TrendPlaceholder from '../../components/admin/analytics/TrendPlaceholder';
import { FaChartLine } from 'react-icons/fa';
import { injectHorizonStyles } from '../../styles/horizonTheme';

/* ══════════════════════════════════════════════════════════════════════════
   ANALYTICS HERO SECTION STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const HERO_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .ana-hero {
    position: relative;
    background: linear-gradient(135deg, #1a5a96 0%, #1a6fb5 100%);
    padding: 2rem 3rem;
    color: white;
    border-radius: 20px;
    margin: 2rem;
    box-shadow: 0 4px 12px rgba(26, 111, 181, 0.15);
  }

  .ana-hero-content {
    position: relative;
    z-index: 2;
  }

  .ana-hero-tag {
    display: inline-block;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .ana-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .ana-hero-subtitle {
    font-size: 0.9rem;
    font-weight: 300;
    color: white;
    margin: 0;
  }
`;

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inject both Horizon theme and Hero styles on mount
  useEffect(() => {
    injectHorizonStyles();
    // Inject Hero styles
    const styleTag = document.createElement('style');
    styleTag.textContent = HERO_STYLES;
    document.head.appendChild(styleTag);
    return () => styleTag.remove();
  }, []);
  const impactSnapshots = [
    {
      label: "Attendance",
      before: 72,
      after: 84,
      unit: "%",
    },
    {
      label: "Assessment Avg",
      before: 61,
      after: 69,
      unit: "%",
    },
    {
      label: "Behavior Flags",
      before: 18,
      after: 9,
      unit: "cases",
      invert: true,
    },
  ];
  const interventionImpact = [
    {
      type: "Home Visits",
      uplift: "+12% attendance",
      students: 24,
      trend: "Up",
    },
    {
      type: "Mentoring",
      uplift: "+8% grades",
      students: 36,
      trend: "Up",
    },
    {
      type: "Counseling",
      uplift: "-30% flags",
      students: 15,
      trend: "Down",
    },
  ];

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const result = await adminService.getAnalytics();
    if (result.success) {
      setAnalytics(result.data);
    }
    setLoading(false);
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
      <div className="ana-hero">
        <div className="ana-hero-content">
          <span className="ana-hero-tag">Analytics Dashboard</span>
          <h1 className="ana-hero-title">Real-Time Analytics</h1>
          <p className="ana-hero-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="hd-container">
        {/* Quick Stats */}
        <div className="hd-grid-3 mb-8">
          {[
            {
              label: 'Students Monitored',
              value: analytics?.totalStudents || 0,
              icon: '👥',
              color: '#1a6fb5'
            },
            {
              label: 'Active Classes',
              value: analytics?.activeClasses || 0,
              icon: '📚',
              color: '#8b5cf6'
            },
            {
              label: 'Improvement Rate',
              value: `${analytics?.improvementRate || 0}%`,
              icon: '📈',
              color: '#10b981'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="hd-stat-card hd-fade"
              style={{ '--blob-color': stat.color }}
            >
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="hd-flex-between mb-3">
                  <p className="hd-text-xs hd-text-muted hd-font-semibold">{stat.label}</p>
                  <div className="hd-icon-box" style={{ background: `${stat.color}15` }}>
                    <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
                  </div>
                </div>
                <p className="hd-stat-num" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Distribution Section */}
        <div className="hd-card">
          <div className="mb-5">
            <h2 className="hd-section-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>Risk Distribution</h2>
            <p className="hd-text-muted hd-text-sm">Student risk assessment breakdown across all classes</p>
          </div>
          <RiskSummaryCards riskDistribution={analytics?.riskDistribution} />
        </div>

        {/* Attendance Trend Section */}
        <div className="hd-card">
          <div className="mb-5">
            <h2 className="hd-section-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>Attendance Trend</h2>
            <p className="hd-text-muted hd-text-sm">Weekly attendance pattern analysis</p>
          </div>
          <TrendPlaceholder
            title="7-Day Attendance Trend"
            data={analytics?.attendanceTrend}
            type="attendance"
          />
        </div>

        {/* Intervention Impact (Before / After) */}
        <div className="hd-card">
          <div className="mb-5">
            <h2 className="hd-section-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>Intervention Impact</h2>
            <p className="hd-text-muted hd-text-sm">Before/after comparison for key outcomes</p>
          </div>
          <div className="hd-grid-3 mb-5">
            {impactSnapshots.map((item) => {
              const delta = item.after - item.before;
              const positive = item.invert ? delta < 0 : delta > 0;
              return (
                <div key={item.label} className="hd-card" style={{ padding: '1rem' }}>
                  <p className="hd-text-sm hd-font-semibold mb-3">{item.label}</p>
                  <div className="hd-flex-between hd-text-xs hd-text-muted mb-1">
                    <span>Before</span>
                    <span>After</span>
                  </div>
                  <div className="hd-flex-between">
                    <span className="hd-stat-num" style={{ fontSize: '1.5rem' }}>{item.before}{item.unit}</span>
                    <span className="hd-stat-num" style={{ fontSize: '1.5rem' }}>{item.after}{item.unit}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full" style={{ background: 'rgba(26,111,181,0.1)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '8px',
                        background: positive ? '#10b981' : '#ef4444',
                        width: `${Math.min(Math.abs(delta) * 4, 100)}%`
                      }}
                    ></div>
                  </div>
                  <p className="hd-text-xs hd-font-semibold mt-2" style={{ color: positive ? '#10b981' : '#ef4444' }}>
                    {positive ? "+" : ""}{delta}{item.unit} change
                  </p>
                </div>
              );
            })}
          </div>
          <div>
            <p className="hd-text-sm hd-font-semibold mb-3">Impact by intervention type</p>
            <div className="hd-flex-col hd-gap-2">
              {interventionImpact.map((item) => (
                <div key={item.type} className="hd-alert-row">
                  <div>
                    <p className="hd-text-sm hd-font-semibold">{item.type}</p>
                    <p className="hd-text-xs hd-text-muted">Students covered: {item.students}</p>
                  </div>
                  <div className="hd-flex-between hd-gap-2">
                    <span className="hd-text-sm hd-font-semibold" style={{ color: '#1a6fb5' }}>{item.uplift}</span>
                    <span className="hd-badge" style={{
                      background: item.trend === "Up" ? 'rgba(16,185,129,0.15)' : 'rgba(240,165,0,0.15)',
                      color: item.trend === "Up" ? '#10b981' : '#d97706'
                    }}>
                      Trend {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="hd-grid-4">
          {[
            { label: 'High Risk Students', value: analytics?.riskDistribution?.high || 0, color: '#ef4444' },
            { label: 'Medium Risk', value: analytics?.riskDistribution?.medium || 0, color: '#f59e0b' },
            { label: 'Low Risk', value: analytics?.riskDistribution?.low || 0, color: '#10b981' },
            { label: 'System Health', value: '98%', color: '#1a6fb5' }
          ].map((metric, index) => (
            <div key={index} className="hd-stat-card hd-fade">
              <div style={{ position: 'relative', zIndex: 2 }}>
                <p className="hd-text-xs hd-text-muted hd-font-semibold mb-2">{metric.label}</p>
                <p className="hd-stat-num" style={{ color: metric.color }}>{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="hd-card" style={{ background: 'rgba(26,111,181,0.05)', border: '1px solid rgba(26,111,181,0.2)' }}>
          <div className="hd-flex hd-gap-2">
            <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>ℹ️</div>
            <div className="hd-flex-col">
              <p className="hd-text-sm hd-font-semibold mb-1" style={{ color: '#0e4a80' }}>About This Dashboard</p>
              <p className="hd-text-xs" style={{ color: '#1a6fb5' }}>
                These are high-level system insights providing a quick overview of system performance and student risk assessment. 
                For detailed student analytics and individual progress tracking, navigate to the Student Overview page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
