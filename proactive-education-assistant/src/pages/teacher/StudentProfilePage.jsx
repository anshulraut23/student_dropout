import { useParams, useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
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

  // Find student from mock data
  const student = students.find((s) => s.id === parseInt(id));

  // If student not found
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <FaUser className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('teacher.student_not_found')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t('teacher.student_not_found_desc')}</p>
          <button
            onClick={() => navigate("/students")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white
                       rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 1️⃣ Page Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/students")}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700
                       font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            {t('teacher.back_to_students')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('teacher.student_profile_title')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('teacher.student_profile_subtitle')}</p>
        </div>

        {/* 2️⃣ Student Basic Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-teal-500 rounded-full
                              flex items-center justify-center text-white text-2xl font-bold">
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{student.class}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <RiskBadge level={student.riskLevel} />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('teacher.attendance_label')}: <span className="font-semibold text-gray-900 dark:text-white">{student.attendance}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3️⃣ Risk Explanation Section (MOST IMPORTANT) */}
        <div
          className={`rounded-lg shadow-md border-l-4 p-6 mb-6 ${
            student.riskLevel === "high"
              ? "bg-red-50 dark:bg-red-900/20 border-red-500"
              : student.riskLevel === "medium"
              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
              : "bg-green-50 dark:bg-green-900/20 border-green-500"
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <FaExclamationTriangle
              className={`text-2xl mt-1 ${
                student.riskLevel === "high"
                  ? "text-red-600"
                  : student.riskLevel === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('teacher.risk_analysis_title')}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{riskText}</p>
            </div>
          </div>
        </div>

        {/* 4️⃣ Attendance Trend Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarCheck className="text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('teacher.attendance_trend_title')}
            </h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {attendanceTrend.map((day, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-full h-12 rounded-md flex items-center justify-center text-white font-bold ${
                    day.present ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {day.present ? t('teacher.present_short') : t('teacher.absent_short')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{day.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">{t('teacher.present')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">{t('teacher.absent')}</span>
            </div>
          </div>
        </div>

        {/* 5️⃣ Academic Performance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-teal-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('teacher.academic_overview_title')}
            </h3>
          </div>
          <div className="space-y-4">
            {academicPerformance.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{subject.name}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {subject.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      subject.score >= 75
                        ? "bg-green-500"
                        : subject.score >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${subject.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6️⃣ Suggested Interventions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaLightbulb className="text-yellow-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('teacher.suggested_interventions_title')}
            </h3>
          </div>
          <div className="space-y-3">
            {suggestedInterventions.map((intervention, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <intervention.icon className="text-blue-600 text-xl mt-0.5 flex shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {intervention.title}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{intervention.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('teacher.quick_actions')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => alert(t('teacher.coming_soon_add_attendance'))}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600
                         text-white rounded-lg hover:bg-green-700 transition-colors
                         font-medium"
            >
              <FaCalendarCheck />
              {t('teacher.add_attendance')}
            </button>
            <button
              onClick={() => alert(t('teacher.coming_soon_add_score'))}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600
                         text-white rounded-lg hover:bg-blue-700 transition-colors
                         font-medium"
            >
              <FaBook />
              {t('teacher.add_academic_score')}
            </button>
            <button
              onClick={() => alert(t('teacher.coming_soon_add_behaviour'))}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600
                         text-white rounded-lg hover:bg-purple-700 transition-colors
                         font-medium"
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
