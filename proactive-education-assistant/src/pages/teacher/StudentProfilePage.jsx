// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import apiService from "../../services/apiService";
// import {
//   FaArrowLeft,
//   FaDownload,
//   FaUser,
//   FaCalendarCheck,
//   FaChartBar,
//   FaUserCheck,
//   FaHandsHelping,
//   FaPlus,
// } from "react-icons/fa";

// export default function StudentProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("overview");
  
//   // Data for different tabs
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [scoresData, setScoresData] = useState([]);
//   const [behaviorData, setBehaviorData] = useState([]);
//   const [interventionsData, setInterventionsData] = useState([]);
//   const [loadingData, setLoadingData] = useState(false);

//   useEffect(() => {
//     loadStudentData();
//   }, [id]);

//   useEffect(() => {
//     if (student && activeTab !== "overview" && activeTab !== "personal") {
//       loadTabData();
//     }
//   }, [activeTab, student]);

//   const loadStudentData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await apiService.getStudentById(id);
//       if (response.success) {
//         setStudent(response.student);
//       } else {
//         setError(response.error || 'Failed to load student');
//       }
//     } catch (err) {
//       console.error('Error loading student:', err);
//       setError(err.message || 'Failed to load student');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadTabData = async () => {
//     if (!student) return;
    
//     setLoadingData(true);
//     try {
//       switch (activeTab) {
//         case "attendance":
//           await loadAttendanceHistory();
//           break;
//         case "scores":
//           await loadScoresHistory();
//           break;
//         case "behavior":
//           await loadBehaviorHistory();
//           break;
//         case "interventions":
//           await loadInterventionsHistory();
//           break;
//       }
//     } catch (error) {
//       console.error(`Error loading ${activeTab} data:`, error);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const loadAttendanceHistory = async () => {
//     try {
//       const response = await apiService.getStudentAttendance(id);
//       if (response.success) {
//         setAttendanceData(response.attendance || []);
//       }
//     } catch (error) {
//       console.error('Error loading attendance:', error);
//       setAttendanceData([]);
//     }
//   };

//   const loadScoresHistory = async () => {
//     try {
//       const response = await apiService.getMarksByStudent(id);
//       if (response.success) {
//         setScoresData(response.marks || []);
//       }
//     } catch (error) {
//       console.error('Error loading scores:', error);
//       setScoresData([]);
//     }
//   };

//   const loadBehaviorHistory = async () => {
//     try {
//       const response = await apiService.getBehavioursByStudent(id);
//       if (response.success) {
//         setBehaviorData(response.behaviors || []);
//       }
//     } catch (error) {
//       console.error('Error loading behavior:', error);
//       setBehaviorData([]);
//     }
//   };

//   const loadInterventionsHistory = async () => {
//     try {
//       const response = await apiService.getInterventionsByStudent(id);
//       if (response.success) {
//         setInterventionsData(response.interventions || []);
//       }
//     } catch (error) {
//       console.error('Error loading interventions:', error);
//       setInterventionsData([]);
//     }
//   };

//   const calculateAttendanceStats = () => {
//     if (attendanceData.length === 0) return { total: 0, present: 0, absent: 0, percentage: 0 };
    
//     const present = attendanceData.filter(a => a.status === 'present').length;
//     const absent = attendanceData.filter(a => a.status === 'absent').length;
//     const percentage = ((present / attendanceData.length) * 100).toFixed(1);
    
//     return { total: attendanceData.length, present, absent, percentage };
//   };

//   const calculateScoreStats = () => {
//     if (scoresData.length === 0) return { total: 0, avgPercentage: 0, passed: 0, failed: 0 };
    
//     const validScores = scoresData.filter(s => s.status === 'present' && s.percentage != null);
//     if (validScores.length === 0) return { total: 0, avgPercentage: 0, passed: 0, failed: 0 };
    
//     const avgPercentage = (validScores.reduce((sum, s) => sum + s.percentage, 0) / validScores.length).toFixed(1);
//     const passed = validScores.filter(s => s.percentage >= 40).length; // Assuming 40% is passing
//     const failed = validScores.filter(s => s.percentage < 40).length;
    
//     return { total: validScores.length, avgPercentage, passed, failed };
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-slate-500">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//         Loading student...
//       </div>
//     );
//   }

//   if (error || !student) {
//     return (
//       <div className="p-10 text-center">
//         <div className="text-red-500 mb-4">
//           {error || 'Student not found'}
//         </div>
//         <button
//           onClick={() => navigate('/students')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Back to Students
//         </button>
//       </div>
//     );
//   }

//   const attendanceStats = calculateAttendanceStats();
//   const scoreStats = calculateScoreStats();

//   return (
//     <div className="px-6 py-6 bg-slate-100 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* Back */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
//         >
//           <FaArrowLeft /> Back
//         </button>

//         {/* HEADER CARD */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//           <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">

//             <div className="flex gap-4 items-center">
//               <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
//                 {(student.firstName?.charAt(0) || '?')}{(student.lastName?.charAt(0) || '')}
//               </div>

//               <div>
//                 <h1 className="text-2xl font-semibold text-slate-900">
//                   {student.firstName} {student.lastName}
//                 </h1>
//                 <p className="text-sm text-slate-500">
//                   {student.className || 'N/A'} • Enrollment: {student.enrollmentNo || student.id}
//                 </p>
//                 <div className="mt-2 flex gap-2">
//                   <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
//                     {student.status || 'Active'}
//                   </span>
//                   {attendanceStats.percentage > 0 && (
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       attendanceStats.percentage >= 75 ? 'bg-green-100 text-green-800' :
//                       attendanceStats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {attendanceStats.percentage}% Attendance
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <button className="px-4 py-2 border border-slate-200 rounded-md text-sm flex items-center gap-2 hover:bg-slate-50">
//               <FaDownload /> Download Report
//             </button>

//           </div>
//         </div>

//         {/* TABS */}
//         <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//           <div className="flex border-b border-slate-200 text-sm overflow-x-auto">
//             {[
//               { key: "overview", label: "Overview", icon: FaUser },
//               { key: "personal", label: "Personal", icon: FaUser },
//               { key: "attendance", label: "Attendance", icon: FaCalendarCheck },
//               { key: "scores", label: "Scores", icon: FaChartBar },
//               { key: "behavior", label: "Behavior", icon: FaUserCheck },
//               { key: "interventions", label: "Interventions", icon: FaHandsHelping }
//             ].map(tab => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`px-5 py-3 font-medium transition flex items-center gap-2 whitespace-nowrap ${
//                     activeTab === tab.key
//                       ? "border-b-2 border-blue-600 text-blue-600"
//                       : "text-slate-500 hover:text-slate-800"
//                   }`}
//                 >
//                   <Icon className="text-sm" />
//                   {tab.label}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="p-6">

//             {/* OVERVIEW TAB */}
//             {activeTab === "overview" && (
//               <div className="space-y-6">

//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

//                   <StatCard
//                     title="Status"
//                     value={student.status || 'Active'}
//                     color="text-blue-600"
//                   />

//                   <StatCard
//                     title="Class"
//                     value={student.className || 'N/A'}
//                     color="text-green-600"
//                   />

//                   <StatCard
//                     title="Attendance"
//                     value={`${attendanceStats.percentage}%`}
//                     color={attendanceStats.percentage >= 75 ? "text-green-600" : "text-red-600"}
//                   />

//                   <StatCard
//                     title="Avg Score"
//                     value={scoreStats.avgPercentage > 0 ? `${scoreStats.avgPercentage}%` : 'N/A'}
//                     color="text-purple-600"
//                   />

//                 </div>

//                 {/* Student Information */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-slate-700 mb-3">
//                     Student Information
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <InfoBox label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'} />
//                     <InfoBox label="Gender" value={student.gender || 'N/A'} />
//                     <InfoBox label="Parent Name" value={student.parentName || 'N/A'} />
//                     <InfoBox label="Parent Contact" value={student.parentContact || 'N/A'} />
//                     <InfoBox label="Email" value={student.email || 'N/A'} />
//                     <InfoBox label="Address" value={student.address || 'N/A'} />
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-slate-700 mb-3">
//                     Quick Statistics
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <p className="text-xs text-blue-600 font-medium">Attendance Records</p>
//                       <p className="text-2xl font-bold text-blue-900 mt-1">{attendanceStats.total}</p>
//                       <p className="text-xs text-blue-600 mt-1">
//                         {attendanceStats.present} Present • {attendanceStats.absent} Absent
//                       </p>
//                     </div>
//                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                       <p className="text-xs text-purple-600 font-medium">Exam Scores</p>
//                       <p className="text-2xl font-bold text-purple-900 mt-1">{scoreStats.total}</p>
//                       <p className="text-xs text-purple-600 mt-1">
//                         {scoreStats.passed} Passed • {scoreStats.failed} Failed
//                       </p>
//                     </div>
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                       <p className="text-xs text-green-600 font-medium">Behavior Records</p>
//                       <p className="text-2xl font-bold text-green-900 mt-1">{behaviorData.length}</p>
//                       <p className="text-xs text-green-600 mt-1">Total observations</p>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             )}

//             {/* PERSONAL TAB */}
//             {activeTab === "personal" && (
//               <div className="grid sm:grid-cols-2 gap-4 text-sm">

//                 <InfoBox label="Full Name" value={`${student.firstName} ${student.lastName}`} />
//                 <InfoBox label="Class" value={student.className || 'N/A'} />
//                 <InfoBox label="Enrollment Number" value={student.enrollmentNo || 'N/A'} />
//                 <InfoBox label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'} />
//                 <InfoBox label="Gender" value={student.gender || 'N/A'} />
//                 <InfoBox label="Status" value={student.status || 'Active'} />
//                 <InfoBox label="Parent Name" value={student.parentName || 'N/A'} />
//                 <InfoBox label="Parent Contact" value={student.parentContact || 'N/A'} />
//                 <InfoBox label="Email" value={student.email || 'N/A'} />
//                 <InfoBox label="Address" value={student.address || 'N/A'} />

//               </div>
//             )}

//             {/* ATTENDANCE TAB */}
//             {activeTab === "attendance" && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-slate-700">
//                     Attendance History
//                   </h3>
//                   <div className="text-sm text-slate-600">
//                     Total: {attendanceStats.total} | Present: {attendanceStats.present} | Absent: {attendanceStats.absent}
//                   </div>
//                 </div>

//                 {loadingData ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   </div>
//                 ) : attendanceData.length === 0 ? (
//                   <div className="text-center py-8 text-slate-500">
//                     No attendance records found
//                   </div>
//                 ) : (
//                   <div className="border border-slate-200 rounded-lg overflow-hidden">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-50">
//                         <tr>
//                           <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
//                           <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Subject</th>
//                           <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y">
//                         {attendanceData.slice(0, 50).map((record, idx) => (
//                           <tr key={idx} className="hover:bg-slate-50">
//                             <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
//                             <td className="px-4 py-3">{record.subjectName || 'Daily'}</td>
//                             <td className="px-4 py-3 text-center">
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 record.status === 'present' ? 'bg-green-100 text-green-700' :
//                                 record.status === 'absent' ? 'bg-red-100 text-red-700' :
//                                 record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
//                                 'bg-gray-100 text-gray-700'
//                               }`}>
//                                 {record.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* SCORES TAB */}
//             {activeTab === "scores" && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-slate-700">
//                     Exam Scores
//                   </h3>
//                   <div className="text-sm text-slate-600">
//                     Average: {scoreStats.avgPercentage}%
//                   </div>
//                 </div>

//                 {loadingData ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   </div>
//                 ) : scoresData.length === 0 ? (
//                   <div className="text-center py-8 text-slate-500">
//                     No exam scores found
//                   </div>
//                 ) : (
//                   <div className="border border-slate-200 rounded-lg overflow-hidden">
//                     <table className="w-full text-sm">
//                       <thead className="bg-slate-50">
//                         <tr>
//                           <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Exam</th>
//                           <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Subject</th>
//                           <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Marks</th>
//                           <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Percentage</th>
//                           <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Grade</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y">
//                         {scoresData.map((record, idx) => (
//                           <tr key={idx} className="hover:bg-slate-50">
//                             <td className="px-4 py-3">{record.examName || 'N/A'}</td>
//                             <td className="px-4 py-3">{record.subjectName || 'N/A'}</td>
//                             <td className="px-4 py-3 text-center">
//                               {record.status === 'present' ? `${record.marksObtained}/${record.totalMarks}` : '-'}
//                             </td>
//                             <td className="px-4 py-3 text-center">
//                               {record.status === 'present' ? (
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   record.percentage >= 75 ? 'bg-green-100 text-green-700' :
//                                   record.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
//                                   record.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
//                                   'bg-red-100 text-red-700'
//                                 }`}>
//                                   {record.percentage}%
//                                 </span>
//                               ) : '-'}
//                             </td>
//                             <td className="px-4 py-3 text-center">{record.grade || '-'}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* BEHAVIOR TAB */}
//             {activeTab === "behavior" && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-slate-700">
//                     Behavior Records
//                   </h3>
//                   <button
//                     onClick={() => navigate('/data-entry')}
//                     className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs flex items-center gap-1 hover:bg-blue-700"
//                   >
//                     <FaPlus className="text-xs" /> Add Record
//                   </button>
//                 </div>

//                 {loadingData ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   </div>
//                 ) : behaviorData.length === 0 ? (
//                   <div className="text-center py-8 text-slate-500">
//                     No behavior records found
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {behaviorData.map((record, idx) => (
//                       <div key={idx} className="border border-slate-200 rounded-lg p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <div className="flex gap-2">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               record.behaviorType === 'positive' ? 'bg-green-100 text-green-700' :
//                               'bg-red-100 text-red-700'
//                             }`}>
//                               {record.behaviorType}
//                             </span>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               record.severity === 'high' ? 'bg-red-100 text-red-700' :
//                               record.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                               'bg-green-100 text-green-700'
//                             }`}>
//                               {record.severity}
//                             </span>
//                           </div>
//                           <span className="text-xs text-slate-500">
//                             {new Date(record.date).toLocaleDateString()}
//                           </span>
//                         </div>
//                         <p className="text-sm font-medium text-slate-900 mb-1">{record.category}</p>
//                         <p className="text-sm text-slate-600">{record.description}</p>
//                         {record.actionTaken && (
//                           <p className="text-xs text-slate-500 mt-2">
//                             <strong>Action:</strong> {record.actionTaken}
//                           </p>
//                         )}
//                         <p className="text-xs text-slate-400 mt-2">
//                           By: {record.teacherName || 'Unknown'}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* INTERVENTIONS TAB */}
//             {activeTab === "interventions" && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-slate-700">
//                     Intervention Plans
//                   </h3>
//                   <button
//                     onClick={() => navigate('/data-entry')}
//                     className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs flex items-center gap-1 hover:bg-blue-700"
//                   >
//                     <FaPlus className="text-xs" /> Add Intervention
//                   </button>
//                 </div>

//                 {loadingData ? (
//                   <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   </div>
//                 ) : interventionsData.length === 0 ? (
//                   <div className="text-center py-8 text-slate-500">
//                     No intervention plans found
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {interventionsData.map((record, idx) => (
//                       <div key={idx} className="border border-slate-200 rounded-lg p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h4 className="text-sm font-semibold text-slate-900">{record.title}</h4>
//                           <div className="flex gap-2">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               record.priority === 'urgent' ? 'bg-red-100 text-red-700' :
//                               record.priority === 'high' ? 'bg-orange-100 text-orange-700' :
//                               record.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
//                               'bg-green-100 text-green-700'
//                             }`}>
//                               {record.priority}
//                             </span>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               record.status === 'completed' ? 'bg-green-100 text-green-700' :
//                               record.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
//                               'bg-gray-100 text-gray-700'
//                             }`}>
//                               {record.status}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-xs text-slate-500 mb-2">{record.interventionType}</p>
//                         <p className="text-sm text-slate-600 mb-2">{record.description}</p>
//                         {record.actionPlan && (
//                           <div className="bg-slate-50 rounded p-2 mb-2">
//                             <p className="text-xs font-medium text-slate-700">Action Plan:</p>
//                             <p className="text-xs text-slate-600">{record.actionPlan}</p>
//                           </div>
//                         )}
//                         <div className="flex justify-between text-xs text-slate-500">
//                           <span>Start: {new Date(record.startDate).toLocaleDateString()}</span>
//                           {record.targetDate && (
//                             <span>Target: {new Date(record.targetDate).toLocaleDateString()}</span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ---------------- Small Components ---------------- */

// function StatCard({ title, value, color }) {
//   return (
//     <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
//       <p className="text-xs text-slate-500 mb-1">{title}</p>
//       <p className={`text-2xl font-semibold ${color}`}>{value}</p>
//     </div>
//   );
// }

// function InfoBox({ label, value }) {
//   return (
//     <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
//       <p className="text-xs text-slate-500">{label}</p>
//       <p className="font-medium text-slate-900">{value}</p>
//     </div>
//   );
// }








import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import { FaArrowLeft, FaDownload, FaUser, FaCalendarCheck, FaChartBar, FaUserCheck, FaHandsHelping, FaPlus, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { StudentRiskCard } from "../../components/risk";

const HORIZON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --primary-blue: #1a6fb5;
    --gray: #6b7a8d;
    --light-bg: #f5f8fb;
    --white: #ffffff;
    --text-dark: #1e2c3a;
    --font-heading: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  * { box-sizing: border-box; }

  .horizon-input {
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    font-family: var(--font-body);
  }

  .tab-button {
    transition: all 0.25s ease;
  }
  .tab-button.active {
    border-bottom: 2px solid var(--primary-blue);
    color: var(--primary-blue);
  }
`;

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [scoresData, setScoresData] = useState([]);
  const [behaviorData, setBehaviorData] = useState([]);
  const [interventionsData, setInterventionsData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [riskError, setRiskError] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, [id]);

  useEffect(() => {
    // Load overview data when student is loaded
    if (student) {
      loadAttendanceHistory();
      loadScoresHistory();
      loadBehaviorHistory();
    }
  }, [student]);

  useEffect(() => {
    if (student && activeTab !== "overview" && activeTab !== "personal") {
      if (activeTab === "risk") {
        loadRiskData();
      } else {
        loadTabData();
      }
    }
  }, [activeTab, student]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getStudentById(id);
      if (response.success) {
        setStudent(response.student);
      } else {
        setError(response.error || 'Failed to load student');
      }
    } catch (err) {
      console.error('Error loading student:', err);
      setError(err.message || 'Failed to load student');
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async () => {
    if (!student) return;
    
    setLoadingData(true);
    try {
      switch (activeTab) {
        case "attendance":
          await loadAttendanceHistory();
          break;
        case "scores":
          await loadScoresHistory();
          break;
        case "behavior":
          await loadBehaviorHistory();
          break;
        case "interventions":
          await loadInterventionsHistory();
          break;
      }
    } catch (error) {
      console.error(`Error loading ${activeTab} data:`, error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadAttendanceHistory = async () => {
    try {
      const response = await apiService.getStudentAttendance(id);
      if (response.success) setAttendanceData(response.attendance || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
      setAttendanceData([]);
    }
  };

  const loadScoresHistory = async () => {
    try {
      const response = await apiService.getMarksByStudent(id);
      if (response.success) setScoresData(response.marks || []);
    } catch (error) {
      console.error('Error loading scores:', error);
      setScoresData([]);
    }
  };

  const loadBehaviorHistory = async () => {
    try {
      const response = await apiService.getBehavioursByStudent(id);
      if (response.success) setBehaviorData(response.behaviors || []);
    } catch (error) {
      console.error('Error loading behavior:', error);
      setBehaviorData([]);
    }
  };

  const loadInterventionsHistory = async () => {
    try {
      const response = await apiService.getInterventionsByStudent(id);
      if (response.success) setInterventionsData(response.interventions || []);
    } catch (error) {
      console.error('Error loading interventions:', error);
      setInterventionsData([]);
    }
  };

  const loadRiskData = async () => {
    setLoadingRisk(true);
    setRiskError(null);
    try {
      const response = await apiService.getStudentRiskPrediction(id);
      if (response.success) {
        setRiskData(response);
      } else {
        setRiskError(response.error || 'Failed to load risk prediction');
      }
    } catch (error) {
      console.error('Error loading risk data:', error);
      // Check if it's an insufficient data error (400)
      if (error.message?.includes('Insufficient data') || error.message?.includes('data_tier')) {
        // Set a special flag for insufficient data - don't treat as error
        setRiskData({ insufficientData: true });
        setRiskError(null);
      } else {
        setRiskError(error.message || 'Failed to load risk prediction');
      }
    } finally {
      setLoadingRisk(false);
    }
  };

  const calculateAttendanceStats = () => {
    if (attendanceData.length === 0) return { total: 0, present: 0, absent: 0, percentage: 0 };
    const present = attendanceData.filter(a => a.status === 'present').length;
    const absent = attendanceData.filter(a => a.status === 'absent').length;
    const percentage = ((present / attendanceData.length) * 100).toFixed(1);
    return { total: attendanceData.length, present, absent, percentage };
  };

  const calculateScoreStats = () => {
    if (scoresData.length === 0) return { total: 0, avgPercentage: 0, passed: 0, failed: 0 };
    const validScores = scoresData.filter(s => s.status === 'present' && s.percentage != null);
    if (validScores.length === 0) return { total: 0, avgPercentage: 0, passed: 0, failed: 0 };
    
    const avgPercentage = (validScores.reduce((sum, s) => sum + s.percentage, 0) / validScores.length).toFixed(1);
    const passed = validScores.filter(s => s.percentage >= 40).length;
    const failed = validScores.filter(s => s.percentage < 40).length;
    
    return { total: validScores.length, avgPercentage, passed, failed };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f5f8fb]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl mx-auto mb-3" style={{ color: 'var(--primary-blue)' }} />
          <p className="text-sm" style={{ color: 'var(--gray)' }}>Loading student...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f5f8fb]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
          <button
            onClick={() => navigate('/students')}
            className="px-6 py-2 rounded-lg font-semibold text-white" 
            style={{ background: 'var(--primary-blue)' }}
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const attendanceStats = calculateAttendanceStats();
  const scoreStats = calculateScoreStats();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f8fb]">
        <div className="pt-24 md:pt-20 px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold transition-all hover:-translate-x-0.5"
              style={{ color: 'var(--primary-blue)' }}
            >
              <FaArrowLeft /> Back
            </button>

            {/* Header Card */}
            <div className="rounded-lg border p-6 md:p-8" style={{ background: 'var(--white)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
              <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
                <div className="flex gap-6 items-start">
                  <div
                    className="h-20 w-20 rounded-lg flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                    style={{ background: 'var(--primary-blue)' }}
                  >
                    {(student.firstName?.charAt(0) || '?')}{(student.lastName?.charAt(0) || '')}
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
                      {student.firstName} {student.lastName}
                    </h1>
                    <p className="text-sm mb-3" style={{ color: 'var(--gray)' }}>
                      {student.className || 'N/A'} • Enrollment: {student.enrollmentNo || student.id}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--primary-blue)' }}>
                        {student.status || 'Active'}
                      </span>
                      {attendanceStats.percentage > 0 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          attendanceStats.percentage >= 75 ? 'bg-green-100 text-green-700' :
                          attendanceStats.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {attendanceStats.percentage}% Attendance
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="px-6 py-2.5 text-sm font-semibold rounded-lg border transition-all hover:-translate-y-0.5"
                  style={{ borderColor: 'rgba(26, 111, 181, 0.2)', color: 'var(--primary-blue)' }}
                >
                  <FaDownload className="inline mr-2" /> Report
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-lg border overflow-hidden" style={{ background: 'var(--white)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
              <div className="flex border-b overflow-x-auto" style={{ borderColor: 'rgba(26, 111, 181, 0.08)' }}>
                {[
                  { key: "overview", label: "Overview", icon: FaUser },
                  { key: "personal", label: "Personal", icon: FaUser },
                  { key: "attendance", label: "Attendance", icon: FaCalendarCheck },
                  { key: "scores", label: "Scores", icon: FaChartBar },
                  { key: "behavior", label: "Behavior", icon: FaUserCheck },
                  { key: "interventions", label: "Interventions", icon: FaHandsHelping },
                  { key: "risk", label: "Risk Analysis", icon: FaExclamationTriangle }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`tab-button px-6 py-4 text-sm font-semibold flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.key ? 'active' : ''
                      }`}
                      style={{ color: activeTab === tab.key ? 'var(--primary-blue)' : 'var(--gray)' }}
                    >
                      <Icon className="text-sm" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-6 md:p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard title="Status" value={student.status || 'Active'} />
                      <StatCard title="Class" value={student.className || 'N/A'} />
                      <StatCard title="Attendance" value={`${attendanceStats.percentage}%`} />
                      <StatCard title="Avg Score" value={scoreStats.avgPercentage > 0 ? `${scoreStats.avgPercentage}%` : 'N/A'} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>Student Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoBox label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'} />
                        <InfoBox label="Gender" value={student.gender || 'N/A'} />
                        <InfoBox label="Parent Name" value={student.fatherName || student.motherName || 'N/A'} />
                        <InfoBox label="Parent Contact" value={student.contactNumber || 'N/A'} />
                        <InfoBox label="Email" value={student.email || 'N/A'} />
                        <InfoBox label="Address" value={student.address || 'N/A'} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>Quick Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <QuickStat title="Attendance Records" value={attendanceStats.total} subtitle={`${attendanceStats.present} Present • ${attendanceStats.absent} Absent`} color="blue" />
                        <QuickStat title="Exam Scores" value={scoreStats.total} subtitle={`${scoreStats.passed} Passed • ${scoreStats.failed} Failed`} color="purple" />
                        <QuickStat title="Behavior Records" value={behaviorData.length} subtitle="Total observations" color="green" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Tab */}
                {activeTab === "personal" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoBox label="Full Name" value={student.name || 'N/A'} />
                    <InfoBox label="Class" value={student.className || 'N/A'} />
                    <InfoBox label="Enrollment Number" value={student.enrollmentNo || 'N/A'} />
                    <InfoBox label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'} />
                    <InfoBox label="Gender" value={student.gender || 'N/A'} />
                    <InfoBox label="Status" value={student.status || 'Active'} />
                    <InfoBox label="Parent Name" value={student.fatherName || student.motherName || 'N/A'} />
                    <InfoBox label="Parent Contact" value={student.contactNumber || 'N/A'} />
                    <InfoBox label="Email" value={student.email || 'N/A'} />
                    <InfoBox label="Address" value={student.address || 'N/A'} />
                  </div>
                )}

                {/* Attendance Tab */}
                {activeTab === "attendance" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Attendance History</h3>
                      <div className="text-sm" style={{ color: 'var(--gray)' }}>
                        Total: {attendanceStats.total} | Present: {attendanceStats.present} | Absent: {attendanceStats.absent}
                      </div>
                    </div>

                    {loadingData ? (
                      <div className="text-center py-12">
                        <FaSpinner className="animate-spin text-3xl mx-auto" style={{ color: 'var(--primary-blue)' }} />
                      </div>
                    ) : attendanceData.length === 0 ? (
                      <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
                        No attendance records found
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                        <table className="w-full text-sm">
                          <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                            <tr>
                              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Date</th>
                              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Subject</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceData.slice(0, 50).map((record, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)' }}>
                                <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>{new Date(record.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>{record.subjectName || 'Daily'}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    record.status === 'present' ? 'bg-green-100 text-green-700' :
                                    record.status === 'absent' ? 'bg-red-100 text-red-700' :
                                    record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Scores Tab */}
                {activeTab === "scores" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Exam Scores</h3>
                      <div className="text-sm" style={{ color: 'var(--gray)' }}>
                        Average: {scoreStats.avgPercentage}%
                      </div>
                    </div>

                    {loadingData ? (
                      <div className="text-center py-12">
                        <FaSpinner className="animate-spin text-3xl mx-auto" style={{ color: 'var(--primary-blue)' }} />
                      </div>
                    ) : scoresData.length === 0 ? (
                      <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
                        No exam scores found
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                        <table className="w-full text-sm">
                          <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                            <tr>
                              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Exam</th>
                              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Subject</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Marks</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>%</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scoresData.map((record, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)' }}>
                                <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>{record.examName || 'N/A'}</td>
                                <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>{record.subjectName || 'N/A'}</td>
                                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-dark)' }}>
                                  {record.status === 'present' ? `${record.marksObtained}/${record.totalMarks}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {record.status === 'present' ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      record.percentage >= 75 ? 'bg-green-100 text-green-700' :
                                      record.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                                      record.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {record.percentage}%
                                    </span>
                                  ) : '-'}
                                </td>
                                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-dark)' }}>{record.grade || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Behavior Tab */}
                {activeTab === "behavior" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Behavior Records</h3>
                      <button
                        onClick={() => navigate('/data-entry')}
                        className="px-3 py-1.5 text-white rounded-lg text-xs flex items-center gap-1 font-semibold transition-all hover:-translate-y-0.5"
                        style={{ background: 'var(--primary-blue)' }}
                      >
                        <FaPlus className="text-xs" /> Add Record
                      </button>
                    </div>

                    {loadingData ? (
                      <div className="text-center py-12">
                        <FaSpinner className="animate-spin text-3xl mx-auto" style={{ color: 'var(--primary-blue)' }} />
                      </div>
                    ) : behaviorData.length === 0 ? (
                      <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
                        No behavior records found
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {behaviorData.map((record, idx) => (
                          <div key={idx} className="border rounded-lg p-4" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  record.behaviorType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {record.behaviorType}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  record.severity === 'high' ? 'bg-red-100 text-red-700' :
                                  record.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {record.severity}
                                </span>
                              </div>
                              <span className="text-xs" style={{ color: 'var(--gray)' }}>
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>{record.category}</p>
                            <p className="text-sm" style={{ color: 'var(--gray)' }}>{record.description}</p>
                            {record.actionTaken && (
                              <p className="text-xs mt-2" style={{ color: 'var(--gray)' }}>
                                <strong>Action:</strong> {record.actionTaken}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Interventions Tab */}
                {activeTab === "interventions" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Intervention Plans</h3>
                      <button
                        onClick={() => navigate('/data-entry')}
                        className="px-3 py-1.5 text-white rounded-lg text-xs flex items-center gap-1 font-semibold transition-all hover:-translate-y-0.5"
                        style={{ background: 'var(--primary-blue)' }}
                      >
                        <FaPlus className="text-xs" /> Add Plan
                      </button>
                    </div>

                    {loadingData ? (
                      <div className="text-center py-12">
                        <FaSpinner className="animate-spin text-3xl mx-auto" style={{ color: 'var(--primary-blue)' }} />
                      </div>
                    ) : interventionsData.length === 0 ? (
                      <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
                        No intervention plans found
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {interventionsData.map((record, idx) => (
                          <div key={idx} className="border rounded-lg p-4" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{record.title}</h4>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  record.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                  record.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                  record.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {record.priority}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  record.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  record.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {record.status}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs mb-2" style={{ color: 'var(--gray)' }}>{record.interventionType}</p>
                            <p className="text-sm" style={{ color: 'var(--text-dark)' }}>{record.description}</p>
                            {record.actionPlan && (
                              <div className="rounded p-2 mt-2" style={{ background: 'var(--light-bg)' }}>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-dark)' }}>Action Plan:</p>
                                <p className="text-xs" style={{ color: 'var(--gray)' }}>{record.actionPlan}</p>
                              </div>
                            )}
                            <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--gray)' }}>
                              <span>Start: {new Date(record.startDate).toLocaleDateString()}</span>
                              {record.targetDate && (
                                <span>Target: {new Date(record.targetDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Analysis Tab */}
                {activeTab === "risk" && (
                  <div className="space-y-4">
                    {loadingRisk ? (
                      <div className="text-center py-12">
                        <FaSpinner className="animate-spin text-3xl mx-auto" style={{ color: 'var(--primary-blue)' }} />
                        <p className="text-sm mt-3" style={{ color: 'var(--gray)' }}>Loading risk analysis...</p>
                      </div>
                    ) : riskError ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                          <FaExclamationTriangle style={{ fontSize: '2rem', color: '#ef4444' }} />
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gray)' }}>{riskError}</p>
                        <button
                          onClick={loadRiskData}
                          className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ background: 'var(--primary-blue)' }}
                        >
                          Retry
                        </button>
                      </div>
                    ) : riskData ? (
                      <StudentRiskCard data={riskData} />
                    ) : (
                      <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
                        No risk data available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-lg border p-4 text-center" style={{ background: 'var(--light-bg)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
      <p className="text-xs" style={{ color: 'var(--gray)' }}>{title}</p>
      <p className="text-2xl font-bold mt-2" style={{ color: 'var(--primary-blue)' }}>{value}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border p-4" style={{ background: 'var(--light-bg)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
      <p className="text-xs" style={{ color: 'var(--gray)' }}>{label}</p>
      <p className="font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{value}</p>
    </div>
  );
}

function QuickStat({ title, value, subtitle, color }) {
  const colors = {
    blue: { bg: 'rgba(26, 111, 181, 0.08)', border: 'rgba(26, 111, 181, 0.3)', text: 'var(--primary-blue)' },
    purple: { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.3)', text: 'rgb(168, 85, 247)' },
    green: { bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.3)', text: 'rgb(34, 197, 94)' }
  };
  const c = colors[color];
  return (
    <div className="rounded-lg border p-4" style={{ background: c.bg, borderColor: c.border }}>
      <p className="text-xs" style={{ color: 'var(--gray)' }}>{title}</p>
      <p className="text-3xl font-bold mt-2" style={{ color: c.text }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>{subtitle}</p>
    </div>
  );
}