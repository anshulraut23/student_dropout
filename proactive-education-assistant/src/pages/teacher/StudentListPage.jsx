

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSpinner, FaSearch, FaEye, FaFilter, FaUserGraduate } from "react-icons/fa";
import apiService from "../../services/apiService";
import loadingGif from "../../assets/loading.gif";

export default function StudentListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const classIdFromUrl = searchParams.get('class');

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [riskPredictions, setRiskPredictions] = useState({});
  const [loadingRisk, setLoadingRisk] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState(classIdFromUrl || "all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [groupBy, setGroupBy] = useState("none");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (classIdFromUrl) {
      setFilterClass(classIdFromUrl);
    }
  }, [classIdFromUrl]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Load classes
      const classesResult = await apiService.getMyClasses();
      if (classesResult.success) {
        setClasses(classesResult.classes || []);
      }

      // Load students
      const studentsResult = await apiService.getStudents();
      if (studentsResult.success) {
        const loadedStudents = studentsResult.students || [];
        setStudents(loadedStudents);
        
        // Load risk predictions for all students
        if (loadedStudents.length > 0) {
          loadRiskPredictions(loadedStudents);
        }
      } else {
        setError(studentsResult.error || 'Failed to load students');
      }
    } catch (err) {
      console.error('Load data error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadRiskPredictions = async (studentList) => {
    setLoadingRisk(true);
    try {
      const predictions = {};
      
      // Fetch risk predictions for each student
      await Promise.all(
        studentList.map(async (student) => {
          try {
            const result = await apiService.getStudentRiskPrediction(student.id);
            if (result.success && result.prediction) {
              predictions[student.id] = result.prediction.risk_level || 'low';
            } else {
              predictions[student.id] = 'gathering'; // No prediction available
            }
          } catch (err) {
            // Check if it's an insufficient data error
            if (err.message?.includes('Insufficient data') || err.message?.includes('data_tier')) {
              predictions[student.id] = 'gathering'; // Insufficient data
            } else {
              console.error(`Error loading risk for student ${student.id}:`, err);
              predictions[student.id] = 'gathering'; // Default to gathering on error
            }
          }
        })
      );
      
      setRiskPredictions(predictions);
    } catch (err) {
      console.error('Error loading risk predictions:', err);
    } finally {
      setLoadingRisk(false);
    }
  };

  // Get risk level from ML predictions
  const getRiskLevel = (student) => {
    const prediction = riskPredictions[student.id];
    // If no prediction or insufficient data, return 'gathering'
    if (!prediction || prediction === 'insufficient') {
      return 'gathering';
    }
    return prediction;
  };

  const getRiskBadge = (level) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      gathering: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    
    const labels = {
      critical: t("teacher_dashboard.critical_risk", "Critical Risk"),
      high: t("dashboard.high_risk", "High Risk"),
      medium: t("dashboard.medium_risk", "Medium Risk"),
      low: t("dashboard.low_risk", "Low Risk"),
      gathering: t("teacher_students.gathering_data", "⏳ Gathering Data")
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[level] || styles.low}`}>
        {labels[level] || t("dashboard.low_risk", "Low Risk")}
      </span>
    );
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const name = String(student.name || "").toLowerCase();
    const enrollmentNo = String(student.enrollmentNo || "").toLowerCase();
    const searchValue = searchQuery.toLowerCase();

    const matchesSearch =
      name.includes(searchValue) || enrollmentNo.includes(searchValue);
    const matchesClass = filterClass === "all" || student.classId === filterClass;
    const matchesRisk = filterRisk === "all" || getRiskLevel(student) === filterRisk;
    return matchesSearch && matchesClass && matchesRisk;
  });

  const classLabelById = classes.reduce((acc, cls) => {
    const label = `${cls.name} - Grade ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`;
    acc[cls.id] = label;
    return acc;
  }, {});

  const groupEntries = (() => {
    if (groupBy === "none") {
      return [[t("teacher_students.all_students", "All Students"), filteredStudents]];
    }

    const grouped = new Map();

    filteredStudents.forEach((student) => {
      const key = groupBy === "class"
        ? (classLabelById[student.classId] || student.className || t("teacher_students.unassigned", "Unassigned"))
        : (getRiskLevel(student) || "low");

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(student);
    });

    return Array.from(grouped.entries());
  })();



  if (loading || loadingRisk) {
    return (
      <div className="pt-24 md:pt-20 px-4 md:px-6 pb-8 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            {/* Loading GIF - Bigger Size */}
            <img 
              src={loadingGif} 
              alt="Loading..." 
              className="w-64 h-64 mb-6"
            />
            
            {/* Loading Messages */}
            <div className="text-center space-y-2">
              {loading && (
                <p className="text-gray-700 text-lg font-semibold">
                  {t("teacher_students.loading_students", "Loading Students...")}
                </p>
              )}
              {!loading && loadingRisk && (
                <p className="text-gray-700 text-lg font-semibold">
                  {t("teacher_students.loading_risk", "Loading Risk Predictions...")}
                </p>
              )}
              <p className="text-gray-500 text-sm">
                {t("teacher_students.please_wait", "Please wait while we fetch the data")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 md:pt-20 px-4 md:px-6 pb-8 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">{t("teacher_students.error_loading_students", "Error Loading Students")}</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition-colors"
            >
              {t("teacher_students.retry", "Retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-20 px-4 md:px-6 pb-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{t("nav.students", "Students")}</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {t("teacher_students.found_count", "{{count}} students found", { count: filteredStudents.length })}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 space-y-3 md:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm" />
            <input
              type="text"
              placeholder={t("teacher_students.search_placeholder", "Search by name or enrollment number...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-2 md:gap-3">
            {/* Class Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <FaFilter className="inline mr-1 text-xs" />
                {t("students.select_class", "Filter by Class")}
              </label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                <option value="all">{t("students.all_classes", "All Classes")}</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <FaFilter className="inline mr-1 text-xs" />
                {t("teacher_students.filter_risk", "Filter by Risk Level")}
              </label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                <option value="all">{t("teacher_students.all_risk_levels", "All Risk Levels")}</option>
                <option value="critical">{t("teacher_dashboard.critical_risk", "Critical Risk")}</option>
                <option value="high">{t("dashboard.high_risk", "High Risk")}</option>
                <option value="medium">{t("dashboard.medium_risk", "Medium Risk")}</option>
                <option value="low">{t("dashboard.low_risk", "Low Risk")}</option>
              </select>
            </div>

            {/* Group By */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <FaFilter className="inline mr-1 text-xs" />
                {t("teacher_students.group_by", "Group By")}
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                <option value="none">{t("teacher_students.no_grouping", "No Grouping")}</option>
                <option value="class">{t("students.class", "Class")}</option>
                <option value="risk">{t("students.risk_level", "Risk Level")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length > 0 ? (
          <>
            {groupEntries.map(([groupLabel, groupStudents]) => (
              <div key={groupLabel} className="mb-4 md:mb-6">
                {groupBy !== "none" && (
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">{groupLabel}</h2>
                    <span className="text-xs text-gray-500">
                      {t("teacher_students.count_only", "{{count}} students", { count: groupStudents.length })}
                    </span>
                  </div>
                )}

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          {t("students.student_name", "Name")}
                        </th>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          {t("teacher_students.enrollment_no", "Enrollment No")}
                        </th>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          {t("students.class", "Class")}
                        </th>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          {t("students.risk_level", "Risk Level")}
                        </th>
                        <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          {t("students.action", "Action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {groupStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FaUserGraduate className="text-blue-600 text-xs md:text-sm" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{student.name}</div>
                                {student.email && (
                                  <div className="text-xs text-gray-500 truncate">{student.email}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="text-xs md:text-sm text-gray-600">{student.enrollmentNo}</div>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            <div className="text-xs md:text-sm text-gray-600">{student.className || t("teacher_dashboard.na", "N/A")}</div>
                            {student.section && (
                              <div className="text-xs text-gray-500">{t("teacher_students.section_short", "Sec")} {student.section}</div>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4">
                            {getRiskBadge(getRiskLevel(student))}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                            <button
                              onClick={() => navigate(`/students/${student.id}`)}
                              className="inline-flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors font-medium"
                            >
                              <FaEye className="text-xs" />
                              <span className="hidden sm:inline">{t("students.view", "View")}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {groupStudents.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <FaUserGraduate className="text-blue-600 text-sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {student.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{student.enrollmentNo}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                          title={t("students.view_profile", "View Profile")}
                        >
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{t("students.class", "Class")}:</span>
                          <span className="font-medium text-gray-900">{student.className || t("teacher_dashboard.na", "N/A")}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{t("students.risk_level", "Risk Level")}:</span>
                          {getRiskBadge(getRiskLevel(student))}
                        </div>
                        {student.contact && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">{t("teacher_students.contact", "Contact")}:</span>
                            <span className="font-medium text-gray-900 truncate">{student.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-12 text-center">
            <FaUserGraduate className="mx-auto text-5xl md:text-6xl text-gray-300 mb-3 md:mb-4" />
            <p className="text-gray-500 mb-4 text-sm md:text-base">{t("students.no_students", "No students found")}</p>
            <button
              onClick={() => navigate('/add-student')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              {t("teacher_students.add_students", "Add Students")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}