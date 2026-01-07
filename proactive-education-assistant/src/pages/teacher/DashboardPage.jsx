// import { useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import StatCard from "../../components/StatCard";
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

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const [isOnline] = useState(true); // Mock online status

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
//     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* 1️⃣ Page Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//           <p className="text-gray-600">
//             Early warning overview of student dropout risk.
//           </p>
//         </div>

//         {/* 2️⃣ Risk Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <StatCard
//             title="Total Students"
//             value={stats.total}
//             icon={FaUsers}
//             bgColor="bg-blue-100"
//             textColor="text-blue-600"
//           />
//           <StatCard
//             title="High Risk"
//             value={stats.highRisk}
//             icon={FaExclamationTriangle}
//             bgColor="bg-red-100"
//             textColor="text-red-600"
//           />
//           <StatCard
//             title="Medium Risk"
//             value={stats.mediumRisk}
//             icon={FaExclamationTriangle}
//             bgColor="bg-yellow-100"
//             textColor="text-yellow-600"
//           />
//           <StatCard
//             title="Low Risk"
//             value={stats.lowRisk}
//             icon={FaCheckCircle}
//             bgColor="bg-green-100"
//             textColor="text-green-600"
//           />
//         </div>

//         {/* 3️⃣ High-Risk Students List (MOST IMPORTANT) */}
//         <div className="bg-white rounded-lg shadow-md border-2 border-red-200 mb-6">
//           <div className="bg-red-50 px-6 py-4 border-b border-red-200">
//             <div className="flex items-center gap-3">
//               <FaExclamationTriangle className="text-red-600 text-xl" />
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Students Needing Immediate Attention
//                 </h2>
//                 <p className="text-sm text-gray-700">
//                   High-risk students require urgent intervention
//                 </p>
//               </div>
//             </div>
//           </div>

//           {highRiskStudents.length > 0 ? (
//             <div className="divide-y divide-gray-200">
//               {highRiskStudents.map((student) => (
//                 <div
//                   key={student.id}
//                   className="px-6 py-4 hover:bg-red-50 transition-colors"
//                 >
//                   <div className="flex items-center justify-between gap-4">
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {student.name}
//                       </h3>
//                       <div className="flex items-center gap-3 mt-1">
//                         <span className="text-sm text-gray-600">
//                           {student.class}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           Attendance: {student.attendance}%
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <RiskBadge level={student.riskLevel} />
//                       <button
//                         onClick={() => navigate(`/students/${student.id}`)}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-red-600
//                                    text-white rounded-lg hover:bg-red-700 transition-colors
//                                    font-medium text-sm"
//                       >
//                         <FaEye />
//                         <span className="hidden sm:inline">View Profile</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="px-6 py-8 text-center">
//               <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
//               <p className="text-gray-600">No high-risk students at this time.</p>
//             </div>
//           )}
//         </div>

//         {/* 4️⃣ Primary Action Button */}
//         <div className="bg-linear-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="text-white">
//               <h3 className="text-xl font-bold mb-1">
//                 View Complete Student List
//               </h3>
//               <p className="text-blue-100 text-sm">
//                 Monitor all students and filter by risk level
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/students")}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600
//                          rounded-lg hover:bg-blue-50 transition-colors font-semibold
//                          shadow-md hover:shadow-lg"
//             >
//               View All Students
//               <FaArrowRight />
//             </button>
//           </div>
//         </div>

//         {/* 5️⃣ Offline / Sync Status */}
//         <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             {isOnline ? (
//               <FaWifi className="text-blue-600 text-xl mt-0.5" />
//             ) : (
//               <FaInfoCircle className="text-gray-500 text-xl mt-0.5" />
//             )}
//             <div className="flex-1">
//               <h4 className="font-semibold text-gray-900 mb-1">
//                 {isOnline ? "Online" : "Offline Mode"}
//               </h4>
//               <p className="text-sm text-gray-700">
//                 {isOnline
//                   ? "All data is synced and up to date."
//                   : "Offline mode: Data will sync when internet is available."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







import { useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import StatCard from "../../components/StatCard";
import RiskBadge from "../../components/RiskBadge";
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaArrowRight,
  FaWifi,
  FaInfoCircle,
} from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOnline] = useState(true); // mock online status

  // Calculate risk statistics
  const stats = {
    total: students.length,
    highRisk: students.filter((s) => s.riskLevel === "high").length,
    mediumRisk: students.filter((s) => s.riskLevel === "medium").length,
    lowRisk: students.filter((s) => s.riskLevel === "low").length,
  };

  // Get top 5 high-risk students
  const highRiskStudents = students
    .filter((s) => s.riskLevel === "high")
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 1️⃣ Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-3">
              {t("dashboard.title", "Dashboard")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("dashboard.subtitle", "Early warning overview of student dropout risk.")}
            </p>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl">🚀</span>
            <span className="text-lg">{t("dashboard.start_trial", "Start Free Trial")}</span>
            <FaArrowRight className="text-sm animate-pulse" />
          </button>
        </div>

        {/* 2️⃣ Risk Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-blue-200 dark:border-blue-800 p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t("dashboard.total_students", "Total Students")}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FaUsers className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-red-200 dark:border-red-800 p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t("dashboard.high_risk", "High Risk")}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  {stats.highRisk}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg animate-pulse">
                <FaExclamationTriangle className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-yellow-200 dark:border-yellow-800 p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t("dashboard.medium_risk", "Medium Risk")}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                  {stats.mediumRisk}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <FaExclamationTriangle className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-green-200 dark:border-green-800 p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t("dashboard.low_risk", "Low Risk")}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  {stats.lowRisk}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 3️⃣ High-Risk Students */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-red-300 dark:border-red-800 mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FaExclamationTriangle className="text-white text-2xl animate-bounce" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {t("dashboard.high_risk_section_title", "Students Needing Immediate Attention")}
                </h2>
                <p className="text-red-100 text-sm mt-1">
                  {t("dashboard.high_risk_section_subtitle", "High-risk students require urgent intervention")}
                </p>
              </div>
            </div>
          </div>

          {highRiskStudents.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {highRiskStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="px-8 py-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                          <span>🎓</span>
                          {student.class}
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                          <span>📊</span>
                          {t("dashboard.attendance", "Attendance")}: {student.attendance}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <RiskBadge level={student.riskLevel} />
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800
                                   text-white rounded-xl hover:shadow-xl transition-all duration-300
                                   font-bold text-sm transform hover:scale-105 group-hover:shadow-2xl"
                      >
                        <FaEye className="text-lg" />
                        <span className="hidden sm:inline">
                          {t("dashboard.view_profile", "View Profile")}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-8 py-12 text-center">
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-5xl text-green-500 dark:text-green-400" />
              </div>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                {t("dashboard.no_high_risk", "No high-risk students at this time.")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {t("dashboard.great_job", "Great job! Keep monitoring.")}
              </p>
            </div>
          )}
        </div>

        {/* 4️⃣ Primary Action */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 dark:from-blue-700 dark:via-teal-700 dark:to-blue-700 rounded-2xl shadow-2xl p-8 mb-10 group hover:shadow-3xl transition-all duration-500">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white text-center sm:text-left">
              <h3 className="text-3xl font-bold mb-3 drop-shadow-lg">
                {t("dashboard.view_all_title", "View Complete Student List")}
              </h3>
              <p className="text-blue-100 dark:text-blue-200 text-base">
                {t("dashboard.view_all_subtitle", "Monitor all students and filter by risk level")}
              </p>
            </div>
            <button
              onClick={() => navigate("/students")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700
                         rounded-xl hover:bg-blue-50 dark:hover:bg-white transition-all duration-300 font-bold text-lg
                         shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
            >
              {t("dashboard.view_all_students", "View All Students")}
              <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 5️⃣ Offline / Sync Status */}
        <div className={`rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 ${
          isOnline 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800' 
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isOnline 
                ? 'bg-blue-500 dark:bg-blue-600' 
                : 'bg-gray-400 dark:bg-gray-600'
            }`}>
              {isOnline ? (
                <FaWifi className="text-white text-2xl animate-pulse" />
              ) : (
                <FaInfoCircle className="text-white text-2xl" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                {isOnline
                  ? t("dashboard.online", "Online")
                  : t("dashboard.offline", "Offline Mode")}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {isOnline
                  ? t("dashboard.online_desc", "All data is synced and up to date.")
                  : t("dashboard.offline_desc", "Offline mode: Data will sync when internet is available.")}
              </p>
            </div>
            {isOnline && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full font-semibold text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {t("dashboard.connected", "Connected")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

