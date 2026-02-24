// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUsers, FaChalkboardTeacher, FaBook, FaCalendar, FaEye, FaUserTie } from "react-icons/fa";
// import apiService from "../../services/apiService";

// export default function MyClassesPage() {
//   const navigate = useNavigate();
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     loadMyClasses();
//   }, []);

//   const loadMyClasses = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const result = await apiService.getMyClasses();
//       if (result.success) {
//         setClasses(result.classes || []);
//       } else {
//         setError(result.error || 'Failed to load classes');
//       }
//     } catch (err) {
//       console.error('Load classes error:', err);
//       setError(err.message || 'Failed to load classes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   const inchargeClasses = classes.filter(c => c.role === 'incharge' || c.role === 'both');
//   const subjectTeacherClasses = classes.filter(c => c.role === 'subject_teacher' || c.role === 'both');

//   const getRoleBadge = (role) => {
//     if (role === 'both') {
//       return (
//         <div className="flex flex-wrap gap-1">
//           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
//             <FaUserTie className="mr-1" /> Class Incharge
//           </span>
//           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
//             <FaBook className="mr-1" /> Subject Teacher
//           </span>
//         </div>
//       );
//     }
    
//     if (role === 'incharge') {
//       return (
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
//           <FaUserTie className="mr-1" /> Class Incharge
//         </span>
//       );
//     }
    
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
//         <FaBook className="mr-1" /> Subject Teacher
//       </span>
//     );
//   };

//   const getAttendanceModeBadge = (mode) => {
//     return mode === 'daily' ? (
//       <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
//         Daily Attendance
//       </span>
//     ) : (
//       <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
//         Subject-wise Attendance
//       </span>
//     );
//   };

//   return (
//     <div className="px-6 py-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-semibold text-gray-900">My Classes</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage and view your assigned classes</p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Total Classes</p>
//                 <p className="text-2xl font-semibold text-gray-900">{classes.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
//                 <FaChalkboardTeacher className="text-xl text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">As Incharge</p>
//                 <p className="text-2xl font-semibold text-gray-900">{inchargeClasses.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
//                 <FaUserTie className="text-xl text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">As Subject Teacher</p>
//                 <p className="text-2xl font-semibold text-gray-900">{subjectTeacherClasses.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
//                 <FaBook className="text-xl text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Classes Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {classes.map((classItem) => (
//             <div
//               key={`${classItem.id}-${classItem.role}`}
//               className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
//             >
//               {/* Header */}
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-sm text-gray-600">
//                       Grade {classItem.grade}{classItem.section ? ` - Section ${classItem.section}` : ''}
//                     </span>
//                   </div>
//                   <div className="mt-2">
//                     {getRoleBadge(classItem.role)}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => navigate(`/students?class=${classItem.id}`)}
//                   className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                   title="View Students"
//                 >
//                   <FaEye />
//                 </button>
//               </div>

//               {/* Details */}
//               <div className="space-y-3">
//                 {/* Academic Year */}
//                 <div className="flex items-center justify-between py-2 border-t border-gray-100">
//                   <div className="flex items-center gap-2">
//                     <FaCalendar className="text-sm text-gray-400" />
//                     <span className="text-sm text-gray-600">Academic Year</span>
//                   </div>
//                   <span className="text-sm font-medium text-gray-900">{classItem.academicYear}</span>
//                 </div>

//                 {/* Attendance Mode */}
//                 <div className="flex items-center justify-between py-2 border-t border-gray-100">
//                   <span className="text-sm text-gray-600">Attendance Mode</span>
//                   {getAttendanceModeBadge(classItem.attendanceMode)}
//                 </div>

//                 {/* Subjects (for subject teachers or both) */}
//                 {(classItem.role === 'subject_teacher' || classItem.role === 'both') && classItem.subjects && classItem.subjects.length > 0 && (
//                   <div className="py-2 border-t border-gray-100">
//                     <span className="text-sm text-gray-600 block mb-2">Teaching Subjects:</span>
//                     <div className="flex flex-wrap gap-1">
//                       {classItem.subjects.map((subject) => (
//                         <span
//                           key={subject.id}
//                           className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs"
//                         >
//                           {subject.name}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Role Description */}
//                 <div className="py-2 border-t border-gray-100">
//                   <p className="text-xs text-gray-500">
//                     {classItem.role === 'incharge' 
//                       ? 'You are the class incharge. You can manage students and mark attendance.'
//                       : classItem.role === 'both'
//                       ? 'You are the class incharge and also teach subjects in this class.'
//                       : 'You teach specific subjects in this class. You can mark attendance for your subjects.'}
//                   </p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="mt-4 flex gap-2">
//                 {(classItem.role === 'incharge' || classItem.role === 'both') && (
//                   <button
//                     onClick={() => navigate(`/add-student?class=${classItem.id}`)}
//                     className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     Add Students
//                   </button>
//                 )}
//                 <button
//                   onClick={() => navigate(`/data-entry?class=${classItem.id}`)}
//                   className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   Mark Attendance
//                 </button>
//                 <button
//                   onClick={() => navigate(`/students?class=${classItem.id}`)}
//                   className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   View Students
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {classes.length === 0 && (
//           <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
//             <FaChalkboardTeacher className="mx-auto text-4xl text-gray-300 mb-3" />
//             <p className="text-gray-600">No classes assigned yet</p>
//             <p className="text-sm text-gray-500 mt-1">Contact your administrator to get classes assigned</p>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }










import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaBook, FaCalendar, FaEye, FaUserTie, FaArrowRight, FaPlus, FaClock } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function MyClassesPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyClasses();
  }, []);

  const loadMyClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getMyClasses();
      if (result.success) {
        setClasses(result.classes || []);
      } else {
        setError(result.error || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Load classes error:', err);
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: "70px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--light)" }}>
        <div style={{ 
          animation: "spin 1s linear infinite", 
          width: "48px", 
          height: "48px", 
          border: "4px solid rgba(26, 111, 181, 0.2)", 
          borderTop: "4px solid var(--sky)", 
          borderRadius: "50%" 
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: "70px", minHeight: "100vh", background: "var(--light)", paddingLeft: "4%", paddingRight: "4%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "2rem" }}>
          <div style={{
            background: "rgba(239, 68, 68, 0.06)",
            border: "1px solid rgba(239, 68, 68, 0.12)",
            borderRadius: "12px",
            padding: "1rem",
            color: "#991b1b",
            fontFamily: "var(--font-body)"
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  const inchargeClasses = classes.filter(c => c.role === 'incharge' || c.role === 'both');
  const subjectTeacherClasses = classes.filter(c => c.role === 'subject_teacher' || c.role === 'both');

  const getRoleBadge = (role) => {
    if (role === 'both') {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.7rem",
            borderRadius: "6px",
            fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
            fontWeight: "600",
            background: "rgba(26, 111, 181, 0.08)",
            color: "var(--sky)",
            border: "1px solid rgba(26, 111, 181, 0.12)",
            fontFamily: "var(--font-body)"
          }}>
            <FaUserTie /> Incharge
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.7rem",
            borderRadius: "6px",
            fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
            fontWeight: "600",
            background: "rgba(139, 92, 246, 0.08)",
            color: "#8b5cf6",
            border: "1px solid rgba(139, 92, 246, 0.12)",
            fontFamily: "var(--font-body)"
          }}>
            <FaBook /> Subject Teacher
          </span>
        </div>
      );
    }
    
    if (role === 'incharge') {
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.35rem 0.7rem",
          borderRadius: "6px",
          fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
          fontWeight: "600",
          background: "rgba(26, 111, 181, 0.08)",
          color: "var(--sky)",
          border: "1px solid rgba(26, 111, 181, 0.12)",
          fontFamily: "var(--font-body)"
        }}>
          <FaUserTie /> Incharge
        </span>
      );
    }
    
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.35rem 0.7rem",
        borderRadius: "6px",
        fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
        fontWeight: "600",
        background: "rgba(139, 92, 246, 0.08)",
        color: "#8b5cf6",
        border: "1px solid rgba(139, 92, 246, 0.12)",
        fontFamily: "var(--font-body)"
      }}>
        <FaBook /> Subject Teacher
      </span>
    );
  };

  const getAttendanceModeBadge = (mode) => {
    return mode === 'daily' ? (
      <span style={{
        fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
        background: "rgba(16, 185, 129, 0.08)",
        color: "#10b981",
        padding: "0.35rem 0.7rem",
        borderRadius: "6px",
        fontFamily: "var(--font-body)",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        border: "1px solid rgba(16, 185, 129, 0.12)"
      }}>
        <FaClock style={{ fontSize: "0.7rem" }} /> Daily
      </span>
    ) : (
      <span style={{
        fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
        background: "rgba(245, 158, 11, 0.08)",
        color: "#f59e0b",
        padding: "0.35rem 0.7rem",
        borderRadius: "6px",
        fontFamily: "var(--font-body)",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        border: "1px solid rgba(245, 158, 11, 0.12)"
      }}>
        <FaBook style={{ fontSize: "0.7rem" }} /> Subject-wise
      </span>
    );
  };

  return (
    <div style={{ paddingTop: "70px", minHeight: "100vh", background: "var(--light)" }}>
      {/* Header Section */}
      <div style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", paddingLeft: "4%", paddingRight: "4%" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 5vw, 2.25rem)", fontWeight: "600", color: "var(--text)", margin: 0 }}>
            My Classes
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.875rem, 2.5vw, 1rem)", color: "var(--gray)", marginTop: "0.25rem", margin: 0 }}>
            Manage and view your assigned classes
          </p>
        </div>
      </div>

      {/* Summary Cards - Responsive */}
      <div style={{ paddingLeft: "4%", paddingRight: "4%", paddingBottom: "1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(160px, 45vw, 250px), 1fr))",
            gap: "clamp(0.75rem, 2vw, 1.5rem)"
          }}>
            <StatCard title="Total Classes" value={classes.length} icon={<FaChalkboardTeacher />} color="sky" />
            <StatCard title="As Incharge" value={inchargeClasses.length} icon={<FaUserTie />} color="green" />
            <StatCard title="As Subject Teacher" value={subjectTeacherClasses.length} icon={<FaBook />} color="purple" />
          </div>
        </div>
      </div>

      {/* Classes Grid - Responsive */}
      <div style={{ paddingLeft: "4%", paddingRight: "4%", paddingBottom: "2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {classes.length === 0 ? (
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(26, 111, 181, 0.12)",
              borderRadius: "16px",
              padding: "clamp(2rem, 5vw, 3rem)",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(26, 111, 181, 0.08)"
            }}>
              <FaChalkboardTeacher style={{ fontSize: "clamp(2.5rem, 8vw, 3rem)", color: "rgba(26, 111, 181, 0.15)", marginBottom: "1rem", margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--gray)", margin: 0, fontWeight: "500" }}>
                No classes assigned yet
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--gray)", marginTop: "0.5rem", margin: 0 }}>
                Contact your administrator to get classes assigned
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px, 45vw, 350px), 1fr))",
              gap: "clamp(1rem, 2vw, 1.5rem)"
            }}>
              {classes.map((classItem) => (
                <ClassCard
                  key={`${classItem.id}-${classItem.role}`}
                  classItem={classItem}
                  getRoleBadge={getRoleBadge}
                  getAttendanceModeBadge={getAttendanceModeBadge}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorConfigs = {
    sky: { bg: "rgba(26, 111, 181, 0.06)", icon: "var(--sky)", border: "rgba(26, 111, 181, 0.12)" },
    green: { bg: "rgba(16, 185, 129, 0.06)", icon: "#10b981", border: "rgba(16, 185, 129, 0.12)" },
    purple: { bg: "rgba(139, 92, 246, 0.06)", icon: "#8b5cf6", border: "rgba(139, 92, 246, 0.12)" },
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

function ClassCard({ classItem, getRoleBadge, getAttendanceModeBadge, navigate }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid rgba(26, 111, 181, 0.12)",
        borderRadius: "16px",
        padding: "clamp(1rem, 3vw, 1.5rem)",
        transition: "all 0.25s ease",
        boxShadow: "0 2px 8px rgba(26, 111, 181, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(26, 111, 181, 0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(26, 111, 181, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.12)";
      }}
    >
      {/* Top border accent */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, var(--sky), var(--sky-light))",
        opacity: 0
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div style={{ minWidth: "0" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(0.95rem, 3vw, 1.125rem)", fontWeight: "600", color: "var(--text)", margin: 0, marginBottom: "0.25rem" }}>
            {classItem.name}
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: "var(--gray)", margin: 0 }}>
            Grade {classItem.grade}{classItem.section ? ` • Section ${classItem.section}` : ''}
          </p>
        </div>
        <button
          onClick={() => navigate(`/students?class=${classItem.id}`)}
          style={{
            padding: "0.5rem",
            background: "rgba(26, 111, 181, 0.08)",
            border: "1px solid rgba(26, 111, 181, 0.12)",
            borderRadius: "8px",
            color: "var(--sky)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.9rem",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(26, 111, 181, 0.12)";
            e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(26, 111, 181, 0.08)";
            e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.12)";
          }}
          title="View Students"
        >
          <FaEye />
        </button>
      </div>

      {/* Role Badge */}
      <div>
        {getRoleBadge(classItem.role)}
      </div>

      {/* Details Section */}
      <div style={{ borderTop: "1px solid rgba(26, 111, 181, 0.12)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Academic Year */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "0" }}>
            <FaCalendar style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: "var(--gray)", flexShrink: 0 }} />
            <span style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: "var(--gray)", fontFamily: "var(--font-body)" }}>Academic Year</span>
          </div>
          <span style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", fontWeight: "600", color: "var(--text)", fontFamily: "var(--font-body)" }}>
            {classItem.academicYear}
          </span>
        </div>

        {/* Attendance Mode */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: "var(--gray)", fontFamily: "var(--font-body)" }}>Attendance</span>
          {getAttendanceModeBadge(classItem.attendanceMode)}
        </div>

        {/* Subjects */}
        {(classItem.role === 'subject_teacher' || classItem.role === 'both') && classItem.subjects && classItem.subjects.length > 0 && (
          <div>
            <span style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)", color: "var(--gray)", fontFamily: "var(--font-body)", display: "block", marginBottom: "0.5rem" }}>
              Teaching:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {classItem.subjects.slice(0, 3).map((subject) => (
                <span
                  key={subject.id}
                  style={{
                    display: "inline-block",
                    background: "rgba(139, 92, 246, 0.08)",
                    color: "#8b5cf6",
                    padding: "clamp(0.25rem, 1vw, 0.3rem) clamp(0.4rem, 1.5vw, 0.5rem)",
                    borderRadius: "6px",
                    fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
                    fontFamily: "var(--font-body)",
                    fontWeight: "600",
                    border: "1px solid rgba(139, 92, 246, 0.12)"
                  }}
                >
                  {subject.name}
                </span>
              ))}
              {classItem.subjects.length > 3 && (
                <span style={{
                  display: "inline-block",
                  color: "var(--gray)",
                  fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
                  fontFamily: "var(--font-body)",
                  fontWeight: "600"
                }}>
                  +{classItem.subjects.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ borderTop: "1px solid rgba(26, 111, 181, 0.12)", paddingTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(classItem.role === 'incharge' || classItem.role === 'both') && (
          <button
            onClick={() => navigate(`/add-student?class=${classItem.id}`)}
            style={{
              flex: 1,
              minWidth: "100px",
              padding: "clamp(0.5rem, 1.5vw, 0.65rem)",
              fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
              fontWeight: "600",
              color: "var(--gray)",
              background: "rgba(26, 111, 181, 0.05)",
              border: "1px solid rgba(26, 111, 181, 0.12)",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(26, 111, 181, 0.1)";
              e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26, 111, 181, 0.05)";
              e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.12)";
            }}
          >
            <FaPlus style={{ fontSize: "0.6rem" }} /> Add
          </button>
        )}
        <button
          onClick={() => navigate(`/data-entry?class=${classItem.id}`)}
          style={{
            flex: 1,
            minWidth: "100px",
            padding: "clamp(0.5rem, 1.5vw, 0.65rem)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
            fontWeight: "600",
            color: "var(--gray)",
            background: "rgba(26, 111, 181, 0.05)",
            border: "1px solid rgba(26, 111, 181, 0.12)",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(26, 111, 181, 0.1)";
            e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(26, 111, 181, 0.05)";
            e.currentTarget.style.borderColor = "rgba(26, 111, 181, 0.12)";
          }}
        >
          Mark
        </button>
        <button
          onClick={() => navigate(`/students?class=${classItem.id}`)}
          style={{
            flex: 1,
            minWidth: "100px",
            padding: "clamp(0.5rem, 1.5vw, 0.65rem)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
            fontWeight: "600",
            color: "white",
            background: "var(--sky)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--sky-deep)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(26, 111, 181, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--sky)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          View <FaArrowRight style={{ fontSize: "0.6rem" }} />
        </button>
      </div>
    </div>
  );
}