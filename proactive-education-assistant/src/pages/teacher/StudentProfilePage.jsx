// import { useParams, useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import RiskBadge from "../../components/RiskBadge";
// import { useTheme } from "../../context/ThemeContext";
// import {
//   FaArrowLeft,
//   FaUser,
//   FaCalendarCheck,
//   FaChartLine,
//   FaLightbulb,
//   FaExclamationTriangle,
//   FaHome,
//   FaPhone,
//   FaBook,
//   FaClipboardList,
//   FaBrain,
//   FaComments,
// } from "react-icons/fa";
// import { useTranslation } from "react-i18next";
// import { useEffect, useState } from "react";
// import { translateText } from "../../utils/googleTranslate";

// export default function StudentProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const { darkMode } = useTheme();

//   // Find student from mock data
//   const student = students.find((s) => s.id === parseInt(id));

//   // If student not found
//   if (!student) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
//         <div className="text-center">
//           <FaUser className="mx-auto text-7xl text-gray-300 dark:text-gray-600 mb-4" />
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('teacher.student_not_found')}</h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{t('teacher.student_not_found_desc')}</p>
//           <button
//             onClick={() => navigate("/students")}
//             className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
//           >
//             <FaArrowLeft />
//             {t('teacher.back_to_students')}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Mock data for this student
//   const riskExplanation = getRiskExplanation(student);
//   const [riskText, setRiskText] = useState(riskExplanation);

//   useEffect(() => {
//     let isMounted = true;
//     const run = async () => {
//       const lng = i18n.language || 'en';
//       if (lng !== 'en') {
//         const translated = await translateText(riskExplanation, lng, 'en');
//         if (isMounted) setRiskText(translated);
//       } else {
//         if (isMounted) setRiskText(riskExplanation);
//       }
//     };
//     run();
//     return () => { isMounted = false; };
//   }, [riskExplanation, i18n.language]);
//   const attendanceTrend = getAttendanceTrend(student);
//   const academicPerformance = getAcademicPerformance(student);
//   const suggestedInterventions = getSuggestedInterventions(student);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         {/* 1️⃣ Page Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate("/students")}
//             className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold mb-4 transition-colors transform hover:translate-x-1"
//           >
//             <FaArrowLeft />
//             {t('teacher.back_to_students')}
//           </button>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
//             🎓 {t('teacher.student_profile_title')}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 font-medium">{t('teacher.student_profile_subtitle')}</p>
//         </div>

//         {/* 2️⃣ Student Basic Information Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
//           <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 relative">
//             <div className="absolute inset-0 opacity-20 bg-pattern" style={{
//               backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
//             }}></div>
//           </div>

//           <div className="relative px-6 pb-6">
//             <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-20 mb-6">
//               <div className="flex items-end gap-4">
//                 <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800 transform transition-all duration-300 hover:scale-105">
//                   {student.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="pb-2">
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
//                   <div className="flex flex-wrap items-center gap-2 mt-2">
//                     <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
//                       🎓 {student.class}
//                     </span>
//                     <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
//                       📊 {student.attendance}% {t('teacher.attendance_label')}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <RiskBadge level={student.riskLevel} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 3️⃣ Risk Explanation Section (MOST IMPORTANT) */}
//         <div
//           className={`rounded-2xl shadow-xl p-8 mb-8 border-l-4 ${
//             student.riskLevel === "high"
//               ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-500"
//               : student.riskLevel === "medium"
//               ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-500"
//               : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500"
//           }`}
//         >
//           <div className="flex items-start gap-4 mb-4">
//             <div className={`text-3xl mt-1 ${
//               student.riskLevel === "high"
//                 ? "text-red-600"
//                 : student.riskLevel === "medium"
//                 ? "text-yellow-600"
//                 : "text-green-600"
//             }`}>
//               ⚠️
//             </div>
//             <div className="flex-1">
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//                 {t('teacher.risk_analysis_title')}
//               </h3>
//               <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">{riskText}</p>
//             </div>
//           </div>
//         </div>

//         {/* 4️⃣ Attendance Trend Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <FaCalendarCheck className="text-blue-600 text-2xl" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {t('teacher.attendance_trend_title')}
//             </h3>
//           </div>
//           <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
//             {attendanceTrend.map((day, index) => (
//               <div key={index} className="text-center">
//                 <div
//                   className={`w-full h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transform transition-all duration-300 hover:scale-110 cursor-default ${
//                     day.present ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-orange-600"
//                   }`}
//                 >
//                   {day.present ? t('teacher.present_short') : t('teacher.absent_short')}
//                 </div>
//                 <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-2">{day.label}</p>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 flex items-center gap-6 text-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg"></div>
//               <span className="font-semibold text-gray-700 dark:text-gray-300">{t('teacher.present')}</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg"></div>
//               <span className="font-semibold text-gray-700 dark:text-gray-300">{t('teacher.absent')}</span>
//             </div>
//           </div>
//         </div>

//         {/* 5️⃣ Academic Performance Trend */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <FaChartLine className="text-teal-600 text-2xl" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {t('teacher.academic_overview_title')}
//             </h3>
//           </div>
//           <div className="space-y-6">
//             {academicPerformance.map((subject, index) => (
//               <div key={index}>
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{subject.name}</span>
//                   <span className="text-lg font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
//                     {subject.score}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-md">
//                   <div
//                     className={`h-3 rounded-full transition-all duration-500 ${
//                       subject.score >= 75
//                         ? "bg-gradient-to-r from-green-500 to-emerald-600"
//                         : subject.score >= 50
//                         ? "bg-gradient-to-r from-yellow-500 to-amber-600"
//                         : "bg-gradient-to-r from-red-500 to-orange-600"
//                     }`}
//                     style={{ width: `${subject.score}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 6️⃣ Suggested Interventions Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <FaLightbulb className="text-yellow-600 text-2xl" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {t('teacher.suggested_interventions_title')}
//             </h3>
//           </div>
//           <div className="space-y-4">
//             {suggestedInterventions.map((intervention, index) => (
//               <div
//                 key={index}
//                 className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:translate-x-1"
//               >
//                 <div className="text-2xl text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1">
//                   <intervention.icon />
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
//                     {intervention.title}
//                   </h4>
//                   <p className="text-sm text-gray-700 dark:text-gray-300">{intervention.description}</p>
//                 </div>
//                 <span
//                   className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${
//                     intervention.priority === "High"
//                       ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200"
//                       : intervention.priority === "Medium"
//                       ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200"
//                       : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200"
//                   }`}
//                 >
//                   {t(`teacher.priority_${intervention.priority.toLowerCase()}`)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 7️⃣ Action Buttons */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('teacher.quick_actions')}</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <button
//               onClick={() => alert(t('teacher.coming_soon_add_attendance'))}
//               className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
//             >
//               <FaCalendarCheck />
//               {t('teacher.add_attendance')}
//             </button>
//             <button
//               onClick={() => alert(t('teacher.coming_soon_add_score'))}
//               className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
//             >
//               <FaBook />
//               {t('teacher.add_academic_score')}
//             </button>
//             <button
//               onClick={() => alert(t('teacher.coming_soon_add_behaviour'))}
//               className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
//             >
//               <FaComments />
//               {t('teacher.add_behaviour')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper functions for mock data
// function getRiskExplanation(student) {
//   if (student.riskLevel === "high") {
//     return `This student is marked high-risk due to a consistent drop in attendance (${student.attendance}%) and declining academic performance over the last month. Recent observations indicate reduced classroom engagement and several missed assignments. Immediate intervention is recommended to prevent potential dropout.`;
//   } else if (student.riskLevel === "medium") {
//     return `This student shows moderate risk indicators. While attendance (${student.attendance}%) is acceptable, there are early warning signs of disengagement, including occasional absences and fluctuating academic performance. Proactive monitoring and support can help prevent escalation to high risk.`;
//   } else {
//     return `This student is currently low-risk with strong attendance (${student.attendance}%) and consistent academic performance. They demonstrate good classroom engagement and participation. Continue regular monitoring to maintain positive trajectory.`;
//   }
// }

// function getAttendanceTrend(student) {
//   // Mock attendance data - in real app, this would come from backend
//   const attendance = student.attendance;
//   const presentCount = Math.round((attendance / 100) * 8);
  
//   return Array.from({ length: 8 }, (_, i) => ({
//     present: i < presentCount,
//     label: `D${i + 1}`,
//   }));
// }

// function getAcademicPerformance(student) {
//   // Mock academic scores based on risk level
//   const baseScore = student.riskLevel === "high" ? 45 : student.riskLevel === "medium" ? 65 : 85;
  
//   return [
//     { name: "Mathematics", score: baseScore + Math.floor(Math.random() * 15) },
//     { name: "Science", score: baseScore + Math.floor(Math.random() * 15) },
//     { name: "English", score: baseScore + Math.floor(Math.random() * 15) },
//     { name: "Social Studies", score: baseScore + Math.floor(Math.random() * 15) },
//   ];
// }

// function getSuggestedInterventions(student) {
//   const baseInterventions = [
//     {
//       icon: FaHome,
//       title: "Conduct Home Visit",
//       description: "Meet with family to understand home environment and discuss concerns.",
//       priority: student.riskLevel === "high" ? "High" : "Medium",
//     },
//     {
//       icon: FaPhone,
//       title: "Engage with Parents",
//       description: "Schedule a parent-teacher meeting to align on student support strategies.",
//       priority: student.riskLevel === "high" ? "High" : "Medium",
//     },
//   ];

//   if (student.riskLevel === "high") {
//     baseInterventions.push({
//       icon: FaBook,
//       title: "Provide Learning Support",
//       description: "Arrange extra tutoring sessions or peer mentoring for struggling subjects.",
//       priority: "High",
//     });
//   }

//   baseInterventions.push({
//     icon: FaBrain,
//     title: "Monitor Attendance Closely",
//     description: "Daily check-ins and follow-up on absences within 24 hours.",
//     priority: student.riskLevel === "high" ? "High" : "Low",
//   });

//   return baseInterventions;
// }


















// import { useParams, useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import RiskBadge from "../../components/RiskBadge";
// import { FaArrowLeft } from "react-icons/fa";

// export default function StudentProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const student = students.find((s) => s.id === parseInt(id));

//   if (!student) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-100">
//         <div className="text-center">
//           <h2 className="text-lg font-semibold text-slate-700 mb-2">
//             Student not found
//           </h2>
//           <button
//             onClick={() => navigate("/students")}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             Back to students
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-6 py-6 bg-slate-100 min-h-screen">
//       <div className="max-w-5xl mx-auto space-y-6">

//         {/* Back */}
//         <button
//           onClick={() => navigate("/students")}
//           className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
//         >
//           <FaArrowLeft />
//           Back to students
//         </button>

//         {/* Header */}
//         <div className="bg-white border border-slate-200 rounded-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-semibold text-slate-900">
//                 {student.name}
//               </h1>
//               <p className="text-sm text-slate-600 mt-1">
//                 {student.class} • Attendance {student.attendance}%
//               </p>
//             </div>
//             <RiskBadge level={student.riskLevel} />
//           </div>
//         </div>

//         {/* Risk Explanation */}
//         <div className="bg-white border border-slate-200 rounded-md p-6">
//           <h2 className="text-lg font-semibold text-slate-900 mb-2">
//             Risk Analysis
//           </h2>
//           <p className="text-sm text-slate-700 leading-relaxed">
//             This student is currently classified as <strong>{student.riskLevel}</strong> risk
//             based on attendance trends and academic indicators. Continuous monitoring
//             and timely intervention are recommended.
//           </p>
//         </div>

//         {/* Academic Snapshot */}
//         <div className="bg-white border border-slate-200 rounded-md p-6">
//           <h2 className="text-lg font-semibold text-slate-900 mb-4">
//             Academic Overview
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//             <div>
//               <p className="text-slate-500">Attendance</p>
//               <p className="font-semibold text-slate-900">
//                 {student.attendance}%
//               </p>
//             </div>
//             <div>
//               <p className="text-slate-500">Class</p>
//               <p className="font-semibold text-slate-900">
//                 {student.class}
//               </p>
//             </div>
//             <div>
//               <p className="text-slate-500">Risk Level</p>
//               <RiskBadge level={student.riskLevel} />
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }














import { useParams, useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
import { FaArrowLeft, FaUserCircle, FaPlus, FaChartLine, FaExclamationTriangle, FaBrain } from "react-icons/fa";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find((s) => s.id === parseInt(id));

  if (!student) return null;

  // Mock data for enhanced visualizations
  const attendanceData = [
    { week: "Week 1", value: 90, predicted: false },
    { week: "Week 2", value: 85, predicted: false },
    { week: "Week 3", value: 70, predicted: false },
    { week: "Week 4", value: 62, predicted: false },
    { week: "Week 5", value: 58, predicted: true },
    { week: "Week 6", value: 55, predicted: true },
  ];

  const academicData = [
    { subject: "Math", current: 62, previous: 75, target: 80 },
    { subject: "English", current: 68, previous: 70, target: 75 },
    { subject: "Science", current: 65, previous: 72, target: 78 },
    { subject: "Social St.", current: 70, previous: 73, target: 80 },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        <button
          onClick={() => navigate("/students")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          <FaArrowLeft /> Back to students
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="relative">
                <FaUserCircle className="text-slate-300 text-7xl" />
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{student.name}</h1>
                <p className="text-sm text-slate-600 mt-1">
                  {student.class} • Roll No: {student.id}
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Attendance: {student.attendance}%
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    Village Area
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    📞 9XXXXXXXXX
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <RiskBadge level={student.riskLevel} />
              <div className="text-xs text-slate-500">
                Last updated: 2 hours ago
              </div>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS BANNER */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBrain className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                AI Prediction & Insights
              </h3>
              <p className="text-purple-50 text-sm leading-relaxed">
                Based on current trends, there's a <strong>78% likelihood</strong> of continued attendance decline. 
                Immediate intervention recommended within the next 5 days to prevent dropout risk.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                  Dropout Risk: High
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                  Trend: Declining
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                  Action Needed: Urgent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KEY METRICS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon="📊"
            label="Overall Performance"
            value="66%"
            trend="down"
            trendValue="-8%"
            color="orange"
          />
          <MetricCard
            icon="📅"
            label="Days Present"
            value="38/60"
            trend="down"
            trendValue="-12 days"
            color="red"
          />
          <MetricCard
            icon="📚"
            label="Avg. Score"
            value="66.25%"
            trend="down"
            trendValue="-4.5%"
            color="yellow"
          />
          <MetricCard
            icon="🎯"
            label="Interventions"
            value="2 Active"
            trend="up"
            trendValue="+1 this week"
            color="blue"
          />
        </div>

        {/* MAIN ANALYTICS */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Attendance Trend with Prediction */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" />
                  Attendance Trend & AI Prediction
                </h3>
                <div className="flex gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-slate-600">Actual</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-400 rounded border-2 border-purple-500 border-dashed"></div>
                    <span className="text-slate-600">Predicted</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Chart */}
                <div className="flex items-end justify-between h-48 gap-2 mb-2">
                  {attendanceData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      {/* Bar */}
                      <div className="relative w-full flex flex-col justify-end items-center h-full">
                        <div className="absolute bottom-0 w-full flex flex-col items-center">
                          {/* Value label */}
                          <span className={`text-xs font-semibold mb-1 ${
                            item.predicted ? 'text-purple-600' : 
                            item.value < 70 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {item.value}%
                          </span>
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t transition-all ${
                              item.predicted 
                                ? 'bg-gradient-to-t from-purple-300 to-purple-400 border-2 border-dashed border-purple-500' 
                                : item.value < 70 
                                ? 'bg-gradient-to-t from-red-400 to-red-500' 
                                : 'bg-gradient-to-t from-blue-400 to-blue-500'
                            }`}
                            style={{ height: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Label */}
                      <span className="text-xs text-slate-600 font-medium mt-2">
                        {item.week}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Threshold line */}
                <div className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400" 
                     style={{ top: '30%' }}>
                  <span className="absolute -top-2 right-0 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded">
                    Critical: 70%
                  </span>
                </div>
              </div>

              {/* Prediction Alert */}
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-900">
                  <strong>AI Forecast:</strong> If current trend continues, attendance may drop to 52% by Week 7. 
                  Recommended action: Schedule parent meeting immediately.
                </p>
              </div>
            </div>

            {/* Academic Performance Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Academic Performance Analysis</h3>
              
              <div className="space-y-4">
                {academicData.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{subject.subject}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-slate-500">Previous: {subject.previous}%</span>
                        <span className={`font-semibold ${
                          subject.current < subject.previous ? 'text-red-600' : 'text-green-600'
                        }`}>
                          Current: {subject.current}%
                        </span>
                        <span className="text-blue-600">Target: {subject.target}%</span>
                      </div>
                    </div>
                    
                    {/* Multi-bar visualization */}
                    <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                      {/* Previous score (faded) */}
                      <div 
                        className="absolute h-full bg-slate-300 opacity-40"
                        style={{ width: `${subject.previous}%` }}
                      ></div>
                      {/* Current score */}
                      <div 
                        className={`absolute h-full ${
                          subject.current < subject.previous 
                            ? 'bg-gradient-to-r from-red-400 to-red-500' 
                            : 'bg-gradient-to-r from-green-400 to-green-500'
                        }`}
                        style={{ width: `${subject.current}%` }}
                      ></div>
                      {/* Target marker */}
                      <div 
                        className="absolute h-full w-1 bg-blue-600"
                        style={{ left: `${subject.target}%` }}
                      ></div>
                      
                      {/* Percentage labels inside bars */}
                      <div className="absolute inset-0 flex items-center px-3 justify-between">
                        <span className="text-xs font-semibold text-white drop-shadow">
                          {subject.current}%
                        </span>
                        {subject.current < subject.target - 5 && (
                          <span className="text-xs text-slate-600">
                            Gap: -{subject.target - subject.current}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-900">
                  <strong>Analysis:</strong> Performance declining across all subjects. 
                  Math shows steepest drop (-13%). Consider additional tutoring support.
                </p>
              </div>
            </div>

            {/* Risk Factor Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-500" />
                Risk Factor Contribution
              </h3>
              
              <div className="space-y-4">
                <RiskFactorBar 
                  label="Attendance Impact" 
                  value={60} 
                  color="from-red-400 to-red-600"
                  description="Major concern - 38% attendance rate"
                />
                <RiskFactorBar 
                  label="Academic Decline" 
                  value={25} 
                  color="from-orange-400 to-orange-600"
                  description="Scores dropping consistently"
                />
                <RiskFactorBar 
                  label="Behavioral Factors" 
                  value={15} 
                  color="from-yellow-400 to-yellow-600"
                  description="Low participation in class"
                />
              </div>

              {/* Risk Score */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-red-900">Overall Risk Score</p>
                    <p className="text-xs text-red-700 mt-1">Calculated by AI model</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-600">82/100</p>
                    <p className="text-xs text-red-700">High Risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Actions & History */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <ActionButton text="Mark Attendance" icon="📅" variant="blue" />
                <ActionButton text="Add Test Score" icon="📝" variant="green" />
                <ActionButton text="Log Behavior" icon="💬" variant="purple" />
                <ActionButton text="Schedule Intervention" icon="🎯" variant="orange" />
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FaBrain className="text-indigo-600" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                <RecommendationItem 
                  priority="high"
                  text="Immediate home visit required"
                />
                <RecommendationItem 
                  priority="high"
                  text="Parent-teacher meeting this week"
                />
                <RecommendationItem 
                  priority="medium"
                  text="Assign peer mentor for support"
                />
                <RecommendationItem 
                  priority="medium"
                  text="Enroll in after-school tutoring"
                />
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <TimelineItem 
                  date="Today"
                  event="Absent from class"
                  type="negative"
                />
                <TimelineItem 
                  date="Yesterday"
                  event="Math test: 62%"
                  type="warning"
                />
                <TimelineItem 
                  date="2 days ago"
                  event="Parent meeting scheduled"
                  type="positive"
                />
                <TimelineItem 
                  date="3 days ago"
                  event="Absent from class"
                  type="negative"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Contact Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Parent/Guardian</p>
                  <p className="font-medium text-slate-900">Mr. Rajesh Kumar</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="font-medium text-slate-900">+91 9XXXXXXXXX</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Address</p>
                  <p className="font-medium text-slate-900">Village Area, District</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Last Contact</p>
                  <p className="font-medium text-slate-900">5 days ago</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* HISTORY SECTIONS */}
        <div className="grid md:grid-cols-2 gap-6">
          <HistoryCard 
            title="Attendance History" 
            icon="📅"
            items={[
              { text: "Jan 10 – Present", status: "positive" },
              { text: "Jan 09 – Absent", status: "negative" },
              { text: "Jan 08 – Present", status: "positive" },
              { text: "Jan 07 – Absent", status: "negative" },
              { text: "Jan 06 – Present", status: "positive" },
            ]}
          />
          <HistoryCard 
            title="Academic Scores" 
            icon="📚"
            items={[
              { text: "Math: 62% (Below avg)", status: "warning" },
              { text: "English: 68% (Average)", status: "neutral" },
              { text: "Science: 65% (Below avg)", status: "warning" },
              { text: "Social Studies: 70% (Average)", status: "neutral" },
            ]}
          />
          <HistoryCard 
            title="Behavior Notes" 
            icon="💬"
            items={[
              { text: "Low participation in class", status: "warning" },
              { text: "Frequently absent from school", status: "negative" },
              { text: "Not completing homework", status: "warning" },
              { text: "Quiet in group activities", status: "neutral" },
            ]}
          />
          <HistoryCard 
            title="Interventions" 
            icon="🎯"
            items={[
              { text: "Home visit completed - Jan 8", status: "positive" },
              { text: "Parent meeting planned - Jan 12", status: "positive" },
              { text: "Peer mentoring assigned", status: "positive" },
              { text: "Follow-up scheduled - Jan 15", status: "neutral" },
            ]}
          />
        </div>

      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MetricCard({ icon, label, value, trend, trendValue, color }) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    green: 'from-green-50 to-green-100 border-green-200',
    red: 'from-red-50 to-red-100 border-red-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 border shadow-sm`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trendValue}
        </span>
      </div>
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function RiskFactorBar({ label, value, color, description }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}

function ActionButton({ text, icon, variant }) {
  const variants = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    orange: 'bg-orange-600 hover:bg-orange-700 text-white',
  };

  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 ${variants[variant]} rounded-lg text-sm font-medium transition-colors shadow-sm`}>
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
      <FaPlus className="ml-auto text-xs" />
    </button>
  );
}

function RecommendationItem({ priority, text }) {
  const priorityStyles = {
    high: 'bg-red-100 border-red-300 text-red-800',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    low: 'bg-blue-100 border-blue-300 text-blue-800',
  };

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${priorityStyles[priority]}`}>
      <span className="text-lg mt-0.5">
        {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🔵'}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{text}</p>
        <p className="text-xs opacity-75 mt-0.5">
          {priority === 'high' ? 'Urgent' : priority === 'medium' ? 'Important' : 'Suggested'}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({ date, event, type }) {
  const typeStyles = {
    positive: 'bg-green-100 border-green-300 text-green-800',
    negative: 'bg-red-100 border-red-300 text-red-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    neutral: 'bg-slate-100 border-slate-300 text-slate-800',
  };

  const icons = {
    positive: '✓',
    negative: '✗',
    warning: '⚠',
    neutral: '•',
  };

  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-full ${typeStyles[type]} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500">{date}</p>
        <p className="text-sm font-medium text-slate-900">{event}</p>
      </div>
    </div>
  );
}

function HistoryCard({ title, icon, items }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
              item.status === 'positive' ? 'bg-green-500' :
              item.status === 'negative' ? 'bg-red-500' :
              item.status === 'warning' ? 'bg-yellow-500' :
              'bg-slate-400'
            }`}></span>
            <span className="text-slate-700">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}