// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { FaSpinner, FaSearch, FaEye, FaFilter, FaUserGraduate } from "react-icons/fa";
// import apiService from "../../services/apiService";

// export default function StudentListPage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const classIdFromUrl = searchParams.get('class');

//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // Filters
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterClass, setFilterClass] = useState(classIdFromUrl || "all");
//   const [filterRisk, setFilterRisk] = useState("all");
//   const [groupBy, setGroupBy] = useState("none");

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

//   // Calculate risk level (placeholder - you can implement actual logic)
//   const getRiskLevel = (student) => {
//     // This is a placeholder. Implement your actual risk calculation logic
//     return student.riskLevel || 'low';
//   };

//   const getRiskBadge = (level) => {
//     const styles = {
//       high: 'bg-red-100 text-red-800 border-red-200',
//       medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       low: 'bg-green-100 text-green-800 border-green-200'
//     };
    
//     const labels = {
//       high: 'High Risk',
//       medium: 'Medium Risk',
//       low: 'Low Risk'
//     };

//     return (
//       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[level] || styles.low}`}>
//         {labels[level] || 'Low Risk'}
//       </span>
//     );
//   };

//   // Filter students
//   const filteredStudents = students.filter((student) => {
//     const name = String(student.name || "").toLowerCase();
//     const enrollmentNo = String(student.enrollmentNo || "").toLowerCase();
//     const searchValue = searchQuery.toLowerCase();

//     const matchesSearch =
//       name.includes(searchValue) || enrollmentNo.includes(searchValue);
//     const matchesClass = filterClass === "all" || student.classId === filterClass;
//     const matchesRisk = filterRisk === "all" || getRiskLevel(student) === filterRisk;
//     return matchesSearch && matchesClass && matchesRisk;
//   });

//   const classLabelById = classes.reduce((acc, cls) => {
//     const label = `${cls.name} - Grade ${cls.grade}${cls.section ? ` ${cls.section}` : ''}`;
//     acc[cls.id] = label;
//     return acc;
//   }, {});

//   const groupEntries = (() => {
//     if (groupBy === "none") {
//       return [["All Students", filteredStudents]];
//     }

//     const grouped = new Map();

//     filteredStudents.forEach((student) => {
//       const key = groupBy === "class"
//         ? (classLabelById[student.classId] || student.className || "Unassigned")
//         : (getRiskLevel(student) || "low");

//       if (!grouped.has(key)) {
//         grouped.set(key, []);
//       }
//       grouped.get(key).push(student);
//     });

//     return Array.from(grouped.entries());
//   })();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-3" />
//           <p className="text-sm text-gray-600">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 md:p-6 pt-20 md:pt-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <h3 className="text-red-800 font-medium mb-2">Error Loading Students</h3>
//           <p className="text-red-700 text-sm">{error}</p>
//           <button
//             onClick={loadData}
//             className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-4 md:mb-6">
//           <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Students</h1>
//           <p className="text-xs md:text-sm text-gray-500 mt-1">
//             {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
//           </p>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 mb-4 space-y-3">
//           {/* Search Bar */}
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//             <input
//               type="text"
//               placeholder="Search by name or enrollment number..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col lg:flex-row gap-2">
//             {/* Class Filter */}
//             <div className="flex-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 <FaFilter className="inline mr-1" />
//                 Filter by Class
//               </label>
//               <select
//                 value={filterClass}
//                 onChange={(e) => setFilterClass(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="all">All Classes</option>
//                 {classes.map(cls => (
//                   <option key={cls.id} value={cls.id}>
//                     {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Risk Filter */}
//             <div className="flex-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 <FaFilter className="inline mr-1" />
//                 Filter by Risk Level
//               </label>
//               <select
//                 value={filterRisk}
//                 onChange={(e) => setFilterRisk(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="all">All Risk Levels</option>
//                 <option value="high">High Risk</option>
//                 <option value="medium">Medium Risk</option>
//                 <option value="low">Low Risk</option>
//               </select>
//             </div>

//             {/* Group By */}
//             <div className="flex-1">
//               <label className="block text-xs font-medium text-gray-700 mb-1">
//                 <FaFilter className="inline mr-1" />
//                 Group By
//               </label>
//               <select
//                 value={groupBy}
//                 onChange={(e) => setGroupBy(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="none">No Grouping</option>
//                 <option value="class">Class</option>
//                 <option value="risk">Risk Level</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Students List */}
//         {filteredStudents.length > 0 ? (
//           <>
//             {groupEntries.map(([groupLabel, groupStudents]) => (
//               <div key={groupLabel} className="mb-4">
//                 {groupBy !== "none" && (
//                   <div className="mb-2 flex items-center justify-between">
//                     <h2 className="text-sm font-semibold text-gray-900">{groupLabel}</h2>
//                     <span className="text-xs text-gray-500">
//                       {groupStudents.length} student{groupStudents.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>
//                 )}

//                 {/* Desktop Table View */}
//                 <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                       <tr>
//                         <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                           Name
//                         </th>
//                         <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                           Enrollment No
//                         </th>
//                         <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                           Class
//                         </th>
//                         <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                           Risk Level
//                         </th>
//                         <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {groupStudents.map((student) => (
//                         <tr key={student.id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">
//                             <div className="flex items-center">
//                               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
//                                 <FaUserGraduate className="text-blue-600" />
//                               </div>
//                               <div>
//                                 <div className="text-sm font-medium text-gray-900">{student.name}</div>
//                                 {student.email && (
//                                   <div className="text-xs text-gray-500">{student.email}</div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="text-sm text-gray-600">{student.enrollmentNo}</div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="text-sm text-gray-600">{student.className || 'N/A'}</div>
//                             {student.section && (
//                               <div className="text-xs text-gray-500">Section {student.section}</div>
//                             )}
//                           </td>
//                           <td className="px-6 py-4">
//                             {getRiskBadge(getRiskLevel(student))}
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             <button
//                               onClick={() => navigate(`/students/${student.id}`)}
//                               className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
//                             >
//                               <FaEye className="text-xs" />
//                               View Profile
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Mobile Card View */}
//                 <div className="md:hidden space-y-3">
//                   {groupStudents.map((student) => (
//                     <div
//                       key={student.id}
//                       className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex items-center flex-1">
//                           <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
//                             <FaUserGraduate className="text-blue-600 text-lg" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className="text-sm font-semibold text-gray-900 truncate">
//                               {student.name}
//                             </h3>
//                             <p className="text-xs text-gray-500 truncate">{student.enrollmentNo}</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => navigate(`/students/${student.id}`)}
//                           className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
//                         >
//                           <FaEye />
//                         </button>
//                       </div>
                      
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between text-xs">
//                           <span className="text-gray-500">Class:</span>
//                           <span className="font-medium text-gray-900">{student.className || 'N/A'}</span>
//                         </div>
//                         <div className="flex items-center justify-between text-xs">
//                           <span className="text-gray-500">Risk Level:</span>
//                           {getRiskBadge(getRiskLevel(student))}
//                         </div>
//                         {student.contact && (
//                           <div className="flex items-center justify-between text-xs">
//                             <span className="text-gray-500">Contact:</span>
//                             <span className="font-medium text-gray-900">{student.contact}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </>
//         ) : (
//           <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 text-center">
//             <FaUserGraduate className="mx-auto text-4xl text-gray-300 mb-3" />
//             <p className="text-gray-500 mb-4">No students found</p>
//             <button
//               onClick={() => navigate('/add-student')}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
//             >
//               Add Students
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSpinner, FaSearch, FaEye, FaFilter, FaUserGraduate } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function StudentListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classIdFromUrl = searchParams.get('class');

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
        setStudents(studentsResult.students || []);
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

  // Calculate risk level (placeholder - you can implement actual logic)
  const getRiskLevel = (student) => {
    // This is a placeholder. Implement your actual risk calculation logic
    return student.riskLevel || 'low';
  };

  const getRiskBadge = (level) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    const labels = {
      high: 'High Risk',
      medium: 'Medium Risk',
      low: 'Low Risk'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[level] || styles.low}`}>
        {labels[level] || 'Low Risk'}
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
      return [["All Students", filteredStudents]];
    }

    const grouped = new Map();

    filteredStudents.forEach((student) => {
      const key = groupBy === "class"
        ? (classLabelById[student.classId] || student.className || "Unassigned")
        : (getRiskLevel(student) || "low");

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(student);
    });

    return Array.from(grouped.entries());
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 md:pt-20 px-4 md:px-6 pb-8 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Error Loading Students</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Retry
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
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Students</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 space-y-3 md:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-sm" />
            <input
              type="text"
              placeholder="Search by name or enrollment number..."
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
                Filter by Class
              </label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                <option value="all">All Classes</option>
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
                Filter by Risk Level
              </label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            {/* Group By */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <FaFilter className="inline mr-1 text-xs" />
                Group By
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
              >
                <option value="none">No Grouping</option>
                <option value="class">Class</option>
                <option value="risk">Risk Level</option>
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
                      {groupStudents.length} student{groupStudents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          Enrollment No
                        </th>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          Class
                        </th>
                        <th className="text-left px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          Risk Level
                        </th>
                        <th className="text-right px-4 md:px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                          Action
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
                            <div className="text-xs md:text-sm text-gray-600">{student.className || 'N/A'}</div>
                            {student.section && (
                              <div className="text-xs text-gray-500">Sec {student.section}</div>
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
                              <span className="hidden sm:inline">View</span>
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
                          title="View Profile"
                        >
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Class:</span>
                          <span className="font-medium text-gray-900">{student.className || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Risk Level:</span>
                          {getRiskBadge(getRiskLevel(student))}
                        </div>
                        {student.contact && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Contact:</span>
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
            <p className="text-gray-500 mb-4 text-sm md:text-base">No students found</p>
            <button
              onClick={() => navigate('/add-student')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Add Students
            </button>
          </div>
        )}
      </div>
    </div>
  );
}