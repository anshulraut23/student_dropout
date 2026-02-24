// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   FaSearch,
//   FaFileExport,
//   FaEye,
//   FaSortAmountDown,
//   FaSpinner,
// } from "react-icons/fa";
// import apiService from "../../services/apiService";

// export default function StudentListPage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const classIdFromUrl = searchParams.get('class');

//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("name");
//   const [filterClass, setFilterClass] = useState(classIdFromUrl || "all");

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (classIdFromUrl) {
//       setFilterClass(classIdFromUrl);
//     }
//   }, [classIdFromUrl]);

//   const loadData = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       // Load classes
//       const classesResult = await apiService.getMyClasses();
//       if (classesResult.success) {
//         setClasses(classesResult.classes || []);
//       }

//       // Load students
//       const studentsResult = await apiService.getStudents();
//       if (studentsResult.success) {
//         setStudents(studentsResult.students || []);
//       } else {
//         setError(studentsResult.error || 'Failed to load students');
//       }
//     } catch (err) {
//       console.error('Load data error:', err);
//       setError(err.message || 'Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter and sort students
//   let filteredStudents = students.filter((student) => {
//     const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          student.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesClass = filterClass === "all" || student.classId === filterClass;
//     return matchesSearch && matchesClass;
//   });

//   // Sort students
//   filteredStudents = [...filteredStudents].sort((a, b) => {
//     switch (sortBy) {
//       case "name":
//         return a.name.localeCompare(b.name);
//       case "class":
//         return (a.className || '').localeCompare(b.className || '');
//       case "enrollment":
//         return a.enrollmentNo.localeCompare(b.enrollmentNo);
//       default:
//         return 0;
//     }
//   });

//   // Export to CSV
//   const handleExport = () => {
//     const headers = ["Name", "Enrollment No", "Class", "Gender", "Contact", "Email"];
//     const rows = filteredStudents.map(student => [
//       student.name,
//       student.enrollmentNo,
//       student.className || '',
//       student.gender || '',
//       student.contact || '',
//       student.email || ''
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `students_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-3" />
//           <p className="text-sm text-gray-600">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-6 py-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
//               {filterClass !== "all" && ` in ${classes.find(c => c.id === filterClass)?.name || 'selected class'}`}
//             </p>
//           </div>
//           <button
//             onClick={handleExport}
//             disabled={filteredStudents.length === 0}
//             className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <FaFileExport className="text-sm" />
//             Export
//           </button>
//         </div>

//         {/* Search and Filters Bar */}
//         <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//               <input
//                 type="text"
//                 placeholder="Search by name or enrollment number..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Sort By */}
//             <div className="flex items-center gap-2">
//               <FaSortAmountDown className="text-gray-400 text-sm" />
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="name">Sort by Name</option>
//                 <option value="class">Sort by Class</option>
//                 <option value="enrollment">Sort by Enrollment No</option>
//               </select>
//             </div>

//             {/* Filter by Class */}
//             <select
//               value={filterClass}
//               onChange={(e) => setFilterClass(e.target.value)}
//               className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//             >
//               <option value="all">All Classes</option>
//               {classes.map(cls => (
//                 <option key={cls.id} value={cls.id}>
//                   {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//           {filteredStudents.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Enrollment No
//                     </th>
//                     <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Class
//                     </th>
//                     <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Gender
//                     </th>
//                     <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredStudents.map((student) => (
//                     <tr key={student.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-3">
//                         <div className="text-sm font-medium text-gray-900">{student.name}</div>
//                         {student.email && (
//                           <div className="text-xs text-gray-500">{student.email}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-3">
//                         <div className="text-sm text-gray-600">{student.enrollmentNo}</div>
//                       </td>
//                       <td className="px-6 py-3">
//                         <div className="text-sm text-gray-600">
//                           {student.className || 'N/A'}
//                         </div>
//                         {student.section && (
//                           <div className="text-xs text-gray-500">Section {student.section}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-3">
//                         <div className="text-sm text-gray-600">{student.gender || '-'}</div>
//                       </td>
//                       <td className="px-6 py-3">
//                         <div className="text-sm text-gray-600">{student.contact || '-'}</div>
//                         {student.parentContact && (
//                           <div className="text-xs text-gray-500">Parent: {student.parentContact}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-3 text-right">
//                         <button
//                           onClick={() => navigate(`/students/${student.id}`)}
//                           className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
//                         >
//                           <FaEye className="text-xs" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <FaSearch className="mx-auto text-3xl text-gray-300 mb-3" />
//               <p className="text-sm text-gray-500">No students found</p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {searchQuery || filterClass !== "all" 
//                   ? "Try adjusting your search or filters" 
//                   : "Add students to get started"}
//               </p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }
