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
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 1️⃣ Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-600">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {/* 2️⃣ Risk Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title={t("dashboard.total_students")}
            value={stats.total}
            icon={FaUsers}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatCard
            title={t("dashboard.high_risk")}
            value={stats.highRisk}
            icon={FaExclamationTriangle}
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
          <StatCard
            title={t("dashboard.medium_risk")}
            value={stats.mediumRisk}
            icon={FaExclamationTriangle}
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
          />
          <StatCard
            title={t("dashboard.low_risk")}
            value={stats.lowRisk}
            icon={FaCheckCircle}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
        </div>

        {/* 3️⃣ High-Risk Students */}
        <div className="bg-white rounded-lg shadow-md border-2 border-red-200 mb-6">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-600 text-xl" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("dashboard.high_risk_section_title")}
                </h2>
                <p className="text-sm text-gray-700">
                  {t("dashboard.high_risk_section_subtitle")}
                </p>
              </div>
            </div>
          </div>

          {highRiskStudents.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {highRiskStudents.map((student) => (
                <div
                  key={student.id}
                  className="px-6 py-4 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">
                          {student.class}
                        </span>
                        <span className="text-sm text-gray-500">
                          {t("dashboard.attendance")}: {student.attendance}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge level={student.riskLevel} />
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600
                                   text-white rounded-lg hover:bg-red-700 transition-colors
                                   font-medium text-sm"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">
                          {t("dashboard.view_profile")}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-3" />
              <p className="text-gray-600">
                {t("dashboard.no_high_risk")}
              </p>
            </div>
          )}
        </div>

        {/* 4️⃣ Primary Action */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-1">
                {t("dashboard.view_all_title")}
              </h3>
              <p className="text-blue-100 text-sm">
                {t("dashboard.view_all_subtitle")}
              </p>
            </div>
            <button
              onClick={() => navigate("/students")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600
                         rounded-lg hover:bg-blue-50 transition-colors font-semibold
                         shadow-md hover:shadow-lg"
            >
              {t("dashboard.view_all_students")}
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* 5️⃣ Offline / Sync Status */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            {isOnline ? (
              <FaWifi className="text-blue-600 text-xl mt-0.5" />
            ) : (
              <FaInfoCircle className="text-gray-500 text-xl mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {isOnline
                  ? t("dashboard.online")
                  : t("dashboard.offline")}
              </h4>
              <p className="text-sm text-gray-700">
                {isOnline
                  ? t("dashboard.online_desc")
                  : t("dashboard.offline_desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

