// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { students as initialStudents } from "../../data/students";
// import { useTeacher } from "../../context/TeacherContext";
// import RiskBadge from "../../components/RiskBadge";
// import { useTranslation } from "react-i18next";
// import {
//   FaList,
//   FaUserPlus,
//   FaFileImport,
//   FaCalendarCheck,
//   FaBook,
//   FaEye,
//   FaDownload,
//   FaCheck,
//   FaExclamationTriangle,
//   FaBars,
//   FaChalkboardTeacher,
// } from "react-icons/fa"; 

// export default function StudentListPage() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { teacher, selectedClass, setSelectedClass, hasMultipleClasses } = useTeacher();
//   const [activeTab, setActiveTab] = useState("list");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [studentsList, setStudentsList] = useState(initialStudents);
//   const [riskFilter, setRiskFilter] = useState("all");
//   const [gradeFilter, setGradeFilter] = useState("all");
//   const [formData, setFormData] = useState({ name: "", grade: "" });
//   const [formMessage, setFormMessage] = useState("");
//   const [importMessage, setImportMessage] = useState("");
//   const [importStatus, setImportStatus] = useState("");

//   // Tabs configuration
//   const tabs = [
//     { id: "list", label: t('students.tab_list'), icon: FaList },
//     { id: "add", label: t('students.tab_add'), icon: FaUserPlus },
//     { id: "import", label: t('students.tab_import'), icon: FaFileImport },
//     { id: "attendance", label: t('students.tab_attendance'), icon: FaCalendarCheck },
//     { id: "marks", label: t('students.tab_marks'), icon: FaBook },
//   ];

//   // Get unique grades
//   const uniqueGrades = [...new Set(studentsList.map((s) => s.grade))].sort((a, b) => a - b);

//   // Filter students by selected class and other filters
//   const filteredStudents = studentsList.filter((student) => {
//     const matchesClass = !selectedClass || student.class === selectedClass;
//     const matchesRisk = riskFilter === "all" || student.riskLevel === riskFilter;
//     const matchesGrade = gradeFilter === "all" || student.grade.toString() === gradeFilter;
//     return matchesClass && matchesRisk && matchesGrade;
//   });

//   // Handle add student
//   const handleAddStudent = (e) => {
//     e.preventDefault();
//     if (!formData.name.trim() || !formData.grade) {
//       setFormMessage("Please fill all fields");
//       return;
//     }

//     const newStudent = {
//       id: Math.max(...studentsList.map((s) => s.id)) + 1,
//       name: formData.name,
//       class: selectedClass || `Class ${formData.grade}`,
//       grade: parseInt(formData.grade),
//       attendance: 85,
//       riskLevel: "low",
//       lastUpdate: "Today",
//     };

//     setStudentsList([...studentsList, newStudent]);
//     setFormMessage("Student added successfully!");
//     setFormData({ name: "", grade: "" });
//     setTimeout(() => {
//       setFormMessage("");
//       setActiveTab("list");
//     }, 2000);
//   };

//   // Handle CSV import
//   const handleFileImport = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const csv = event.target.result;
//         const lines = csv.split("\n").filter((line) => line.trim());
//         const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

//         const nameIdx = headers.findIndex((h) => h.includes("name"));
//         const gradeIdx = headers.findIndex((h) => h.includes("class") || h.includes("grade"));

//         if (nameIdx === -1 || gradeIdx === -1) {
//           setImportStatus("error");
//           setImportMessage("CSV must have 'Name' and 'Class/Grade' columns.");
//           return;
//         }

//         const newStudents = [];
//         let skipped = 0;

//         for (let i = 1; i < lines.length; i++) {
//           const cells = lines[i].split(",").map((c) => c.trim());
//           if (!cells[nameIdx] || !cells[gradeIdx]) {
//             skipped++;
//             continue;
//           }

//           const grade = parseInt(cells[gradeIdx]);
//           if (isNaN(grade) || grade < 1 || grade > 12) {
//             skipped++;
//             continue;
//           }

//           newStudents.push({
//             id: Math.max(...studentsList.map((s) => s.id), 0) + newStudents.length + 1,
//             name: cells[nameIdx],
//             class: selectedClass || `Class ${grade}`,
//             grade: grade,
//             attendance: 85,
//             riskLevel: "low",
//             lastUpdate: "Today",
//           });
//         }

//         if (newStudents.length === 0) {
//           setImportStatus("error");
//           setImportMessage("No valid rows found in the file.");
//           return;
//         }

//         setStudentsList([...studentsList, ...newStudents]);
//         setImportStatus("success");
//         setImportMessage(
//           `Successfully imported ${newStudents.length} students. ${skipped > 0 ? `Skipped ${skipped} invalid rows.` : ""}`
//         );
//         setTimeout(() => {
//           setImportStatus("");
//           setImportMessage("");
//           setActiveTab("list");
//         }, 3000);
//       } catch (error) {
//         setImportStatus("error");
//         setImportMessage("Error parsing file. Please check the format.");
//       }
//     };
//     reader.readAsText(file);
//   };

//   // Download sample template
//   const downloadTemplate = () => {
//     const template = "Name,Class\nJohn Doe,6\nJane Smith,7\nRaj Kumar,8";
//     const blob = new Blob([template], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "student_template.csv";
//     link.click();
//   };

//   // Get row background color
//   const getRowBgColor = (riskLevel) => {
//     if (riskLevel === "high") return "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30";
//     if (riskLevel === "medium") return "bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30";
//     return "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-3">
//             {t('students.page_title_management', 'Student Management')}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 text-lg">
//             {t('students.page_subtitle_management', 'View, add, and manage your students')}
//           </p>
//         </div>

//         {/* Class Selector (only shown if teacher has multiple classes) */}
//         {hasMultipleClasses && teacher?.assignedClasses && (
//           <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800 p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
//                 <FaChalkboardTeacher className="text-white text-2xl" />
//               </div>
//               <div className="flex-1">
//                 <label htmlFor="classSelect" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
//                   {t('students.select_class', 'Select Class')}
//                 </label>
//                 <select
//                   id="classSelect"
//                   value={selectedClass || ""}
//                   onChange={(e) => setSelectedClass(e.target.value)}
//                   className="w-full md:w-80 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all"
//                 >
//                   <option value="">{t('students.all_classes', 'All Classes')}</option>
//                   {teacher.assignedClasses.map((cls) => (
//                     <option key={cls} value={cls}>
//                       {cls}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {selectedClass && (
//                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl font-semibold">
//                   <span className="text-sm">{t('students.showing_from', 'Showing from')} </span>
//                   <span className="font-bold">{selectedClass}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col md:flex-row gap-4 md:gap-6">
//           {/* Left: Vertical Tabs */}
//           <div className="w-full md:w-48 shrink-0 order-2 md:order-1">
//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden w-full mb-4 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl shadow-xl font-bold transition-all duration-300 hover:shadow-2xl transform hover:scale-105"
//             >
//               <span className="text-lg">{mobileMenuOpen ? '✕ Close Tabs' : '☰ Open Tabs'}</span>
//             </button>

//             {/* Tabs Panel */}
//             <div
//               className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
//                 !mobileMenuOpen ? "hidden md:block" : "block"
//               }`}
//             >
//               <nav className="flex flex-col p-2">
//                 {tabs.map((tab) => {
//                   const Icon = tab.icon;
//                   const isActive = activeTab === tab.id;
//                   return (
//                     <button
//                       key={tab.id}
//                       onClick={() => {
//                         setActiveTab(tab.id);
//                         setMobileMenuOpen(false);
//                         setFormMessage("");
//                         setImportMessage("");
//                       }}
//                       className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 text-left mb-1 ${
//                         isActive
//                           ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105"
//                           : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:transform hover:translate-x-1"
//                       }`}
//                     >
//                       <Icon className="text-xl" />
//                       <span className="text-sm font-semibold">{tab.label}</span>
//                     </button>
//                   );
//                 })}
//               </nav>
//             </div>
//           </div>

//           {/* Right: Content Area */}
//           <div className="w-full md:flex-1 min-w-0 order-1 md:order-2">
//             {/* Tab 1: List Students */}
//             {activeTab === "list" && (
//               <div className="space-y-6">
//                 {/* Filters */}
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-6">
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                     <span>🔍</span>
//                     {t('students.filter_students', 'Filter Students')}
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
//                         {t('students.risk_level', 'Risk Level')}
//                       </label>
//                       <select
//                         value={riskFilter}
//                         onChange={(e) => setRiskFilter(e.target.value)}
//                         className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
//                       >
//                         <option value="all">{t('students.filter_all', 'All Levels')}</option>
//                         <option value="high">{t('students.filter_high', 'High Risk')}</option>
//                         <option value="medium">{t('students.filter_medium', 'Medium Risk')}</option>
//                         <option value="low">{t('students.filter_low', 'Low Risk')}</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
//                         {t('students.class', 'Class')}
//                       </label>
//                       <select
//                         value={gradeFilter}
//                         onChange={(e) => setGradeFilter(e.target.value)}
//                         className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
//                       >
//                         <option value="all">{t('students.all_grades', 'All Grades')}</option>
//                         {uniqueGrades.map((grade) => (
//                           <option key={grade} value={grade}>
//                             {t('students.class', 'Class')} {grade}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {t('students.showing', 'Showing')} <span className="font-bold text-blue-600 dark:text-blue-400">{filteredStudents.length}</span> {t('students.students', 'students')}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Table View (Desktop) */}
//                 <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
//                   {filteredStudents.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
//                           <tr>
//                             <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                               {t('students.student_name', 'Student Name')}
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                               {t('students.class', 'Class')}
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                               {t('students.attendance', 'Attendance')}
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                               {t('students.risk_status', 'Risk Status')}
//                             </th>
//                             <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                               {t('students.action', 'Action')}
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                           {filteredStudents.map((student, index) => (
//                             <tr 
//                               key={student.id} 
//                               className={`${getRowBgColor(student.riskLevel)} transition-all duration-200 group`}
//                               style={{ animationDelay: `${index * 50}ms` }}
//                             >
//                               <td className="px-6 py-5 text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                 {student.name}
//                               </td>
//                               <td className="px-6 py-5">
//                                 <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
//                                   🎓 {student.class}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-5">
//                                 <div className="flex items-center gap-2">
//                                   <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20">
//                                     <div 
//                                       className={`h-2 rounded-full ${student.attendance >= 75 ? 'bg-green-500' : student.attendance >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
//                                       style={{ width: `${student.attendance}%` }}
//                                     ></div>
//                                   </div>
//                                   <span className="text-sm font-bold text-gray-900 dark:text-white">{student.attendance}%</span>
//                                 </div>
//                               </td>
//                               <td className="px-6 py-5">
//                                 <RiskBadge level={student.riskLevel} />
//                               </td>
//                               <td className="px-6 py-5">
//                                 <button
//                                   onClick={() => navigate(`/students/${student.id}`)}
//                                   className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm transform hover:scale-105"
//                                 >
//                                   <FaEye className="text-sm" />
//                                   {t('students.view', 'View')}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <div className="text-center py-16">
//                       <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
//                         <span className="text-5xl">📋</span>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">{t('students.no_students', 'No students found')}</p>
//                       <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{t('students.try_different_filters', 'Try adjusting your filters')}</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Card View (Mobile) */}
//                 <div className="md:hidden space-y-4">
//                   {filteredStudents.length > 0 ? (
//                     filteredStudents.map((student, index) => (
//                       <div
//                         key={student.id}
//                         className={`${getRowBgColor(student.riskLevel)} rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:scale-105`}
//                         style={{ animationDelay: `${index * 100}ms` }}
//                       >
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{student.name}</h3>
//                             <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
//                               🎓 {student.class}
//                             </span>
//                           </div>
//                           <RiskBadge level={student.riskLevel} />
//                         </div>
                        
//                         <div className="mb-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Attendance</span>
//                             <span className="text-sm font-bold text-gray-900 dark:text-white">{student.attendance}%</span>
//                           </div>
//                           <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//                             <div 
//                               className={`h-3 rounded-full ${student.attendance >= 75 ? 'bg-green-500' : student.attendance >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
//                               style={{ width: `${student.attendance}%` }}
//                             ></div>
//                           </div>
//                         </div>
                        
//                         <button
//                           onClick={() => navigate(`/students/${student.id}`)}
//                           className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold transform hover:scale-105"
//                         >
//                           {t('students.view_profile', 'View Profile')}
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700">
//                       <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
//                         <span className="text-5xl">📋</span>
//                       </div>
//                       <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">{t('students.no_students', 'No students found')}</p>
//                       <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{t('students.try_different_filters', 'Try adjusting your filters')}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Tab 2: Add Student */}
//             {activeTab === "add" && (
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('students.add_new_student')}</h2>
//                 <form onSubmit={handleAddStudent} className="space-y-4 max-w-md">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       {t('students.student_name')} *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       placeholder="Enter student name"
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Class / Grade *
//                     </label>
//                     <select
//                       value={formData.grade}
//                       onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select a grade</option>
//                       {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
//                         <option key={grade} value={grade}>
//                           Class {grade}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {formMessage && (
//                     <div
//                       className={`p-3 rounded-lg text-sm ${
//                         formMessage.includes("successfully")
//                           ? "bg-green-50 text-green-700 border border-green-200"
//                           : "bg-red-50 text-red-700 border border-red-200"
//                       }`}
//                     >
//                       {formMessage}
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                   >
//                     Add Student
//                   </button>
//                 </form>
//               </div>
//             )}

//             {/* Tab 3: Import Students */}
//             {activeTab === "import" && (
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Import Students</h2>
//                 <div className="space-y-4 max-w-2xl">
//                   {/* Class Context Info */}
//                   {selectedClass && (
//                     <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
//                       <p className="text-sm text-blue-900 dark:text-blue-200">
//                         <span className="font-semibold">Note:</span> Imported students will be added to{" "}
//                         <span className="font-bold">{selectedClass}</span>
//                       </p>
//                     </div>
//                   )}
                  
//                   {/* Instructions */}
//                   <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
//                     <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Instructions:</h3>
//                     <ul className="text-sm text-blue-800 dark:text-blue-100 space-y-1 list-disc list-inside">
//                       <li>Column order does not matter</li>
//                       <li>Headers must include "Name" and "Class/Grade"</li>
//                       <li>Valid grades: 1-12</li>
//                       <li>Invalid rows will be skipped with a summary</li>
//                       <li>Supports .csv and .xlsx files</li>
//                     </ul>
//                   </div>

//                   {/* Download Template */}
//                   <button
//                     onClick={downloadTemplate}
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     <FaDownload />
//                     Download Sample Template
//                   </button>

//                   {/* File Upload */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Choose File
//                     </label>
//                     <input
//                       type="file"
//                       accept=".csv,.xlsx"
//                       onChange={handleFileImport}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   {/* Import Status */}
//                   {importMessage && (
//                     <div
//                       className={`p-4 rounded-lg flex items-start gap-3 ${
//                         importStatus === "success"
//                           ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
//                           : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700"
//                       }`}
//                     >
//                       {importStatus === "success" ? (
//                         <FaCheck className="text-green-600 mt-0.5 shrink-0" />
//                       ) : (
//                         <FaExclamationTriangle className="text-red-600 mt-0.5 shrink-0" />
//                       )}
//                       <p
//                         className={`text-sm ${
//                           importStatus === "success"
//                             ? "text-green-700 dark:text-green-200"
//                             : "text-red-700 dark:text-red-200"
//                         }`}
//                       >
//                         {importMessage}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Tab 4: Attendance Upload (Placeholder) */}
//             {activeTab === "attendance" && (
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Attendance Upload</h2>
//                 <div className="text-center py-12">
//                   <FaCalendarCheck className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
//                   <p className="text-gray-600 dark:text-gray-300">This feature is coming soon.</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                     You'll be able to upload attendance records in bulk.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Tab 5: Marks Upload (Placeholder) */}
//             {activeTab === "marks" && (
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Marks Upload</h2>
//                 <div className="text-center py-12">
//                   <FaBook className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
//                   <p className="text-gray-600 dark:text-gray-300">This feature is coming soon.</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                     You'll be able to upload academic marks in bulk.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { students as initialStudents } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
import { FaEye } from "react-icons/fa";

export default function StudentListPage() {
  const navigate = useNavigate();
  const [students] = useState(initialStudents);
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredStudents = students.filter(
    (s) => riskFilter === "all" || s.riskLevel === riskFilter
  );

  return (
    <div className="px-6 py-6 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Students
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            View and manage all students
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-md p-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Risk Level
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="mt-1 block w-40 px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredStudents.length}</span> students
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No students found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    Student
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    Class
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    Attendance
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-600">
                    Risk
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
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
                        className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
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
