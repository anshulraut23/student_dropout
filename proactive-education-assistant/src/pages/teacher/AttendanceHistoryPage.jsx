// // import { useState, useEffect } from "react";
// // import { FaCalendarAlt, FaFilter, FaDownload, FaEye, FaSearch } from "react-icons/fa";
// // import * as XLSX from "xlsx";
// // import apiService from "../../services/apiService";

// // export default function AttendanceHistoryPage() {
// //   const [attendanceHistory, setAttendanceHistory] = useState([]);
// //   const [filteredHistory, setFilteredHistory] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState({ type: "", text: "" });
  
// //   const [filters, setFilters] = useState({
// //     classId: "",
// //     startDate: "",
// //     endDate: "",
// //     searchQuery: ""
// //   });

// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [showDetailsModal, setShowDetailsModal] = useState(false);

// //   useEffect(() => {
// //     loadClasses();
// //     loadAttendanceHistory();
// //   }, []);

// //   useEffect(() => {
// //     applyFilters();
// //   }, [filters, attendanceHistory]);

// //   const loadClasses = async () => {
// //     try {
// //       const result = await apiService.getMyClasses();
// //       if (result.success) {
// //         setClasses(result.classes || []);
// //       }
// //     } catch (error) {
// //       console.error('Failed to load classes:', error);
// //     }
// //   };

// //   const loadAttendanceHistory = async () => {
// //     setLoading(true);
// //     try {
// //       // Get attendance statistics for all classes
// //       const classesResult = await apiService.getMyClasses();
// //       if (!classesResult.success) {
// //         throw new Error('Failed to load classes');
// //       }

// //       const allHistory = [];
      
// //       // Get attendance for each class
// //       for (const cls of classesResult.classes || []) {
// //         try {
// //           // Get last 30 days of attendance
// //           const endDate = new Date().toISOString().split('T')[0];
// //           const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
// //           const response = await apiService.getClassAttendance(cls.id, {
// //             startDate,
// //             endDate
// //           });
          
// //           if (response.success && response.attendance) {
// //             // Group by date
// //             const byDate = {};
// //             response.attendance.forEach(record => {
// //               if (!byDate[record.date]) {
// //                 byDate[record.date] = {
// //                   date: record.date,
// //                   classId: cls.id,
// //                   className: cls.name,
// //                   students: []
// //                 };
// //               }
// //               byDate[record.date].students.push({
// //                 name: record.studentName,
// //                 enrollmentNo: record.enrollmentNo,
// //                 status: record.status
// //               });
// //             });
            
// //             // Convert to array and calculate stats
// //             Object.values(byDate).forEach(dateRecord => {
// //               const totalStudents = dateRecord.students.length;
// //               const presentCount = dateRecord.students.filter(s => s.status === 'present').length;
// //               const absentCount = dateRecord.students.filter(s => s.status === 'absent').length;
// //               const attendancePercentage = totalStudents > 0 
// //                 ? Math.round((presentCount / totalStudents) * 100) 
// //                 : 0;
              
// //               allHistory.push({
// //                 id: `${dateRecord.classId}-${dateRecord.date}`,
// //                 date: dateRecord.date,
// //                 className: dateRecord.className,
// //                 classId: dateRecord.classId,
// //                 totalStudents,
// //                 presentCount,
// //                 absentCount,
// //                 attendancePercentage,
// //                 markedBy: "Teacher",
// //                 markedAt: dateRecord.date,
// //                 students: dateRecord.students
// //               });
// //             });
// //           }
// //         } catch (error) {
// //           console.error(`Failed to load attendance for class ${cls.id}:`, error);
// //         }
// //       }
      
// //       // Sort by date (most recent first)
// //       allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      
// //       setAttendanceHistory(allHistory);
      
// //       if (allHistory.length === 0) {
// //         setMessage({ 
// //           type: "info", 
// //           text: "No attendance records found. Start marking attendance to see history." 
// //         });
// //         setTimeout(() => setMessage({ type: "", text: "" }), 3000);
// //       }
// //     } catch (error) {
// //       console.error('Failed to load attendance history:', error);
// //       setMessage({ 
// //         type: "error", 
// //         text: "Failed to load attendance history. Please try again." 
// //       });
// //       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadFromLocalStorage = () => {
// //     const savedAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    
// //     if (savedAttendance.length > 0) {
// //       // Map localStorage data to expected format
// //       const mappedData = savedAttendance.map(record => ({
// //         id: record.id,
// //         date: record.date,
// //         className: record.className,
// //         classId: record.classId,
// //         totalStudents: record.totalStudents,
// //         presentCount: record.presentCount,
// //         absentCount: record.absentCount,
// //         attendancePercentage: record.attendancePercentage,
// //         markedBy: "Teacher",
// //         markedAt: record.markedAt,
// //         students: record.records?.map(r => {
// //           const student = students.find(s => s.id === r.studentId);
// //           return {
// //             name: student?.name || `Student ${r.studentId}`,
// //             enrollmentNo: student?.enrollmentNo || r.studentId,
// //             status: r.status
// //           };
// //         }) || []
// //       }));
      
// //       setAttendanceHistory(mappedData);
// //       setMessage({ 
// //         type: "info", 
// //         text: "Showing locally saved attendance records. Backend API not available." 
// //       });
// //       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
// //     } else {
// //       // Use mock data if no local data
// //       setAttendanceHistory(getMockAttendanceHistory());
// //       setMessage({ 
// //         type: "info", 
// //         text: "Showing sample data. No attendance records found." 
// //       });
// //       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
// //     }
// //   };

// //   // Mock data generator for fallback
// //   const getMockAttendanceHistory = () => {
// //     const mockData = [];
// //     const today = new Date();
    
// //     for (let i = 0; i < 10; i++) {
// //       const date = new Date(today);
// //       date.setDate(date.getDate() - i);
      
// //       const totalStudents = 30 + Math.floor(Math.random() * 10);
// //       const presentCount = Math.floor(totalStudents * (0.7 + Math.random() * 0.25));
// //       const absentCount = totalStudents - presentCount;
// //       const attendancePercentage = Math.round((presentCount / totalStudents) * 100);
      
// //       mockData.push({
// //         id: `mock-${i}`,
// //         date: date.toISOString().split('T')[0],
// //         className: `Class ${7 + (i % 3)}-${String.fromCharCode(65 + (i % 3))}`,
// //         classId: `class-${i % 3}`,
// //         totalStudents,
// //         presentCount,
// //         absentCount,
// //         attendancePercentage,
// //         markedBy: "Teacher",
// //         markedAt: date.toISOString(),
// //         students: Array.from({ length: totalStudents }, (_, idx) => ({
// //           name: `Student ${idx + 1}`,
// //           enrollmentNo: `2024${String(idx + 1).padStart(3, '0')}`,
// //           status: idx < presentCount ? 'present' : 'absent'
// //         }))
// //       });
// //     }
    
// //     return mockData;
// //   };

// //   const applyFilters = () => {
// //     let filtered = [...attendanceHistory];

// //     // Filter by class
// //     if (filters.classId) {
// //       filtered = filtered.filter(record => record.classId === filters.classId);
// //     }

// //     // Filter by date range
// //     if (filters.startDate) {
// //       filtered = filtered.filter(record => record.date >= filters.startDate);
// //     }
// //     if (filters.endDate) {
// //       filtered = filtered.filter(record => record.date <= filters.endDate);
// //     }

// //     // Filter by search query
// //     if (filters.searchQuery) {
// //       const query = filters.searchQuery.toLowerCase();
// //       filtered = filtered.filter(record => 
// //         record.className?.toLowerCase().includes(query) ||
// //         record.date?.includes(query)
// //       );
// //     }

// //     setFilteredHistory(filtered);
// //   };

// //   const handleFilterChange = (e) => {
// //     const { name, value } = e.target;
// //     setFilters(prev => ({ ...prev, [name]: value }));
// //   };

// //   const clearFilters = () => {
// //     setFilters({
// //       classId: "",
// //       startDate: "",
// //       endDate: "",
// //       searchQuery: ""
// //     });
// //   };

// //   const viewDetails = (record) => {
// //     setSelectedRecord(record);
// //     setShowDetailsModal(true);
// //   };

// //   const exportToExcel = () => {
// //     try {
// //       const exportData = filteredHistory.map(record => ({
// //         "Date": record.date,
// //         "Class": record.className,
// //         "Total Students": record.totalStudents,
// //         "Present": record.presentCount,
// //         "Absent": record.absentCount,
// //         "Attendance %": record.attendancePercentage + "%",
// //         "Marked By": record.markedBy,
// //         "Marked At": new Date(record.markedAt).toLocaleString()
// //       }));

// //       const worksheet = XLSX.utils.json_to_sheet(exportData);
// //       const workbook = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");

// //       worksheet['!cols'] = [
// //         { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 10 },
// //         { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 20 }
// //       ];

// //       XLSX.writeFile(workbook, `attendance_history_${new Date().toISOString().split('T')[0]}.xlsx`);
// //       setMessage({ type: "success", text: "Attendance history exported successfully!" });
// //       setTimeout(() => setMessage({ type: "", text: "" }), 2000);
// //     } catch (error) {
// //       console.error('Export error:', error);
// //       setMessage({ type: "error", text: "Failed to export data" });
// //     }
// //   };

// //   const getAttendanceColor = (percentage) => {
// //     if (percentage >= 90) return "text-green-600 bg-green-50";
// //     if (percentage >= 75) return "text-blue-600 bg-blue-50";
// //     if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
// //     return "text-red-600 bg-red-50";
// //   };

// //   return (
// //     <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
// //       <div className="max-w-7xl mx-auto">
        
// //         {/* Header */}
// //         <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //           <div>
// //             <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Attendance History</h1>
// //             <p className="text-xs md:text-sm text-gray-500 mt-1">View and manage your attendance records</p>
// //           </div>
// //           <button
// //             onClick={exportToExcel}
// //             disabled={filteredHistory.length === 0}
// //             className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             <FaDownload />
// //             Export to Excel
// //           </button>
// //         </div>

// //         {/* Message */}
// //         {message.text && (
// //           <div className={`mb-4 p-3 rounded-lg text-sm ${
// //             message.type === "success" 
// //               ? "bg-green-50 text-green-700 border border-green-200" 
// //               : "bg-red-50 text-red-700 border border-red-200"
// //           }`}>
// //             {message.text}
// //           </div>
// //         )}

// //         {/* Filters */}
// //         <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
// //           <div className="flex items-center gap-2 mb-4">
// //             <FaFilter className="text-gray-500" />
// //             <h2 className="text-sm font-medium text-gray-900">Filters</h2>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //             {/* Search */}
// //             <div>
// //               <label className="block text-xs font-medium text-gray-700 mb-1">
// //                 Search
// //               </label>
// //               <div className="relative">
// //                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
// //                 <input
// //                   type="text"
// //                   name="searchQuery"
// //                   value={filters.searchQuery}
// //                   onChange={handleFilterChange}
// //                   placeholder="Search by class or date..."
// //                   className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //             </div>

// //             {/* Class Filter */}
// //             <div>
// //               <label className="block text-xs font-medium text-gray-700 mb-1">
// //                 Class
// //               </label>
// //               <select
// //                 name="classId"
// //                 value={filters.classId}
// //                 onChange={handleFilterChange}
// //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               >
// //                 <option value="">All Classes</option>
// //                 {classes.map(cls => (
// //                   <option key={cls.id} value={cls.id}>
// //                     {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Start Date */}
// //             <div>
// //               <label className="block text-xs font-medium text-gray-700 mb-1">
// //                 From Date
// //               </label>
// //               <input
// //                 type="date"
// //                 name="startDate"
// //                 value={filters.startDate}
// //                 onChange={handleFilterChange}
// //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>

// //             {/* End Date */}
// //             <div>
// //               <label className="block text-xs font-medium text-gray-700 mb-1">
// //                 To Date
// //               </label>
// //               <input
// //                 type="date"
// //                 name="endDate"
// //                 value={filters.endDate}
// //                 onChange={handleFilterChange}
// //                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //             </div>
// //           </div>

// //           <div className="mt-4 flex justify-end">
// //             <button
// //               onClick={clearFilters}
// //               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
// //             >
// //               Clear Filters
// //             </button>
// //           </div>
// //         </div>

// //         {/* Attendance History Table */}
// //         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
// //           {loading ? (
// //             <div className="text-center py-12">
// //               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //               <p className="text-sm text-gray-500 mt-2">Loading attendance history...</p>
// //             </div>
// //           ) : filteredHistory.length === 0 ? (
// //             <div className="text-center py-12">
// //               <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
// //               <p className="text-sm text-gray-500">No attendance records found</p>
// //               <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or add new attendance records</p>
// //             </div>
// //           ) : (
// //             <>
// //               <div className="overflow-x-auto">
// //                 <table className="w-full">
// //                   <thead className="bg-gray-50 border-b border-gray-200">
// //                     <tr>
// //                       <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
// //                       <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
// //                       <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total Students</th>
// //                       <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Present</th>
// //                       <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Absent</th>
// //                       <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Attendance %</th>
// //                       <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="divide-y divide-gray-200">
// //                     {filteredHistory.map((record, index) => (
// //                       <tr key={index} className="hover:bg-gray-50">
// //                         <td className="px-4 py-3 text-sm text-gray-900">
// //                           {new Date(record.date).toLocaleDateString('en-US', { 
// //                             year: 'numeric', 
// //                             month: 'short', 
// //                             day: 'numeric' 
// //                           })}
// //                         </td>
// //                         <td className="px-4 py-3 text-sm text-gray-900">{record.className}</td>
// //                         <td className="px-4 py-3 text-sm text-center text-gray-900">{record.totalStudents}</td>
// //                         <td className="px-4 py-3 text-sm text-center">
// //                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
// //                             {record.presentCount}
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3 text-sm text-center">
// //                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
// //                             {record.absentCount}
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3 text-sm text-center">
// //                           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(record.attendancePercentage)}`}>
// //                             {record.attendancePercentage}%
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3 text-sm text-center">
// //                           <button
// //                             onClick={() => viewDetails(record)}
// //                             className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
// //                           >
// //                             <FaEye />
// //                             View
// //                           </button>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               {/* Pagination Info */}
// //               <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
// //                 Showing {filteredHistory.length} record{filteredHistory.length !== 1 ? 's' : ''}
// //               </div>
// //             </>
// //           )}
// //         </div>

// //         {/* Details Modal */}
// //         {showDetailsModal && selectedRecord && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// //               <div className="p-6">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <h3 className="text-lg font-semibold text-gray-900">Attendance Details</h3>
// //                   <button
// //                     onClick={() => setShowDetailsModal(false)}
// //                     className="text-gray-400 hover:text-gray-600"
// //                   >
// //                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                     </svg>
// //                   </button>
// //                 </div>

// //                 <div className="space-y-4">
// //                   {/* Summary */}
// //                   <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
// //                     <div>
// //                       <p className="text-xs text-gray-500">Date</p>
// //                       <p className="text-sm font-medium text-gray-900">
// //                         {new Date(selectedRecord.date).toLocaleDateString('en-US', { 
// //                           year: 'numeric', 
// //                           month: 'long', 
// //                           day: 'numeric' 
// //                         })}
// //                       </p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-500">Class</p>
// //                       <p className="text-sm font-medium text-gray-900">{selectedRecord.className}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-500">Total Students</p>
// //                       <p className="text-sm font-medium text-gray-900">{selectedRecord.totalStudents}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-500">Attendance Rate</p>
// //                       <p className={`text-sm font-medium ${getAttendanceColor(selectedRecord.attendancePercentage).split(' ')[0]}`}>
// //                         {selectedRecord.attendancePercentage}%
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {/* Student List */}
// //                   {selectedRecord.students && selectedRecord.students.length > 0 && (
// //                     <div>
// //                       <h4 className="text-sm font-medium text-gray-900 mb-2">Student Attendance</h4>
// //                       <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                         <table className="w-full text-sm">
// //                           <thead className="bg-gray-50">
// //                             <tr>
// //                               <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Student Name</th>
// //                               <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Enrollment No</th>
// //                               <th className="text-center px-3 py-2 text-xs font-medium text-gray-500">Status</th>
// //                             </tr>
// //                           </thead>
// //                           <tbody className="divide-y divide-gray-200">
// //                             {selectedRecord.students.map((student, idx) => (
// //                               <tr key={idx}>
// //                                 <td className="px-3 py-2 text-gray-900">{student.name}</td>
// //                                 <td className="px-3 py-2 text-gray-600">{student.enrollmentNo}</td>
// //                                 <td className="px-3 py-2 text-center">
// //                                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
// //                                     student.status === 'present' 
// //                                       ? 'bg-green-50 text-green-700' 
// //                                       : 'bg-red-50 text-red-700'
// //                                   }`}>
// //                                     {student.status === 'present' ? 'Present' : 'Absent'}
// //                                   </span>
// //                                 </td>
// //                               </tr>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Marked By Info */}
// //                   <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
// //                     <p>Marked by: {selectedRecord.markedBy}</p>
// //                     <p>Marked at: {new Date(selectedRecord.markedAt).toLocaleString()}</p>
// //                   </div>
// //                 </div>

// //                 <div className="mt-6 flex justify-end">
// //                   <button
// //                     onClick={() => setShowDetailsModal(false)}
// //                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
// //                   >
// //                     Close
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // }



















// import { useState, useEffect } from "react";
// import { FaCalendarAlt, FaFilter, FaDownload, FaEye, FaSearch, FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import apiService from "../../services/apiService";

// const HORIZON_STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

//   :root {
//     --primary-blue: #1a6fb5;
//     --gray: #6b7a8d;
//     --light-bg: #f5f8fb;
//     --white: #ffffff;
//     --text-dark: #1e2c3a;
//     --font-heading: 'DM Serif Display', serif;
//     --font-body: 'DM Sans', sans-serif;
//   }

//   .horizon-input {
//     border: 1.5px solid rgba(26, 111, 181, 0.2);
//     border-radius: 8px;
//     background: var(--white);
//     color: var(--text-dark);
//     transition: all 0.2s ease;
//     font-family: var(--font-body);
//   }
//   .horizon-input:focus {
//     border-color: var(--primary-blue);
//     box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
//     outline: none;
//   }

//   .horizon-btn-primary {
//     background: var(--primary-blue);
//     color: var(--white);
//     border: none;
//     border-radius: 8px;
//     font-weight: 600;
//     transition: all 0.25s ease;
//     box-shadow: 0 2px 8px rgba(26, 111, 181, 0.15);
//     font-family: var(--font-body);
//   }
//   .horizon-btn-primary:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 16px rgba(26, 111, 181, 0.25);
//   }

//   .horizon-btn-secondary {
//     background: transparent;
//     color: var(--primary-blue);
//     border: 1.5px solid var(--primary-blue);
//     border-radius: 8px;
//     font-weight: 600;
//     transition: all 0.25s ease;
//     font-family: var(--font-body);
//   }
//   .horizon-btn-secondary:hover {
//     background: rgba(26, 111, 181, 0.06);
//     transform: translateY(-2px);
//   }

//   .fade-in { animation: fadeIn 0.35s ease-out; }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// `;

// export default function AttendanceHistoryPage() {
//   const [attendanceHistory, setAttendanceHistory] = useState([]);
//   const [filteredHistory, setFilteredHistory] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
  
//   const [filters, setFilters] = useState({
//     classId: "",
//     startDate: "",
//     endDate: "",
//     searchQuery: ""
//   });

//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   useEffect(() => {
//     loadClasses();
//     loadAttendanceHistory();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [filters, attendanceHistory]);

//   const loadClasses = async () => {
//     try {
//       const result = await apiService.getMyClasses();
//       if (result.success) setClasses(result.classes || []);
//     } catch (error) {
//       console.error('Failed to load classes:', error);
//     }
//   };

//   const loadAttendanceHistory = async () => {
//     setLoading(true);
//     try {
//       const classesResult = await apiService.getMyClasses();
//       if (!classesResult.success) throw new Error('Failed to load classes');

//       const allHistory = [];
      
//       for (const cls of classesResult.classes || []) {
//         try {
//           const endDate = new Date().toISOString().split('T')[0];
//           const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
//           const response = await apiService.getClassAttendance(cls.id, { startDate, endDate });
          
//           if (response.success && response.attendance) {
//             const byDate = {};
//             response.attendance.forEach(record => {
//               if (!byDate[record.date]) {
//                 byDate[record.date] = {
//                   date: record.date,
//                   classId: cls.id,
//                   className: cls.name,
//                   students: []
//                 };
//               }
//               byDate[record.date].students.push({
//                 name: record.studentName,
//                 enrollmentNo: record.enrollmentNo,
//                 status: record.status
//               });
//             });
            
//             Object.values(byDate).forEach(dateRecord => {
//               const totalStudents = dateRecord.students.length;
//               const presentCount = dateRecord.students.filter(s => s.status === 'present').length;
//               const absentCount = dateRecord.students.filter(s => s.status === 'absent').length;
//               const attendancePercentage = totalStudents > 0 
//                 ? Math.round((presentCount / totalStudents) * 100) 
//                 : 0;
              
//               allHistory.push({
//                 id: `${dateRecord.classId}-${dateRecord.date}`,
//                 date: dateRecord.date,
//                 className: dateRecord.className,
//                 classId: dateRecord.classId,
//                 totalStudents,
//                 presentCount,
//                 absentCount,
//                 attendancePercentage,
//                 markedBy: "Teacher",
//                 markedAt: dateRecord.date,
//                 students: dateRecord.students
//               });
//             });
//           }
//         } catch (error) {
//           console.error(`Failed to load attendance for class ${cls.id}:`, error);
//         }
//       }
      
//       allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
//       setAttendanceHistory(allHistory);
      
//       if (allHistory.length === 0) {
//         setMessage({ type: "info", text: "No attendance records found. Start marking attendance to see history." });
//         setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//       }
//     } catch (error) {
//       console.error('Failed to load attendance history:', error);
//       setMessage({ type: "error", text: "Failed to load attendance history. Please try again." });
//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...attendanceHistory];
//     if (filters.classId) filtered = filtered.filter(record => record.classId === filters.classId);
//     if (filters.startDate) filtered = filtered.filter(record => record.date >= filters.startDate);
//     if (filters.endDate) filtered = filtered.filter(record => record.date <= filters.endDate);
//     if (filters.searchQuery) {
//       const query = filters.searchQuery.toLowerCase();
//       filtered = filtered.filter(record => 
//         record.className?.toLowerCase().includes(query) || record.date?.includes(query)
//       );
//     }
//     setFilteredHistory(filtered);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({ classId: "", startDate: "", endDate: "", searchQuery: "" });
//   };

//   const viewDetails = (record) => {
//     setSelectedRecord(record);
//     setShowDetailsModal(true);
//   };

//   const exportToExcel = () => {
//     try {
//       const exportData = filteredHistory.map(record => ({
//         "Date": record.date,
//         "Class": record.className,
//         "Total Students": record.totalStudents,
//         "Present": record.presentCount,
//         "Absent": record.absentCount,
//         "Attendance %": record.attendancePercentage + "%"
//       }));

//       const worksheet = XLSX.utils.json_to_sheet(exportData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");
//       worksheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
//       XLSX.writeFile(workbook, `attendance_history_${new Date().toISOString().split('T')[0]}.xlsx`);
//       setMessage({ type: "success", text: "✓ Attendance history exported successfully!" });
//       setTimeout(() => setMessage({ type: "", text: "" }), 2000);
//     } catch (error) {
//       console.error('Export error:', error);
//       setMessage({ type: "error", text: "Failed to export data" });
//     }
//   };

//   const getAttendanceColor = (percentage) => {
//     if (percentage >= 90) return "text-green-600 bg-green-50";
//     if (percentage >= 75) return "text-blue-600 bg-blue-50";
//     if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
//     return "text-red-600 bg-red-50";
//   };

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />
      
//       <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f8fb]">
//         <div className="pt-24 md:pt-20 px-4 md:px-6 py-8">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header */}
//             <div className="mb-8">
//               <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
//                 Attendance History
//               </h1>
//               <p className="text-sm md:text-base" style={{ color: 'var(--gray)' }}>
//                 View and manage your attendance records
//               </p>
//             </div>

//             {/* Message Alert */}
//             {message.text && (
//               <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 fade-in ${
//                 message.type === "success" 
//                   ? "bg-green-50 text-green-700 border border-green-200" 
//                   : message.type === "info"
//                   ? "bg-blue-50 text-blue-700 border border-blue-200"
//                   : "bg-red-50 text-red-700 border border-red-200"
//               }`}>
//                 {message.type === "success" && <FaCheckCircle className="mt-0.5 flex-shrink-0 text-lg" />}
//                 {message.type === "error" && <FaExclamationTriangle className="mt-0.5 flex-shrink-0 text-lg" />}
//                 <span>{message.text}</span>
//               </div>
//             )}

//             {/* Export Button */}
//             <div className="mb-6 flex justify-end">
//               <button
//                 onClick={exportToExcel}
//                 disabled={filteredHistory.length === 0}
//                 className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
//               >
//                 <FaDownload className="text-xs" />
//                 Export to Excel
//               </button>
//             </div>

//             {/* Filters */}
//             <div className="mb-8 p-6 rounded-lg border" style={{ background: 'var(--white)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
//               <div className="flex items-center gap-2 mb-5">
//                 <FaFilter style={{ color: 'var(--primary-blue)' }} />
//                 <h2 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Filters</h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
//                 <div>
//                   <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>Search</label>
//                   <div className="relative">
//                     <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--gray)' }} />
//                     <input
//                       type="text"
//                       name="searchQuery"
//                       value={filters.searchQuery}
//                       onChange={handleFilterChange}
//                       placeholder="Search by class or date..."
//                       className="w-full pl-9 pr-4 py-2.5 text-sm horizon-input"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>Class</label>
//                   <select
//                     name="classId"
//                     value={filters.classId}
//                     onChange={handleFilterChange}
//                     className="w-full px-4 py-2.5 text-sm horizon-input"
//                   >
//                     <option value="">All Classes</option>
//                     {classes.map(cls => (
//                       <option key={cls.id} value={cls.id}>
//                         {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>From Date</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={filters.startDate}
//                     onChange={handleFilterChange}
//                     className="w-full px-4 py-2.5 text-sm horizon-input"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>To Date</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={filters.endDate}
//                     onChange={handleFilterChange}
//                     className="w-full px-4 py-2.5 text-sm horizon-input"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <button onClick={clearFilters} className="horizon-btn-secondary px-6 py-2 text-sm">
//                   Clear Filters
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(26, 111, 181, 0.12)', background: 'var(--white)' }}>
//               {loading ? (
//                 <div className="text-center py-16">
//                   <FaSpinner className="animate-spin text-4xl mx-auto mb-3" style={{ color: 'var(--primary-blue)' }} />
//                   <p className="text-sm" style={{ color: 'var(--gray)' }}>Loading...</p>
//                 </div>
//               ) : filteredHistory.length === 0 ? (
//                 <div className="text-center py-16">
//                   <FaCalendarAlt className="mx-auto text-6xl mb-4" style={{ color: 'rgba(26, 111, 181, 0.1)' }} />
//                   <p className="text-sm" style={{ color: 'var(--gray)' }}>No attendance records found</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
//                         <tr>
//                           <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Date</th>
//                           <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Class</th>
//                           <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Total</th>
//                           <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Present</th>
//                           <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Absent</th>
//                           <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Attendance %</th>
//                           <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredHistory.map((record, index) => (
//                           <tr
//                             key={index}
//                             style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)', transition: 'background-color 0.15s ease' }}
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 111, 181, 0.03)'}
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                           >
//                             <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-dark)' }}>
//                               {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
//                             </td>
//                             <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-dark)' }}>{record.className}</td>
//                             <td className="px-6 py-4 text-sm text-center" style={{ color: 'var(--text-dark)' }}>{record.totalStudents}</td>
//                             <td className="px-6 py-4 text-center">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
//                                 {record.presentCount}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-center">
//                               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
//                                 {record.absentCount}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-center">
//                               <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getAttendanceColor(record.attendancePercentage)}`}>
//                                 {record.attendancePercentage}%
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-center">
//                               <button
//                                 onClick={() => viewDetails(record)}
//                                 className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all hover:-translate-y-0.5"
//                                 style={{ color: 'var(--primary-blue)', background: 'rgba(26, 111, 181, 0.08)' }}
//                               >
//                                 <FaEye className="text-xs" />
//                                 View
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="px-6 py-3 text-xs" style={{ background: 'var(--light-bg)', borderTop: '1px solid rgba(26, 111, 181, 0.08)', color: 'var(--gray)' }}>
//                     Showing {filteredHistory.length} record{filteredHistory.length !== 1 ? 's' : ''}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Modal */}
//             {showDetailsModal && selectedRecord && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                 <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}>
//                   <div className="p-6 md:p-8 border-b" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
//                         Attendance Details
//                       </h3>
//                       <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 text-2xl">×</button>
//                     </div>
//                   </div>

//                   <div className="p-6 md:p-8 space-y-6">
//                     <div className="grid grid-cols-2 gap-4 p-4 rounded-lg" style={{ background: 'var(--light-bg)' }}>
//                       <div>
//                         <p className="text-xs" style={{ color: 'var(--gray)' }}>Date</p>
//                         <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>
//                           {new Date(selectedRecord.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs" style={{ color: 'var(--gray)' }}>Class</p>
//                         <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{selectedRecord.className}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs" style={{ color: 'var(--gray)' }}>Total Students</p>
//                         <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{selectedRecord.totalStudents}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs" style={{ color: 'var(--gray)' }}>Rate</p>
//                         <p className={`text-sm font-semibold mt-2 ${getAttendanceColor(selectedRecord.attendancePercentage).split(' ')[0]}`}>
//                           {selectedRecord.attendancePercentage}%
//                         </p>
//                       </div>
//                     </div>

//                     {selectedRecord.students && selectedRecord.students.length > 0 && (
//                       <div>
//                         <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>Student Attendance</h4>
//                         <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
//                           <div className="overflow-y-auto max-h-80">
//                             <table className="w-full text-sm">
//                               <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
//                                 <tr>
//                                   <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Name</th>
//                                   <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Enrollment</th>
//                                   <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Status</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {selectedRecord.students.map((student, idx) => (
//                                   <tr key={idx} style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)' }}>
//                                     <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>{student.name}</td>
//                                     <td className="px-4 py-3" style={{ color: 'var(--gray)' }}>{student.enrollmentNo}</td>
//                                     <td className="px-4 py-3 text-center">
//                                       <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
//                                         student.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//                                       }`}>
//                                         {student.status === 'present' ? 'Present' : 'Absent'}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     <div className="pt-4 border-t" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
//                       <p className="text-xs" style={{ color: 'var(--gray)' }}>Marked by: <span style={{ color: 'var(--text-dark)' }} className="font-medium">{selectedRecord.markedBy}</span></p>
//                     </div>
//                   </div>

//                   <div className="p-6 md:p-8 border-t flex justify-end" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
//                     <button onClick={() => setShowDetailsModal(false)} className="horizon-btn-secondary px-6 py-2 text-sm">
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



















import { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaDownload, FaEye, FaSearch, FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiService from "../../services/apiService";

const HORIZON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --primary-blue: #1a6fb5;
    --gray: #6b7a8d;
    --light-bg: #f5f8fb;
    --white: #ffffff;
    --text-dark: #1e2c3a;
    --font-heading: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  .horizon-input {
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    background: var(--white);
    color: var(--text-dark);
    transition: all 0.2s ease;
    font-family: var(--font-body);
  }
  .horizon-input:focus {
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(26, 111, 181, 0.08);
    outline: none;
  }

  .horizon-btn-primary {
    background: var(--primary-blue);
    color: var(--white);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(26, 111, 181, 0.15);
    font-family: var(--font-body);
  }
  .horizon-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(26, 111, 181, 0.25);
  }

  .horizon-btn-secondary {
    background: transparent;
    color: var(--primary-blue);
    border: 1.5px solid var(--primary-blue);
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.25s ease;
    font-family: var(--font-body);
  }
  .horizon-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.06);
    transform: translateY(-2px);
  }

  .fade-in { animation: fadeIn 0.35s ease-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-backdrop {
    animation: backdropFadeIn 0.2s ease-out;
  }

  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    animation: modalSlideUp 0.3s ease-out;
  }

  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function AttendanceHistoryPage() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [filters, setFilters] = useState({
    classId: "",
    startDate: "",
    endDate: "",
    searchQuery: ""
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadClasses();
    loadAttendanceHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, attendanceHistory]);

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      if (result.success) setClasses(result.classes || []);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadAttendanceHistory = async () => {
    setLoading(true);
    try {
      const classesResult = await apiService.getMyClasses();
      if (!classesResult.success) throw new Error('Failed to load classes');

      const allHistory = [];
      
      for (const cls of classesResult.classes || []) {
        try {
          const endDate = new Date().toISOString().split('T')[0];
          const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          const response = await apiService.getClassAttendance(cls.id, { startDate, endDate });
          
          if (response.success && response.attendance) {
            const byDate = {};
            response.attendance.forEach(record => {
              if (!byDate[record.date]) {
                byDate[record.date] = {
                  date: record.date,
                  classId: cls.id,
                  className: cls.name,
                  students: []
                };
              }
              byDate[record.date].students.push({
                name: record.studentName,
                enrollmentNo: record.enrollmentNo,
                status: record.status
              });
            });
            
            Object.values(byDate).forEach(dateRecord => {
              const totalStudents = dateRecord.students.length;
              const presentCount = dateRecord.students.filter(s => s.status === 'present').length;
              const absentCount = dateRecord.students.filter(s => s.status === 'absent').length;
              const attendancePercentage = totalStudents > 0 
                ? Math.round((presentCount / totalStudents) * 100) 
                : 0;
              
              allHistory.push({
                id: `${dateRecord.classId}-${dateRecord.date}`,
                date: dateRecord.date,
                className: dateRecord.className,
                classId: dateRecord.classId,
                totalStudents,
                presentCount,
                absentCount,
                attendancePercentage,
                markedBy: "Teacher",
                markedAt: dateRecord.date,
                students: dateRecord.students
              });
            });
          }
        } catch (error) {
          console.error(`Failed to load attendance for class ${cls.id}:`, error);
        }
      }
      
      allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAttendanceHistory(allHistory);
      
      if (allHistory.length === 0) {
        setMessage({ type: "info", text: "No attendance records found. Start marking attendance to see history." });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error('Failed to load attendance history:', error);
      setMessage({ type: "error", text: "Failed to load attendance history. Please try again." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceHistory];
    if (filters.classId) filtered = filtered.filter(record => record.classId === filters.classId);
    if (filters.startDate) filtered = filtered.filter(record => record.date >= filters.startDate);
    if (filters.endDate) filtered = filtered.filter(record => record.date <= filters.endDate);
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.className?.toLowerCase().includes(query) || record.date?.includes(query)
      );
    }
    setFilteredHistory(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ classId: "", startDate: "", endDate: "", searchQuery: "" });
  };

  const viewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setTimeout(() => setSelectedRecord(null), 300);
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredHistory.map(record => ({
        "Date": record.date,
        "Class": record.className,
        "Total Students": record.totalStudents,
        "Present": record.presentCount,
        "Absent": record.absentCount,
        "Attendance %": record.attendancePercentage + "%"
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");
      worksheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
      XLSX.writeFile(workbook, `attendance_history_${new Date().toISOString().split('T')[0]}.xlsx`);
      setMessage({ type: "success", text: "✓ Attendance history exported successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: "error", text: "Failed to export data" });
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 75) return "text-blue-600 bg-blue-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f8fb]">
        <div className="pt-24 md:pt-20 px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
                Attendance History
              </h1>
              <p className="text-sm md:text-base" style={{ color: 'var(--gray)' }}>
                View and manage your attendance records
              </p>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 fade-in ${
                message.type === "success" 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : message.type === "info"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message.type === "success" && <FaCheckCircle className="mt-0.5 flex-shrink-0 text-lg" />}
                {message.type === "error" && <FaExclamationTriangle className="mt-0.5 flex-shrink-0 text-lg" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Export Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={exportToExcel}
                disabled={filteredHistory.length === 0}
                className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
              >
                <FaDownload className="text-xs" />
                Export to Excel
              </button>
            </div>

            {/* Filters */}
            <div className="mb-8 p-6 rounded-lg border" style={{ background: 'var(--white)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
              <div className="flex items-center gap-2 mb-5">
                <FaFilter style={{ color: 'var(--primary-blue)' }} />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Filters</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--gray)' }} />
                    <input
                      type="text"
                      name="searchQuery"
                      value={filters.searchQuery}
                      onChange={handleFilterChange}
                      placeholder="Search by class or date..."
                      className="w-full pl-9 pr-4 py-2.5 text-sm horizon-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>Class</label>
                  <select
                    name="classId"
                    value={filters.classId}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 text-sm horizon-input"
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>From Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 text-sm horizon-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>To Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 text-sm horizon-input"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={clearFilters} className="horizon-btn-secondary px-6 py-2 text-sm">
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(26, 111, 181, 0.12)', background: 'var(--white)' }}>
              {loading ? (
                <div className="text-center py-16">
                  <FaSpinner className="animate-spin text-4xl mx-auto mb-3" style={{ color: 'var(--primary-blue)' }} />
                  <p className="text-sm" style={{ color: 'var(--gray)' }}>Loading...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-16">
                  <FaCalendarAlt className="mx-auto text-6xl mb-4" style={{ color: 'rgba(26, 111, 181, 0.1)' }} />
                  <p className="text-sm" style={{ color: 'var(--gray)' }}>No attendance records found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                        <tr>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Date</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Class</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Total</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Present</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Absent</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Attendance %</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.map((record, index) => (
                          <tr
                            key={index}
                            style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)', transition: 'background-color 0.15s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 111, 181, 0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                              {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-dark)' }}>{record.className}</td>
                            <td className="px-6 py-4 text-sm text-center" style={{ color: 'var(--text-dark)' }}>{record.totalStudents}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                                {record.presentCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                                {record.absentCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getAttendanceColor(record.attendancePercentage)}`}>
                                {record.attendancePercentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => viewDetails(record)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all hover:-translate-y-0.5"
                                style={{ color: 'var(--primary-blue)', background: 'rgba(26, 111, 181, 0.08)' }}
                              >
                                <FaEye className="text-xs" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 text-xs" style={{ background: 'var(--light-bg)', borderTop: '1px solid rgba(26, 111, 181, 0.08)', color: 'var(--gray)' }}>
                    Showing {filteredHistory.length} record{filteredHistory.length !== 1 ? 's' : ''}
                  </div>
                </>
              )}
            </div>

            {/* Improved Modal */}
            {showDetailsModal && selectedRecord && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 modal-backdrop"
                  onClick={closeModal}
                />
                
                {/* Modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                  <div 
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b p-6" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}>
                          Attendance Details
                        </h3>
                        <button 
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg" style={{ background: 'var(--light-bg)' }}>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--gray)' }}>Date</p>
                          <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>
                            {new Date(selectedRecord.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--gray)' }}>Class</p>
                          <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{selectedRecord.className}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--gray)' }}>Total Students</p>
                          <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{selectedRecord.totalStudents}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--gray)' }}>Rate</p>
                          <p className={`text-sm font-semibold mt-2 ${getAttendanceColor(selectedRecord.attendancePercentage).split(' ')[0]}`}>
                            {selectedRecord.attendancePercentage}%
                          </p>
                        </div>
                      </div>

                      {selectedRecord.students && selectedRecord.students.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>Student Attendance</h4>
                          <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                            <div className="overflow-y-auto max-h-80">
                              <table className="w-full text-sm">
                                <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                                  <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Name</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Enrollment</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedRecord.students.map((student, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)' }}>
                                      <td className="px-4 py-3" style={{ color: 'var(--text-dark)' }}>{student.name}</td>
                                      <td className="px-4 py-3" style={{ color: 'var(--gray)' }}>{student.enrollmentNo}</td>
                                      <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                          student.status === 'present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                          {student.status === 'present' ? 'Present' : 'Absent'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                        <p className="text-xs" style={{ color: 'var(--gray)' }}>Marked by: <span style={{ color: 'var(--text-dark)' }} className="font-medium">{selectedRecord.markedBy}</span></p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                      <button 
                        onClick={closeModal}
                        className="horizon-btn-secondary px-6 py-2 text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}