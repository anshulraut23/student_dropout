import { useParams, useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
import { useTheme } from "../../context/ThemeContext";
import {
  FaArrowLeft,
  FaUser,
  FaCalendarCheck,
  FaChartLine,
  FaLightbulb,
  FaExclamationTriangle,
  FaHome,
  FaPhone,
  FaBook,
  FaClipboardList,
  FaBrain,
  FaComments,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { translateText } from "../../utils/googleTranslate";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode } = useTheme();

  // Find student from mock data
  const student = students.find((s) => s.id === parseInt(id));

  // If student not found
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center">
          <FaUser className="mx-auto text-7xl text-gray-300 dark:text-gray-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('teacher.student_not_found')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{t('teacher.student_not_found_desc')}</p>
          <button
            onClick={() => navigate("/students")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
          >
            <FaArrowLeft />
            {t('teacher.back_to_students')}
          </button>
        </div>
      </div>
    );
  }

  // Mock data for this student
  const riskExplanation = getRiskExplanation(student);
  const [riskText, setRiskText] = useState(riskExplanation);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      const lng = i18n.language || 'en';
      if (lng !== 'en') {
        const translated = await translateText(riskExplanation, lng, 'en');
        if (isMounted) setRiskText(translated);
      } else {
        if (isMounted) setRiskText(riskExplanation);
      }
    };
    run();
    return () => { isMounted = false; };
  }, [riskExplanation, i18n.language]);
  const attendanceTrend = getAttendanceTrend(student);
  const academicPerformance = getAcademicPerformance(student);
  const suggestedInterventions = getSuggestedInterventions(student);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 1️⃣ Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/students")}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold mb-4 transition-colors transform hover:translate-x-1"
          >
            <FaArrowLeft />
            {t('teacher.back_to_students')}
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            🎓 {t('teacher.student_profile_title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t('teacher.student_profile_subtitle')}</p>
        </div>

        {/* 2️⃣ Student Basic Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 relative">
            <div className="absolute inset-0 opacity-20 bg-pattern" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}></div>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-20 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800 transform transition-all duration-300 hover:scale-105">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="pb-2">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                      🎓 {student.class}
                    </span>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                      📊 {student.attendance}% {t('teacher.attendance_label')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RiskBadge level={student.riskLevel} />
              </div>
            </div>
          </div>
        </div>

        {/* 3️⃣ Risk Explanation Section (MOST IMPORTANT) */}
        <div
          className={`rounded-2xl shadow-xl p-8 mb-8 border-l-4 ${
            student.riskLevel === "high"
              ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-500"
              : student.riskLevel === "medium"
              ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-500"
              : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500"
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`text-3xl mt-1 ${
              student.riskLevel === "high"
                ? "text-red-600"
                : student.riskLevel === "medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}>
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {t('teacher.risk_analysis_title')}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">{riskText}</p>
            </div>
          </div>
        </div>

        {/* 4️⃣ Attendance Trend Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FaCalendarCheck className="text-blue-600 text-2xl" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('teacher.attendance_trend_title')}
            </h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {attendanceTrend.map((day, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-full h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transform transition-all duration-300 hover:scale-110 cursor-default ${
                    day.present ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-orange-600"
                  }`}
                >
                  {day.present ? t('teacher.present_short') : t('teacher.absent_short')}
                </div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-2">{day.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg"></div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{t('teacher.present')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg"></div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{t('teacher.absent')}</span>
            </div>
          </div>
        </div>

        {/* 5️⃣ Academic Performance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FaChartLine className="text-teal-600 text-2xl" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('teacher.academic_overview_title')}
            </h3>
          </div>
          <div className="space-y-6">
            {academicPerformance.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{subject.name}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {subject.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-md">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      subject.score >= 75
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : subject.score >= 50
                        ? "bg-gradient-to-r from-yellow-500 to-amber-600"
                        : "bg-gradient-to-r from-red-500 to-orange-600"
                    }`}
                    style={{ width: `${subject.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6️⃣ Suggested Interventions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FaLightbulb className="text-yellow-600 text-2xl" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('teacher.suggested_interventions_title')}
            </h3>
          </div>
          <div className="space-y-4">
            {suggestedInterventions.map((intervention, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:translate-x-1"
              >
                <div className="text-2xl text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1">
                  <intervention.icon />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                    {intervention.title}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{intervention.description}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                    intervention.priority === "High"
                      ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200"
                      : intervention.priority === "Medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200"
                      : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200"
                  }`}
                >
                  {t(`teacher.priority_${intervention.priority.toLowerCase()}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7️⃣ Action Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('teacher.quick_actions')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => alert(t('teacher.coming_soon_add_attendance'))}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
            >
              <FaCalendarCheck />
              {t('teacher.add_attendance')}
            </button>
            <button
              onClick={() => alert(t('teacher.coming_soon_add_score'))}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
            >
              <FaBook />
              {t('teacher.add_academic_score')}
            </button>
            <button
              onClick={() => alert(t('teacher.coming_soon_add_behaviour'))}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
            >
              <FaComments />
              {t('teacher.add_behaviour')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for mock data
function getRiskExplanation(student) {
  if (student.riskLevel === "high") {
    return `This student is marked high-risk due to a consistent drop in attendance (${student.attendance}%) and declining academic performance over the last month. Recent observations indicate reduced classroom engagement and several missed assignments. Immediate intervention is recommended to prevent potential dropout.`;
  } else if (student.riskLevel === "medium") {
    return `This student shows moderate risk indicators. While attendance (${student.attendance}%) is acceptable, there are early warning signs of disengagement, including occasional absences and fluctuating academic performance. Proactive monitoring and support can help prevent escalation to high risk.`;
  } else {
    return `This student is currently low-risk with strong attendance (${student.attendance}%) and consistent academic performance. They demonstrate good classroom engagement and participation. Continue regular monitoring to maintain positive trajectory.`;
  }
}

function getAttendanceTrend(student) {
  // Mock attendance data - in real app, this would come from backend
  const attendance = student.attendance;
  const presentCount = Math.round((attendance / 100) * 8);
  
  return Array.from({ length: 8 }, (_, i) => ({
    present: i < presentCount,
    label: `D${i + 1}`,
  }));
}

function getAcademicPerformance(student) {
  // Mock academic scores based on risk level
  const baseScore = student.riskLevel === "high" ? 45 : student.riskLevel === "medium" ? 65 : 85;
  
  return [
    { name: "Mathematics", score: baseScore + Math.floor(Math.random() * 15) },
    { name: "Science", score: baseScore + Math.floor(Math.random() * 15) },
    { name: "English", score: baseScore + Math.floor(Math.random() * 15) },
    { name: "Social Studies", score: baseScore + Math.floor(Math.random() * 15) },
  ];
}

function getSuggestedInterventions(student) {
  const baseInterventions = [
    {
      icon: FaHome,
      title: "Conduct Home Visit",
      description: "Meet with family to understand home environment and discuss concerns.",
      priority: student.riskLevel === "high" ? "High" : "Medium",
    },
    {
      icon: FaPhone,
      title: "Engage with Parents",
      description: "Schedule a parent-teacher meeting to align on student support strategies.",
      priority: student.riskLevel === "high" ? "High" : "Medium",
    },
  ];

  if (student.riskLevel === "high") {
    baseInterventions.push({
      icon: FaBook,
      title: "Provide Learning Support",
      description: "Arrange extra tutoring sessions or peer mentoring for struggling subjects.",
      priority: "High",
    });
  }

  baseInterventions.push({
    icon: FaBrain,
    title: "Monitor Attendance Closely",
    description: "Daily check-ins and follow-up on absences within 24 hours.",
    priority: student.riskLevel === "high" ? "High" : "Low",
  });

  return baseInterventions;
}
