import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { students as initialStudents } from "../../data/students";
import { useTeacher } from "../../context/TeacherContext";
import RiskBadge from "../../components/RiskBadge";
import { useTranslation } from "react-i18next";
import {
  FaList,
  FaUserPlus,
  FaFileImport,
  FaCalendarCheck,
  FaBook,
  FaEye,
  FaDownload,
  FaCheck,
  FaExclamationTriangle,
  FaBars,
  FaChalkboardTeacher,
} from "react-icons/fa"; 

export default function StudentListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { teacher, selectedClass, setSelectedClass, hasMultipleClasses } = useTeacher();
  const [activeTab, setActiveTab] = useState("list");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [riskFilter, setRiskFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [formData, setFormData] = useState({ name: "", grade: "" });
  const [formMessage, setFormMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importStatus, setImportStatus] = useState("");

  // Tabs configuration
  const tabs = [
    { id: "list", label: t('students.tab_list'), icon: FaList },
    { id: "add", label: t('students.tab_add'), icon: FaUserPlus },
    { id: "import", label: t('students.tab_import'), icon: FaFileImport },
    { id: "attendance", label: t('students.tab_attendance'), icon: FaCalendarCheck },
    { id: "marks", label: t('students.tab_marks'), icon: FaBook },
  ];

  // Get unique grades
  const uniqueGrades = [...new Set(studentsList.map((s) => s.grade))].sort((a, b) => a - b);

  // Filter students by selected class and other filters
  const filteredStudents = studentsList.filter((student) => {
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesRisk = riskFilter === "all" || student.riskLevel === riskFilter;
    const matchesGrade = gradeFilter === "all" || student.grade.toString() === gradeFilter;
    return matchesClass && matchesRisk && matchesGrade;
  });

  // Handle add student
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.grade) {
      setFormMessage("Please fill all fields");
      return;
    }

    const newStudent = {
      id: Math.max(...studentsList.map((s) => s.id)) + 1,
      name: formData.name,
      class: selectedClass || `Class ${formData.grade}`,
      grade: parseInt(formData.grade),
      attendance: 85,
      riskLevel: "low",
      lastUpdate: "Today",
    };

    setStudentsList([...studentsList, newStudent]);
    setFormMessage("Student added successfully!");
    setFormData({ name: "", grade: "" });
    setTimeout(() => {
      setFormMessage("");
      setActiveTab("list");
    }, 2000);
  };

  // Handle CSV import
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const nameIdx = headers.findIndex((h) => h.includes("name"));
        const gradeIdx = headers.findIndex((h) => h.includes("class") || h.includes("grade"));

        if (nameIdx === -1 || gradeIdx === -1) {
          setImportStatus("error");
          setImportMessage("CSV must have 'Name' and 'Class/Grade' columns.");
          return;
        }

        const newStudents = [];
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(",").map((c) => c.trim());
          if (!cells[nameIdx] || !cells[gradeIdx]) {
            skipped++;
            continue;
          }

          const grade = parseInt(cells[gradeIdx]);
          if (isNaN(grade) || grade < 1 || grade > 12) {
            skipped++;
            continue;
          }

          newStudents.push({
            id: Math.max(...studentsList.map((s) => s.id), 0) + newStudents.length + 1,
            name: cells[nameIdx],
            class: selectedClass || `Class ${grade}`,
            grade: grade,
            attendance: 85,
            riskLevel: "low",
            lastUpdate: "Today",
          });
        }

        if (newStudents.length === 0) {
          setImportStatus("error");
          setImportMessage("No valid rows found in the file.");
          return;
        }

        setStudentsList([...studentsList, ...newStudents]);
        setImportStatus("success");
        setImportMessage(
          `Successfully imported ${newStudents.length} students. ${skipped > 0 ? `Skipped ${skipped} invalid rows.` : ""}`
        );
        setTimeout(() => {
          setImportStatus("");
          setImportMessage("");
          setActiveTab("list");
        }, 3000);
      } catch (error) {
        setImportStatus("error");
        setImportMessage("Error parsing file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  // Download sample template
  const downloadTemplate = () => {
    const template = "Name,Class\nJohn Doe,6\nJane Smith,7\nRaj Kumar,8";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student_template.csv";
    link.click();
  };

  // Get row background color
  const getRowBgColor = (riskLevel) => {
    if (riskLevel === "high") return "bg-red-50 hover:bg-red-100";
    if (riskLevel === "medium") return "bg-yellow-50 hover:bg-yellow-100";
    return "bg-white hover:bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('students.page_title_management')}</h1>
          <p className="text-gray-600">{t('students.page_subtitle_management')}</p>
        </div>

        {/* Class Selector (only shown if teacher has multiple classes) */}
        {hasMultipleClasses && teacher?.assignedClasses && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-blue-600 text-xl" />
              <div className="flex-1">
                <label htmlFor="classSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('students.select_class')}
                </label>
                <select
                  id="classSelect"
                  value={selectedClass || ""}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('students.all_classes')}</option>
                  {teacher.assignedClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
              {selectedClass && (
                <div className="text-sm text-gray-600">
                  {t('students.showing_from')} <span className="font-semibold text-blue-600">{selectedClass}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Left: Vertical Tabs */}
          <div className="w-full md:w-48 shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-full mb-4 flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200"
            >
              <span className="font-medium text-gray-700">{t('students.tabs')}</span>
              <FaBars />
            </button>

            {/* Tabs Panel */}
            <div
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
                !mobileMenuOpen ? "hidden md:block" : ""
              }`}
            >
              <nav className="flex flex-col">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                        setFormMessage("");
                        setImportMessage("");
                      }}
                      className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-colors text-left ${
                        isActive
                          ? "border-l-blue-600 bg-blue-50 text-blue-700 font-medium"
                          : "border-l-transparent text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right: Content Area */}
          <div className="flex-1 min-w-0">
            {/* Tab 1: List Students */}
            {activeTab === "list" && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('students.risk_level')}
                      </label>
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">{t('students.filter_all')}</option>
                        <option value="high">{t('students.filter_high')}</option>
                        <option value="medium">{t('students.filter_medium')}</option>
                        <option value="low">{t('students.filter_low')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('students.class')}
                      </label>
                      <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">{t('students.all_grades')}</option>
                        {uniqueGrades.map((grade) => (
                          <option key={grade} value={grade}>
                            {t('students.class')} {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table View (Desktop) */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {filteredStudents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                              {t('students.student_name')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                              {t('students.class')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                              {t('students.attendance')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                              {t('students.risk_status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                              {t('students.action')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className={getRowBgColor(student.riskLevel)}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {student.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{student.class}</td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {student.attendance}%
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <RiskBadge level={student.riskLevel} />
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={() => navigate(`/students/${student.id}`)}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  <FaEye className="text-xs" />
                                  {t('students.view')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">{t('students.no_students')}</p>
                    </div>
                  )}
                </div>

                {/* Card View (Mobile) */}
                <div className="md:hidden space-y-3">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <RiskBadge level={student.riskLevel} />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {student.class} • Attendance: {student.attendance}%
                        </p>
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          {t('students.view_profile')}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">{t('students.no_students')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Add Student */}
            {activeTab === "add" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('students.add_new_student')}</h2>
                <form onSubmit={handleAddStudent} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('students.student_name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter student name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class / Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a grade</option>
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Class {grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        formMessage.includes("successfully")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {formMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Student
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Import Students */}
            {activeTab === "import" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Import Students</h2>
                <div className="space-y-4 max-w-2xl">
                  {/* Class Context Info */}
                  {selectedClass && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">Note:</span> Imported students will be added to{" "}
                        <span className="font-bold">{selectedClass}</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Column order does not matter</li>
                      <li>Headers must include "Name" and "Class/Grade"</li>
                      <li>Valid grades: 1-12</li>
                      <li>Invalid rows will be skipped with a summary</li>
                      <li>Supports .csv and .xlsx files</li>
                    </ul>
                  </div>

                  {/* Download Template */}
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaDownload />
                    Download Sample Template
                  </button>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose File
                    </label>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileImport}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Import Status */}
                  {importMessage && (
                    <div
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        importStatus === "success"
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {importStatus === "success" ? (
                        <FaCheck className="text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <FaExclamationTriangle className="text-red-600 mt-0.5 shrink-0" />
                      )}
                      <p
                        className={`text-sm ${
                          importStatus === "success"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {importMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Attendance Upload (Placeholder) */}
            {activeTab === "attendance" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Upload</h2>
                <div className="text-center py-12">
                  <FaCalendarCheck className="mx-auto text-5xl text-gray-300 mb-4" />
                  <p className="text-gray-600">This feature is coming soon.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll be able to upload attendance records in bulk.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 5: Marks Upload (Placeholder) */}
            {activeTab === "marks" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Marks Upload</h2>
                <div className="text-center py-12">
                  <FaBook className="mx-auto text-5xl text-gray-300 mb-4" />
                  <p className="text-gray-600">This feature is coming soon.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll be able to upload academic marks in bulk.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
