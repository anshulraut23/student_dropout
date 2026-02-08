// // import { useNavigate } from "react-router-dom";
// // import { students } from "../../data/students";
// // import StatCard from "../../components/StatCard";
// // import RiskBadge from "../../components/RiskBadge";
// // import {
// //   FaUsers,
// //   FaExclamationTriangle,
// //   FaCheckCircle,
// //   FaEye,
// //   FaArrowRight,
// //   FaWifi,
// //   FaInfoCircle,
// // } from "react-icons/fa";
// // import { useState } from "react";

// // export default function DashboardPage() {
// //   const navigate = useNavigate();
// //   const [isOnline] = useState(true); // Mock online status

// //   // Calculate risk statistics
// //   const stats = {
// //     total: students.length,
// //     highRisk: students.filter((s) => s.riskLevel === "high").length,
// //     mediumRisk: students.filter((s) => s.riskLevel === "medium").length,
// //     lowRisk: students.filter((s) => s.riskLevel === "low").length,
// //   };

// //   // Get top 5 high-risk students
// //   const highRiskStudents = students
// //     .filter((s) => s.riskLevel === "high")
// //     .slice(0, 5);

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-7xl mx-auto">
// //         {/* 1️⃣ Page Header */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
// //           <p className="text-gray-600">
// //             Early warning overview of student dropout risk.
// //           </p>
// //         </div>

// //         {/* 2️⃣ Risk Summary Cards */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
// //           <StatCard
// //             title="Total Students"
// //             value={stats.total}
// //             icon={FaUsers}
// //             bgColor="bg-blue-100"
// //             textColor="text-blue-600"
// //           />
// //           <StatCard
// //             title="High Risk"
// //             value={stats.highRisk}
// //             icon={FaExclamationTriangle}
// //             bgColor="bg-red-100"
// //             textColor="text-red-600"
// //           />
// //           <StatCard
// //             title="Medium Risk"
// //             value={stats.mediumRisk}
// //             icon={FaExclamationTriangle}
// //             bgColor="bg-yellow-100"
// //             textColor="text-yellow-600"
// //           />
// //           <StatCard
// //             title="Low Risk"
// //             value={stats.lowRisk}
// //             icon={FaCheckCircle}
// //             bgColor="bg-green-100"
// //             textColor="text-green-600"
// //           />
// //         </div>

// //         {/* 3️⃣ High-Risk Students List (MOST IMPORTANT) */}
// //         <div className="bg-white rounded-lg shadow-md border-2 border-red-200 mb-6">
// //           <div className="bg-red-50 px-6 py-4 border-b border-red-200">
// //             <div className="flex items-center gap-3">
// //               <FaExclamationTriangle className="text-red-600 text-xl" />
// //               <div>
// //                 <h2 className="text-xl font-bold text-gray-900">
// //                   Students Needing Immediate Attention
// //                 </h2>
// //                 <p className="text-sm text-gray-700">
// //                   High-risk students require urgent intervention
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {highRiskStudents.length > 0 ? (
// //             <div className="divide-y divide-gray-200">
// //               {highRiskStudents.map((student) => (
// //                 <div
// //                   key={student.id}
// //                   className="px-6 py-4 hover:bg-red-50 transition-colors"
// //                 >
// //                   <div className="flex items-center justify-between gap-4">
// //                     <div className="flex-1">
// //                       <h3 className="text-lg font-semibold text-gray-900">
// //                         {student.name}
// //                       </h3>
// //                       <div className="flex items-center gap-3 mt-1">
// //                         <span className="text-sm text-gray-600">
// //                           {student.class}
// //                         </span>
// //                         <span className="text-sm text-gray-500">
// //                           Attendance: {student.attendance}%
// //                         </span>
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center gap-3">
// //                       <RiskBadge level={student.riskLevel} />
// //                       <button
// //                         onClick={() => navigate(`/students/${student.id}`)}
// //                         className="inline-flex items-center gap-2 px-4 py-2 bg-red-600
// //                                    text-white rounded-lg hover:bg-red-700 transition-colors
// //                                    font-medium text-sm"
// //                       >
// //                         <FaEye />
// //                         <span className="hidden sm:inline">View Profile</span>
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="px-6 py-8 text-center">
// //               <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
// //               <p className="text-gray-600">No high-risk students at this time.</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* 4️⃣ Primary Action Button */}
// //         <div className="bg-linear-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 mb-6">
// //           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
// //             <div className="text-white">
// //               <h3 className="text-xl font-bold mb-1">
// //                 View Complete Student List
// //               </h3>
// //               <p className="text-blue-100 text-sm">
// //                 Monitor all students and filter by risk level
// //               </p>
// //             </div>
// //             <button
// //               onClick={() => navigate("/students")}
// //               className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600
// //                          rounded-lg hover:bg-blue-50 transition-colors font-semibold
// //                          shadow-md hover:shadow-lg"
// //             >
// //               View All Students
// //               <FaArrowRight />
// //             </button>
// //           </div>
// //         </div>

// //         {/* 5️⃣ Offline / Sync Status */}
// //         <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
// //           <div className="flex items-start gap-3">
// //             {isOnline ? (
// //               <FaWifi className="text-blue-600 text-xl mt-0.5" />
// //             ) : (
// //               <FaInfoCircle className="text-gray-500 text-xl mt-0.5" />
// //             )}
// //             <div className="flex-1">
// //               <h4 className="font-semibold text-gray-900 mb-1">
// //                 {isOnline ? "Online" : "Offline Mode"}
// //               </h4>
// //               <p className="text-sm text-gray-700">
// //                 {isOnline
// //                   ? "All data is synced and up to date."
// //                   : "Offline mode: Data will sync when internet is available."}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }








// // latest of 7/2





// import { useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import RiskBadge from "../../components/RiskBadge";
// import {
//   FaUsers,
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaEye,
//   FaArrowRight,
//   FaWifi,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [isOnline] = useState(true); // mock online status

//   // Calculate risk statistics
//   const stats = {
//     total: students.length,
//     highRisk: students.filter((s) => s.riskLevel === "high").length,
//     mediumRisk: students.filter((s) => s.riskLevel === "medium").length,
//     lowRisk: students.filter((s) => s.riskLevel === "low").length,
//   };

//   // Get top 5 high-risk students
//   const highRiskStudents = students
//     .filter((s) => s.riskLevel === "high")
//     .slice(0, 5);

//   return (
//     <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* 1️⃣ Page Header */}
//         <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//           <div>
//             <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-2">
//               {t("dashboard.title", "Dashboard")}
//             </h1>
//             <p className="text-slate-600 text-base sm:text-lg">
//               {t("dashboard.subtitle", "Early warning overview of student dropout risk.")}
//             </p>
//           </div>
//           <button
//             onClick={() => navigate('/pricing')}
//             className="inline-flex items-center gap-2 px-5 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 shadow-sm"
//           >
//             <span>{t("dashboard.start_trial", "Start Free Trial")}</span>
//             <FaArrowRight className="text-sm" />
//           </button>
//         </div>

//         {/* 2️⃣ Risk Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
//                   {t("dashboard.total_students", "Total Students")}
//                 </p>
//                 <p className="text-3xl font-semibold text-slate-900">
//                   {stats.total}
//                 </p>
//               </div>
//               <div className="w-12 h-12 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center">
//                 <FaUsers className="text-xl text-blue-700" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
//                   {t("dashboard.high_risk", "High Risk")}
//                 </p>
//                 <p className="text-3xl font-semibold text-slate-900">
//                   {stats.highRisk}
//                 </p>
//               </div>
//               <div className="w-12 h-12 rounded-md bg-red-50 border border-red-100 flex items-center justify-center">
//                 <FaExclamationTriangle className="text-xl text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
//                   {t("dashboard.medium_risk", "Medium Risk")}
//                 </p>
//                 <p className="text-3xl font-semibold text-slate-900">
//                   {stats.mediumRisk}
//                 </p>
//               </div>
//               <div className="w-12 h-12 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center">
//                 <FaExclamationTriangle className="text-xl text-amber-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
//                   {t("dashboard.low_risk", "Low Risk")}
//                 </p>
//                 <p className="text-3xl font-semibold text-slate-900">
//                   {stats.lowRisk}
//                 </p>
//               </div>
//               <div className="w-12 h-12 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
//                 <FaCheckCircle className="text-xl text-emerald-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 3️⃣ High-Risk Students */}
//         <div className="bg-white rounded-lg border border-red-200 mb-10 overflow-hidden">
//           <div className="bg-red-50 px-6 py-4 border-b border-red-100">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white rounded-md border border-red-100 flex items-center justify-center">
//                 <FaExclamationTriangle className="text-red-600 text-lg" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-slate-900">
//                   {t("dashboard.high_risk_section_title", "Students Needing Immediate Attention")}
//                 </h2>
//                 <p className="text-slate-600 text-sm mt-1">
//                   {t("dashboard.high_risk_section_subtitle", "High-risk students require urgent intervention")}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {highRiskStudents.length > 0 ? (
//             <div className="divide-y divide-slate-100">
//               {highRiskStudents.map((student) => (
//                 <div
//                   key={student.id}
//                   className="px-6 py-4 hover:bg-slate-50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between gap-6">
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-slate-900">
//                         {student.name}
//                       </h3>
//                       <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
//                         <span>{student.class}</span>
//                         <span>•</span>
//                         <span>{t("dashboard.attendance", "Attendance")}: {student.attendance}%</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <RiskBadge level={student.riskLevel} />
//                       <button
//                         onClick={() => navigate(`/students/${student.id}`)}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold text-sm"
//                       >
//                         <FaEye className="text-base" />
//                         <span className="hidden sm:inline">
//                           {t("dashboard.view_profile", "View Profile")}
//                         </span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="px-8 py-10 text-center">
//               <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
//                 <FaCheckCircle className="text-3xl text-emerald-600" />
//               </div>
//               <p className="text-base font-semibold text-slate-700">
//                 {t("dashboard.no_high_risk", "No high-risk students at this time.")}
//               </p>
//               <p className="text-sm text-slate-500 mt-2">
//                 {t("dashboard.great_job", "Great job! Keep monitoring.")}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* 4️⃣ Primary Action */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-slate-900 text-center sm:text-left">
//               <h3 className="text-xl font-semibold mb-2">
//                 {t("dashboard.view_all_title", "View Complete Student List")}
//               </h3>
//               <p className="text-slate-600 text-sm">
//                 {t("dashboard.view_all_subtitle", "Monitor all students and filter by risk level")}
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/students")}
//               className="inline-flex items-center gap-2 px-5 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-semibold"
//             >
//               {t("dashboard.view_all_students", "View All Students")}
//               <FaArrowRight className="text-sm" />
//             </button>
//           </div>
//         </div>

//         {/* 5️⃣ Offline / Sync Status */}
//         <div className={`rounded-lg p-5 border ${
//           isOnline ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
//         }`}>
//           <div className="flex items-start gap-4">
//             <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
//               isOnline ? 'bg-blue-600' : 'bg-slate-400'
//             }`}>
//               {isOnline ? (
//                 <FaWifi className="text-white text-lg" />
//               ) : (
//                 <FaInfoCircle className="text-white text-lg" />
//               )}
//             </div>
//             <div className="flex-1">
//               <h4 className="font-semibold text-slate-900 mb-2 text-base">
//                 {isOnline
//                   ? t("dashboard.online", "Online")
//                   : t("dashboard.offline", "Offline Mode")}
//               </h4>
//               <p className="text-sm text-slate-600 leading-relaxed">
//                 {isOnline
//                   ? t("dashboard.online_desc", "All data is synced and up to date.")
//                   : t("dashboard.offline_desc", "Offline mode: Data will sync when internet is available.")}
//               </p>
//             </div>
//             {isOnline && (
//               <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-sm">
//                 <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
//                 {t("dashboard.connected", "Connected")}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









// 8/2



import { useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";

import GamificationWidget from "../../components/GamificationWidget";

<GamificationWidget />


export default function DashboardPage() {
  const navigate = useNavigate();

  const stats = {
    total: students.length,
    high: students.filter(s => s.riskLevel === "high").length,
    medium: students.filter(s => s.riskLevel === "medium").length,
    low: students.filter(s => s.riskLevel === "low").length,
  };

  const highRiskStudents = students.filter(s => s.riskLevel === "high");

  return (
    <div className="pt-16 px-6 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Early warning overview of student dropout risk
            </p>
          </div>

          <button
            onClick={() => navigate("/students")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            View All Students
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Students" value={stats.total} icon={<FaUsers />} />
          <StatCard title="High Risk" value={stats.high} icon={<FaExclamationTriangle />} />
          <StatCard title="Medium Risk" value={stats.medium} icon={<FaExclamationTriangle />} />
          <StatCard title="Low Risk" value={stats.low} icon={<FaCheckCircle />} />
        </div>

        {/* High Risk List */}
        <div className="bg-white border border-slate-200 rounded-md">
          <div className="px-5 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">
              Students Requiring Immediate Attention
            </h2>
          </div>

          {highRiskStudents.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">
              No high-risk students currently.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-5 py-2">Student</th>
                  <th className="text-left px-5 py-2">Class</th>
                  <th className="text-left px-5 py-2">Attendance</th>
                  <th className="text-left px-5 py-2">Risk</th>
                  <th className="px-5 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {highRiskStudents.map(student => (
                  <tr
                    key={student.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-5 py-3">{student.class}</td>
                    <td className="px-5 py-3">{student.attendance}%</td>
                    <td className="px-5 py-3">
                      <RiskBadge level={student.riskLevel} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 flex justify-between items-center">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="text-2xl font-semibold text-slate-900 mt-1">
          {value}
        </p>
      </div>
      <div className="text-slate-400 text-xl">
        {icon}
      </div>
    </div>
  );
}



// // latest 8 2 afternoon

// import { useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import RiskBadge from "../../components/RiskBadge";
// // import GamificationWidget from "../../components/GamificationWidget";

// import {
//   FaUsers,
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaEye,
// } from "react-icons/fa";

// export default function DashboardPage() {
//   const navigate = useNavigate();

//   const stats = {
//     total: students.length,
//     high: students.filter(s => s.riskLevel === "high").length,
//     medium: students.filter(s => s.riskLevel === "medium").length,
//     low: students.filter(s => s.riskLevel === "low").length,
//   };

//   const highRiskStudents = students.filter(s => s.riskLevel === "high");

//   return (
//     <div className="pt-16 px-6 bg-slate-100 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-6">

//         {/* Gamification */}
//         {/* <GamificationWidget /> */}

//         {/* Title */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-semibold">Dashboard</h1>
//             <p className="text-sm text-slate-600">
//               Student risk monitoring overview
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/students")}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
//           >
//             View Students
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid sm:grid-cols-4 gap-4">
//           <StatCard title="Total Students" value={stats.total} icon={<FaUsers />} />
//           <StatCard title="High Risk" value={stats.high} icon={<FaExclamationTriangle />} />
//           <StatCard title="Medium Risk" value={stats.medium} icon={<FaExclamationTriangle />} />
//           <StatCard title="Low Risk" value={stats.low} icon={<FaCheckCircle />} />
//         </div>

//         {/* High Risk Table */}
//         <div className="bg-white border rounded-md">
//           <div className="px-5 py-3 border-b">
//             <h2 className="font-semibold text-sm">Immediate Attention</h2>
//           </div>

//           <table className="w-full text-sm">
//             <thead className="bg-slate-50">
//               <tr>
//                 <th className="px-5 py-2 text-left">Student</th>
//                 <th className="px-5 py-2 text-left">Class</th>
//                 <th className="px-5 py-2 text-left">Attendance</th>
//                 <th className="px-5 py-2 text-left">Risk</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {highRiskStudents.map(s => (
//                 <tr key={s.id} className="border-t hover:bg-slate-50">
//                   <td className="px-5 py-3 font-medium">{s.name}</td>
//                   <td className="px-5 py-3">{s.class}</td>
//                   <td className="px-5 py-3">{s.attendance}%</td>
//                   <td className="px-5 py-3"><RiskBadge level={s.riskLevel} /></td>
//                   <td className="px-5 py-3 text-right">
//                     <button
//                       onClick={() => navigate(`/students/${s.id}`)}
//                       className="text-blue-600 inline-flex items-center gap-1"
//                     >
//                       <FaEye /> View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         </div>

//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon }) {
//   return (
//     <div className="bg-white border rounded-md p-4 flex justify-between">
//       <div>
//         <p className="text-xs text-slate-500 uppercase">{title}</p>
//         <p className="text-2xl font-semibold">{value}</p>
//       </div>
//       <div className="text-slate-400 text-xl">{icon}</div>
//     </div>
//   );
// }
