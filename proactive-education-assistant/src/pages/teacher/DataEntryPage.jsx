// import { useState } from "react";
// import { FaCalendarCheck, FaBook, FaUserCheck, FaHandsHelping } from "react-icons/fa";
// import AttendanceTab from "../../components/teacher/dataEntry/AttendanceTab";
// import ScoresTab from "../../components/teacher/dataEntry/ScoresTab";
// import BehaviourTab from "../../components/teacher/dataEntry/BehaviourTab";
// import InterventionsTab from "../../components/teacher/dataEntry/InterventionsTab";

// export default function DataEntryPage() {
//   const [activeTab, setActiveTab] = useState("attendance");

//   return (
//     <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-4 md:mb-6">
//           <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Data Entry</h1>
//           <p className="text-xs md:text-sm text-gray-500 mt-1">Record attendance, scores, behaviour observations, and interventions</p>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white border border-gray-200 rounded-lg mb-4 md:mb-6">
//           <div className="flex border-b border-gray-200 overflow-x-auto">
//             <button
//               onClick={() => setActiveTab("attendance")}
//               className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
//                 activeTab === "attendance"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <FaCalendarCheck />
//               Attendance
//             </button>
//             <button
//               onClick={() => setActiveTab("scores")}
//               className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
//                 activeTab === "scores"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <FaBook />
//               Scores
//             </button>
//             <button
//               onClick={() => setActiveTab("behaviour")}
//               className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
//                 activeTab === "behaviour"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <FaUserCheck />
//               Behaviour
//             </button>
//             <button
//               onClick={() => setActiveTab("interventions")}
//               className={`flex-1 px-4 md:px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
//                 activeTab === "interventions"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <FaHandsHelping />
//               Interventions
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="p-4 md:p-6">
//             {activeTab === "attendance" && <AttendanceTab />}
//             {activeTab === "scores" && <ScoresTab />}
//             {activeTab === "behaviour" && <BehaviourTab />}
//             {activeTab === "interventions" && <InterventionsTab />}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarCheck, FaBook, FaUserCheck, FaHandsHelping } from "react-icons/fa";
import AttendanceTab from "../../components/teacher/dataEntry/AttendanceTab";
import ScoresTab from "../../components/teacher/dataEntry/ScoresTab";
import BehaviourTab from "../../components/teacher/dataEntry/BehaviourTab";
import InterventionsTab from "../../components/teacher/dataEntry/InterventionsTab";

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState("attendance");
  const { t } = useTranslation();

  const tabs = [
    { id: "attendance", label: t("teacher_data_entry.attendance", "Attendance"), icon: FaCalendarCheck, shortLabel: t("teacher_data_entry.attend_short", "Attend") },
    { id: "scores", label: t("teacher_data_entry.scores", "Scores"), icon: FaBook, shortLabel: t("teacher_data_entry.scores", "Scores") },
    { id: "behaviour", label: t("teacher_data_entry.behaviour", "Behaviour"), icon: FaUserCheck, shortLabel: t("teacher_data_entry.behavior_short", "Behavior") },
    { id: "interventions", label: t("teacher_data_entry.interventions", "Interventions"), icon: FaHandsHelping, shortLabel: t("teacher_data_entry.interv_short", "Interv") }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6" style={{ paddingTop: '4.5rem' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">{t("nav.dataEntry", "Data Entry")}</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {t("teacher_data_entry.subtitle", "Record attendance, scores, behavior, and interventions")}
          </p>
        </div>

        {/* Tabs Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Tab Navigation - Mobile Optimized */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-3 text-xs sm:text-sm font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="text-base sm:text-lg" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-[10px]">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 md:p-6">
            {activeTab === "attendance" && <AttendanceTab />}
            {activeTab === "scores" && <ScoresTab />}
            {activeTab === "behaviour" && <BehaviourTab />}
            {activeTab === "interventions" && <InterventionsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}