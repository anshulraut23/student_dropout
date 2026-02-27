


import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RiskBadge from "../../components/RiskBadge";
import apiService from "../../services/apiService";
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaUserPlus,
  FaClipboardList,
  FaChartLine,
  FaPlusCircle,
  FaChevronDown,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState("all");
  
  // ML Risk Statistics State
  const [mlStats, setMlStats] = useState(null);
  const [isLoadingML, setIsLoadingML] = useState(true);
  const [mlError, setMlError] = useState(null);
  
  // Classes State
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  
  // Students State
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  // Retrain State
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState(null);
  const [retrainMessageType, setRetrainMessageType] = useState(null); // 'success' or 'error'

  // Fetch all data on mount
  useEffect(() => {
    loadClasses();
    loadMLStatistics();
    loadStudents();
  }, []);
  
  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await apiService.getMyClasses();
      if (response.success && response.classes) {
        setClasses(response.classes);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };
  
  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      console.log('Loading students...');
      const response = await apiService.getStudents();
      console.log('Students response:', response);
      if (response.success && response.students) {
        setStudents(response.students);
        console.log('Loaded students:', response.students.length);
      } else {
        console.warn('No students in response:', response);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };
  
  const handleRetrainModel = async () => {
    try {
      setIsRetraining(true);
      setRetrainMessage(null);
      
      console.log('Starting model retrain...');
      const response = await apiService.retrainMLModel();
      console.log('Retrain response:', response);
      
      if (response.success) {
        setRetrainMessage('✅ AI Model successfully retrained on the latest database records!');
        setRetrainMessageType('success');
        
        // Reload ML statistics after successful retrain
        setTimeout(() => {
          loadMLStatistics();
        }, 1000);
      } else {
        // Backend returned success: false
        const errorMsg = response.message || response.error || 'Failed to retrain model';
        console.error('Retrain failed:', errorMsg);
        
        if (errorMsg.includes('not enough') || errorMsg.includes('insufficient') || errorMsg.includes('No data')) {
          setRetrainMessage('⚠️ Need more historical student data to train a new model. Please ensure you have sufficient attendance and exam records.');
        } else {
          setRetrainMessage(`⚠️ ${errorMsg}`);
        }
        setRetrainMessageType('error');
      }
    } catch (err) {
      console.error('Retrain error:', err);
      
      // Check for specific error messages
      if (err.message?.includes('not enough') || err.message?.includes('insufficient') || err.message?.includes('Insufficient training data')) {
        setRetrainMessage('⚠️ Need more historical student data to train a new model. Please ensure you have at least 50 students with 3+ days attendance and 1+ exam.');
      } else if (err.message?.includes('No students found') || err.message?.includes('No active students')) {
        setRetrainMessage('⚠️ No students found in your school. Please add students first before retraining the AI model.');
      } else if (err.message?.includes('Service Unavailable') || err.message?.includes('503')) {
        setRetrainMessage('⚠️ ML service is unavailable. Please make sure the ML service is running on port 5001.');
      } else if (err.message?.includes('connect') || err.message?.includes('ECONNREFUSED')) {
        setRetrainMessage('⚠️ Cannot connect to ML service. Please start the ML service: cd ml-service && python app.py');
      } else {
        setRetrainMessage(`⚠️ ${err.message || 'Failed to retrain model'}`);
      }
      setRetrainMessageType('error');
    } finally {
      setIsRetraining(false);
      
      // Auto-hide message after 8 seconds (longer for error messages)
      setTimeout(() => {
        setRetrainMessage(null);
      }, 8000);
    }
  };

  const loadMLStatistics = async () => {
    try {
      setIsLoadingML(true);
      setMlError(null);
      const response = await apiService.getSchoolRiskStatistics();
      setMlStats(response);
    } catch (err) {
      console.error('Failed to load ML statistics:', err);
      // Check if it's an insufficient data error
      if (err.message?.includes('Insufficient data') || err.message?.includes('No predictions')) {
        setMlError('insufficient_data');
      } else {
        setMlError(err.message || 'Failed to load risk statistics');
      }
    } finally {
      setIsLoadingML(false);
    }
  };

  // Filter students based on selected class
  const filteredStudents = useMemo(() => {
    if (selectedClass === "all") {
      return students;
    }
    return students.filter(s => s.classId === selectedClass || s.class_id === selectedClass);
  }, [selectedClass, students]);

  // Use ML stats for risk levels, but always show real student count
  const stats = useMemo(() => {
    // Always use real student count
    const totalStudents = filteredStudents.length;
    
    console.log('Stats calculation:', {
      totalStudents,
      filteredStudentsLength: filteredStudents.length,
      studentsLength: students.length,
      mlStats,
      mlError
    });
    
    if (mlStats && !mlError) {
      // Use ML risk levels if available
      return {
        total: totalStudents, // Always show real count
        high: mlStats.by_level?.high || 0,
        medium: mlStats.by_level?.medium || 0,
        low: mlStats.by_level?.low || 0,
        critical: mlStats.by_level?.critical || 0,
      };
    }
    
    // No ML data: show real student count, but no risk levels
    return {
      total: totalStudents,
      high: 0,
      medium: 0,
      low: 0,
      critical: 0,
    };
  }, [mlStats, mlError, filteredStudents, students]);

  // Get critical students from ML API
  const criticalStudents = useMemo(() => {
    if (mlStats && mlStats.critical_students && mlStats.critical_students.length > 0) {
      return mlStats.critical_students.slice(0, 10);
    }
    // No fallback - if no ML data, show empty
    return [];
  }, [mlStats]);

  // Quick actions
  const quickActions = [
    { title: t("teacher_dashboard.quick_add_attendance", "Add Attendance"), icon: FaClipboardList, color: "sky", action: () => navigate("/data-entry") },
    { title: t("teacher_dashboard.quick_add_student", "Add Student"), icon: FaUserPlus, color: "accent", action: () => navigate("/students") },
    { title: t("teacher_dashboard.quick_view_students", "View Students"), icon: FaUsers, color: "sky-light", action: () => navigate("/students") },
    { title: t("teacher_dashboard.quick_add_score", "Add Score"), icon: FaPlusCircle, color: "accent", action: () => navigate("/data-entry") },
  ];

  const colorMap = {
    sky: { bg: "rgba(26, 111, 181, 0.08)", text: "#1a6fb5", accent: "var(--sky)", border: "rgba(26, 111, 181, 0.15)" },
    "sky-light": { bg: "rgba(45, 143, 212, 0.08)", text: "#2d8fd4", accent: "#2d8fd4", border: "rgba(45, 143, 212, 0.15)" },
    accent: { bg: "rgba(240, 165, 0, 0.08)", text: "#f0a500", accent: "#f0a500", border: "rgba(240, 165, 0, 0.15)" },
  };
  
  // Check if initial data is still loading
  const isInitialLoading = loadingClasses || loadingStudents || isLoadingML;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
      <div style={{ background: "var(--light)", minHeight: "100vh", paddingTop: "70px" }}>
      {/* Header Section - Responsive */}
      <div style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", paddingLeft: "4%", paddingRight: "4%", "@media (maxWidth: 768px)": { paddingLeft: "1rem", paddingRight: "1rem" } }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            {/* Title */}
            <div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 5vw, 2.25rem)", fontWeight: "600", color: "var(--text)", margin: 0 }}>
                {t("dashboard.title", "Dashboard")}
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.875rem, 2.5vw, 1rem)", color: "var(--gray)", marginTop: "0.25rem", margin: 0 }}>
                {t("dashboard.subtitle", "Early warning overview of student dropout risk")}
              </p>
            </div>

            {/* Filter Dropdown - Responsive Width */}
            <div style={{ maxWidth: "280px", width: "100%" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "var(--text)", fontFamily: "var(--font-body)" }}>
                {t("students.select_class", "Filter by Class")}
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={loadingClasses}
                  style={{
                    width: "100%",
                    padding: "0.65rem 1rem 0.65rem 1rem",
                    paddingRight: "2.5rem",
                    border: "1.5px solid rgba(26, 111, 181, 0.15)",
                    borderRadius: "8px",
                    backgroundColor: loadingClasses ? "#f5f5f5" : "#ffffff",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    cursor: loadingClasses ? "not-allowed" : "pointer",
                    appearance: "none",
                    transition: "all 0.2s ease",
                    opacity: loadingClasses ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    if (!loadingClasses) {
                      e.target.style.borderColor = "var(--sky)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(26, 111, 181, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(26, 111, 181, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="all">{loadingClasses ? t("teacher_dashboard.loading_classes", "Loading classes...") : t("students.all_classes", "All Classes")}</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <FaChevronDown style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray)", pointerEvents: "none", fontSize: "0.9rem" }} />
              </div>
              {classes.length === 0 && !loadingClasses && (
                <p style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: "0.25rem", fontFamily: "var(--font-body)" }}>
                  {t("teacher_dashboard.no_classes_assigned", "No classes assigned to you yet")}
                </p>
              )}
            </div>

            {/* Selected Class Badge */}
            {selectedClass !== "all" && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                backgroundColor: "rgba(26, 111, 181, 0.05)",
                border: "1px solid rgba(26, 111, 181, 0.12)",
                width: "fit-content",
                fontSize: "clamp(0.75rem, 2vw, 0.875rem)"
              }}>
                <span style={{ fontWeight: "500", color: "var(--sky)", fontFamily: "var(--font-body)" }}>
                  {t("teacher_dashboard.showing", "Showing")}: {classes.find(c => c.id === selectedClass)?.name || selectedClass}
                </span>
                <button
                  onClick={() => setSelectedClass("all")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--sky)",
                    cursor: "pointer",
                    padding: "0",
                    fontSize: "0.85rem",
                    transition: "opacity 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div style={{ paddingLeft: "4%", paddingRight: "4%", paddingBottom: "1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Retrain Success/Error Message */}
          {retrainMessage && (
            <div style={{
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              backgroundColor: retrainMessageType === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${retrainMessageType === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: '500',
                color: retrainMessageType === 'success' ? '#059669' : '#d97706',
                fontFamily: 'var(--font-body)'
              }}>
                {retrainMessage}
              </p>
              <button
                onClick={() => setRetrainMessage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: retrainMessageType === 'success' ? '#059669' : '#d97706',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
          )}
          
          {/* Retrain Button */}
          {!mlError && mlStats && (
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleRetrainModel}
                disabled={isRetraining}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: isRetraining ? '#9ca3af' : 'var(--sky)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  fontFamily: 'var(--font-body)',
                  cursor: isRetraining ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isRetraining ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isRetraining) {
                    e.currentTarget.style.backgroundColor = '#1557a0';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 111, 181, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRetraining) {
                    e.currentTarget.style.backgroundColor = 'var(--sky)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isRetraining ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    <span>{t("teacher_dashboard.training_model", "Training new model...")}</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>{t("teacher_dashboard.retrain_button", "Retrain AI with Latest Data")}</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* ML Status Messages */}
          {isLoadingML ? (
            <div style={{ 
              padding: "1.25rem", 
              backgroundColor: "rgba(59, 130, 246, 0.1)", 
              border: "1.5px solid rgba(59, 130, 246, 0.25)", 
              borderRadius: "12px",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}>
              <div style={{ 
                width: "20px", 
                height: "20px", 
                border: "2px solid rgba(59, 130, 246, 0.3)",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              <p style={{ color: "#2563eb", margin: 0, fontSize: "0.9rem", fontWeight: "500" }}>
                {t("teacher_dashboard.loading_ml", "Loading ML risk predictions...")}
              </p>
            </div>
          ) : mlError === 'insufficient_data' ? (
            <div style={{ 
              padding: "1.5rem", 
              backgroundColor: "rgba(156, 163, 175, 0.08)", 
              border: "1.5px solid rgba(156, 163, 175, 0.2)", 
              borderRadius: "12px",
              marginBottom: "1rem"
            }}>
              <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                <div style={{ fontSize: "2rem", flexShrink: 0 }}>⏳</div>
                <div>
                  <p style={{ color: "#374151", margin: 0, fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", fontFamily: "var(--font-body)" }}>
                    Gathering Data for AI Predictions
                  </p>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: "0.875rem", lineHeight: "1.5", marginBottom: "0.75rem", fontFamily: "var(--font-body)" }}>
                    The AI system needs more student data to generate dropout risk predictions. Please ensure students have:
                  </p>
                  <ul style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0", marginBottom: "0.75rem", paddingLeft: "1.25rem", fontFamily: "var(--font-body)" }}>
                    <li style={{ marginBottom: "0.25rem" }}>At least <strong>3 days</strong> of marked attendance</li>
                    <li>At least <strong>1 completed exam</strong> with scores</li>
                  </ul>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: "0.875rem", fontFamily: "var(--font-body)" }}>
                    💡 Predictions will appear automatically once sufficient data is available.
                  </p>
                </div>
              </div>
            </div>
          ) : mlStats && stats.total === 0 ? (
            <div style={{ 
              padding: "2rem", 
              backgroundColor: "rgba(59, 130, 246, 0.1)", 
              border: "1px solid rgba(59, 130, 246, 0.3)", 
              borderRadius: "12px",
              marginBottom: "1.5rem",
              textAlign: "center"
            }}>
              <p style={{ color: "#2563eb", margin: 0, fontSize: "1rem", fontWeight: "500", fontFamily: "var(--font-body)" }}>
                📊 No ML predictions generated yet. Visit the Students page to generate risk predictions for your students.
              </p>
            </div>
          ) : mlError ? (
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "rgba(245, 158, 11, 0.1)", 
              border: "1px solid rgba(245, 158, 11, 0.3)", 
              borderRadius: "8px",
              marginBottom: "1rem"
            }}>
              <p style={{ color: "#f59e0b", margin: 0, fontSize: "0.9rem", fontFamily: "var(--font-body)" }}>
                ⚠️ {mlError}
              </p>
            </div>
          ) : null}
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(160px, 45vw, 250px), 1fr))", 
            gap: "clamp(0.75rem, 2vw, 1.5rem)" 
          }}>
            <StatCard title={t("dashboard.total_students", "Total Students")} value={stats.total} icon={<FaUsers />} color="sky" />
            <StatCard title={t("teacher_dashboard.critical_risk", "Critical Risk")} value={stats.critical || 0} icon={<FaExclamationTriangle />} color="red" />
            <StatCard title={t("dashboard.high_risk", "High Risk")} value={stats.high || 0} icon={<FaExclamationTriangle />} color="orange" />
            <StatCard title={t("dashboard.medium_risk", "Medium Risk")} value={stats.medium || 0} icon={<FaExclamationTriangle />} color="yellow" />
            <StatCard title={t("dashboard.low_risk", "Low Risk")} value={stats.low || 0} icon={<FaCheckCircle />} color="green" />
          </div>
        </div>
      </div>

      {/* Quick Actions - Responsive Grid */}
      <div style={{ paddingLeft: "4%", paddingRight: "4%", paddingBottom: "1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1rem, 4vw, 1.25rem)", fontWeight: "600", color: "var(--text)", marginBottom: "0.75rem", margin: 0 }}>
            {t("teacher.quick_actions", "Quick Actions")}
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 40vw, 200px), 1fr))", 
            gap: "clamp(0.75rem, 2vw, 1rem)" 
          }}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = colorMap[action.color];
              return (
                <button
                  key={index}
                  onClick={action.action}
                  style={{
                    padding: "clamp(0.75rem, 3vw, 1.25rem)",
                    borderRadius: "12px",
                    border: `1.5px solid ${colors.border}`,
                    backgroundColor: colors.bg,
                    color: colors.text,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                    fontWeight: "600",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(26, 111, 181, 0.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  <Icon style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)", color: colors.accent }} />
                  <span>{action.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Trend Chart - Coming Soon */}
      {false && ( // Hidden until we have real historical data API
      <div style={{ paddingLeft: "4%", paddingRight: "4%", paddingBottom: "1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(26, 111, 181, 0.12)",
            borderRadius: "16px",
            padding: "clamp(1rem, 4vw, 2rem)",
            boxShadow: "0 2px 8px rgba(26, 111, 181, 0.08)",
            textAlign: "center"
          }}>
            <FaChartLine style={{ fontSize: "3rem", color: "var(--gray)", opacity: 0.3, marginBottom: "1rem" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1rem, 4vw, 1.25rem)", fontWeight: "600", color: "var(--text)", margin: 0, marginBottom: "0.5rem" }}>
              Risk Analysis Trend
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: "var(--gray)", margin: 0 }}>
              Historical trend analysis coming soon
            </p>
          </div>
        </div>
      </div>
      )}

      {/* High Risk Students Table - Responsive */}
      <div style={{ paddingLeft: "4%", paddingRight: "4%", paddingBottom: "2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(26, 111, 181, 0.12)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(26, 111, 181, 0.08)"
          }}>
            {/* Header - Responsive */}
            <div style={{
              padding: "clamp(1rem, 3vw, 1.5rem) clamp(1rem, 4vw, 2rem)",
              borderBottom: "1px solid rgba(26, 111, 181, 0.12)",
              backgroundColor: "var(--light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap"
            }}>
              <div style={{ minWidth: "0" }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(0.95rem, 4vw, 1.25rem)", fontWeight: "600", color: "var(--text)", margin: 0, marginBottom: "0.25rem" }}>
                  {t("dashboard.high_risk_section_title", "Students Requiring Immediate Attention")}
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", color: "var(--gray)", margin: 0 }}>
                  {mlStats ? t("teacher_dashboard.ml_powered", "ML-powered risk predictions") : t("dashboard.high_risk_section_subtitle", "High-risk students need urgent intervention")}
                </p>
              </div>
              <button
                onClick={() => navigate("/students")}
                style={{
                  padding: "clamp(0.5rem, 2vw, 0.65rem) clamp(0.75rem, 3vw, 1.5rem)",
                  borderRadius: "8px",
                  backgroundColor: "var(--accent)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.25s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d68a00";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(240, 165, 0, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {t("dashboard.view_all_students", "View All Students")}
                <FaArrowRight style={{ fontSize: "0.8rem" }} />
              </button>
            </div>

            {/* Content */}
            {criticalStudents.length === 0 ? (
              <div style={{ padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)", textAlign: "center" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  marginBottom: "1rem"
                }}>
                  <FaCheckCircle style={{ fontSize: "2rem", color: "#10b981" }} />
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--gray)", margin: 0 }}>
                  {t("teacher_dashboard.no_critical_high", "No critical or high-risk students currently")}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--light)", borderBottom: "1px solid rgba(26, 111, 181, 0.12)" }}>
                      <th style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", textAlign: "left", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", fontWeight: "600", color: "var(--text)", fontFamily: "var(--font-body)" }}>{t("students.student_name", "Student")}</th>
                      <th style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", textAlign: "left", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", fontWeight: "600", color: "var(--text)", fontFamily: "var(--font-body)" }}>{t("students.class", "Class")}</th>
                      <th style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", textAlign: "left", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", fontWeight: "600", color: "var(--text)", fontFamily: "var(--font-body)" }}>{t("teacher_dashboard.risk_score", "Risk Score")}</th>
                      <th style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", textAlign: "left", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", fontWeight: "600", color: "var(--text)", fontFamily: "var(--font-body)" }}>{t("students.risk_level", "Risk Level")}</th>
                      <th style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", textAlign: "right", fontSize: "clamp(0.7rem, 2vw, 0.875rem)", fontWeight: "600", color: "var(--text)", fontFamily: "var(--font-body)" }}>{t("students.action", "Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalStudents.map((student, index) => {
                      // Handle both ML API format and mock data format
                      const studentId = student.student_id || student.id;
                      const studentName = student.student_name || student.name;
                      const studentClass = student.class_name || student.class;
                      const riskScore = student.risk_score ? (student.risk_score * 100).toFixed(1) : null;
                      const riskLevel = student.risk_level || student.riskLevel;
                      
                      return (
                        <tr
                          key={studentId}
                          style={{
                            borderBottom: "1px solid rgba(26, 111, 181, 0.12)",
                            backgroundColor: index % 2 === 0 ? "#ffffff" : "var(--light)",
                            transition: "background-color 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.04)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "var(--light)";
                          }}
                        >
                          <td style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", fontSize: "clamp(0.75rem, 2vw, 0.9rem)", fontWeight: "500", color: "var(--text)", fontFamily: "var(--font-body)" }}>
                            {studentName}
                          </td>
                          <td style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", fontSize: "clamp(0.75rem, 2vw, 0.9rem)", color: "var(--gray)", fontFamily: "var(--font-body)" }}>
                            {studentClass}
                          </td>
                          <td style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", fontSize: "clamp(0.75rem, 2vw, 0.9rem)", color: "var(--gray)", fontFamily: "var(--font-body)" }}>
                            {riskScore ? `${riskScore}%` : t("teacher_dashboard.na", "N/A")}
                          </td>
                          <td style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)" }}>
                            <RiskBadge level={riskLevel} />
                          </td>
                          <td style={{ padding: "clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 2rem)", textAlign: "right" }}>
                            <button
                              onClick={() => navigate(`/students/${studentId}`)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.4rem 0.75rem",
                                borderRadius: "6px",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "var(--sky)",
                                cursor: "pointer",
                                fontFamily: "var(--font-body)",
                                fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                                fontWeight: "600",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <FaEye style={{ fontSize: "0.85rem" }} />
                              {t("students.view", "View")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorConfigs = {
    sky: { bg: "rgba(26, 111, 181, 0.06)", icon: "var(--sky)", border: "rgba(26, 111, 181, 0.12)" },
    red: { bg: "rgba(239, 68, 68, 0.06)", icon: "#ef4444", border: "rgba(239, 68, 68, 0.12)" },
    orange: { bg: "rgba(249, 115, 22, 0.06)", icon: "#f97316", border: "rgba(249, 115, 22, 0.12)" },
    yellow: { bg: "rgba(245, 158, 11, 0.06)", icon: "#f59e0b", border: "rgba(245, 158, 11, 0.12)" },
    green: { bg: "rgba(16, 185, 129, 0.06)", icon: "#10b981", border: "rgba(16, 185, 129, 0.12)" },
  };

  const config = colorConfigs[color];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: `1px solid ${config.border}`,
        borderRadius: "16px",
        padding: "clamp(1rem, 3vw, 1.5rem)",
        transition: "all 0.25s ease",
        boxShadow: "0 2px 8px rgba(26, 111, 181, 0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(26, 111, 181, 0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(26, 111, 181, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div style={{ minWidth: "0" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.75rem, 2vw, 0.875rem)", fontWeight: "500", color: "var(--gray)", margin: 0, marginBottom: "0.5rem" }}>
            {title}
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "700", color: "var(--text)", margin: 0 }}>
            {value}
          </p>
        </div>
        <div
          style={{
            width: "clamp(40px, 10vw, 48px)",
            height: "clamp(40px, 10vw, 48px)",
            borderRadius: "12px",
            backgroundColor: config.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "clamp(1rem, 3vw, 1.5rem)",
            color: config.icon,
            flexShrink: 0
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}