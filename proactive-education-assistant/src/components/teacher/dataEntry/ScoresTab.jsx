// import { useState, useEffect } from "react";
// import { FaSpinner, FaCheck, FaEdit } from "react-icons/fa";
// import apiService from "../../../services/apiService";

// export default function ScoresTab() {
//   const [exams, setExams] = useState([]);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [isMarksEntered, setIsMarksEntered] = useState(false);
//   const [existingMarks, setExistingMarks] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [marksStats, setMarksStats] = useState(null);

//   useEffect(() => {
//     loadExams();
//   }, []);

//   useEffect(() => {
//     if (selectedExam) {
//       loadStudents();
//       checkExistingMarks();
//     }
//   }, [selectedExam]);

//   const checkExistingMarks = async () => {
//     if (!selectedExam) return;

//     try {
//       const result = await apiService.getMarksByExam(selectedExam.id);
      
//       if (result.success && result.marks && result.marks.length > 0) {
//         setIsMarksEntered(true);
//         setExistingMarks(result.marks);
//         setMarksStats(result.statistics);
//         console.log('Existing marks found:', result.marks.length);
//       } else {
//         setIsMarksEntered(false);
//         setExistingMarks([]);
//         setMarksStats(null);
//         console.log('No existing marks found');
//       }
//     } catch (error) {
//       console.error('Error checking existing marks:', error);
//       setIsMarksEntered(false);
//       setExistingMarks([]);
//     }
//   };

//   const loadExistingMarksForEdit = () => {
//     const marksMap = {};
//     existingMarks.forEach(mark => {
//       marksMap[mark.studentId] = {
//         obtainedMarks: mark.marksObtained || mark.marks_obtained || "",
//         remarks: mark.remarks || ""
//       };
//     });
//     setScores(marksMap);
//     setIsEditMode(true);
//     setIsMarksEntered(false); // Hide the banner when editing
//   };

//   const cancelEdit = () => {
//     setIsEditMode(false);
//     setIsMarksEntered(true);
//     // Reset scores to empty
//     const initialScores = {};
//     students.forEach(student => {
//       initialScores[student.id] = {
//         obtainedMarks: "",
//         remarks: ""
//       };
//     });
//     setScores(initialScores);
//   };

//   const loadExams = async () => {
//     try {
//       const result = await apiService.getExams();
//       if (result.success) {
//         setExams(result.exams || []);
//       } else {
//         setExams(getMockExams());
//       }
//     } catch (error) {
//       console.error('Failed to load exams:', error);
//       setExams(getMockExams());
//     }
//   };

//   const getMockExams = () => {
//     return [
//       {
//         id: "mock-1",
//         name: "Mathematics Mid Term 2024",
//         classId: "class-1",
//         className: "Class 7-A",
//         subjectId: "math",
//         subjectName: "Mathematics",
//         examType: "Mid Term",
//         examDate: "2024-03-15",
//         totalMarks: 100,
//         passingMarks: 40
//       }
//     ];
//   };

//   const loadStudents = async () => {
//     if (!selectedExam) return;
    
//     setLoading(true);
//     try {
//       const result = await apiService.getStudents(selectedExam.classId);
//       if (result.success) {
//         setStudents(result.students || []);
        
//         const initialScores = {};
//         (result.students || []).forEach(student => {
//           initialScores[student.id] = {
//             obtainedMarks: "",
//             remarks: ""
//           };
//         });
//         setScores(initialScores);
//       }
//     } catch (error) {
//       console.error('Failed to load students:', error);
//       setMessage({ type: "error", text: "Failed to load students" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExamChange = (e) => {
//     const examId = e.target.value;
//     const exam = exams.find(ex => ex.id === examId);
//     setSelectedExam(exam || null);
//     setScores({});
//     setStudents([]);
//     setMessage({ type: "", text: "" });
//   };

//   const handleScoreChange = (studentId, field, value) => {
//     setScores(prev => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [field]: value
//       }
//     }));
//   };

//   const calculatePercentage = (obtainedMarks) => {
//     if (!selectedExam || !obtainedMarks) return "-";
//     return ((obtainedMarks / selectedExam.totalMarks) * 100).toFixed(2);
//   };

//   const calculateGrade = (obtainedMarks) => {
//     const percentage = parseFloat(calculatePercentage(obtainedMarks));
//     if (isNaN(percentage)) return "-";
//     if (percentage >= 90) return "A+";
//     if (percentage >= 80) return "A";
//     if (percentage >= 70) return "B+";
//     if (percentage >= 60) return "B";
//     if (percentage >= 50) return "C";
//     if (percentage >= 40) return "D";
//     return "F";
//   };

//   const getPassStatus = (obtainedMarks) => {
//     if (!selectedExam || !selectedExam.passingMarks || !obtainedMarks) return null;
//     return parseFloat(obtainedMarks) >= parseFloat(selectedExam.passingMarks);
//   };

//   const handleSubmit = async () => {
//     if (!selectedExam) {
//       setMessage({ type: "error", text: "Please select an exam" });
//       return;
//     }

//     const hasAnyMarks = Object.values(scores).some(score => score.obtainedMarks !== "");
//     if (!hasAnyMarks) {
//       setMessage({ type: "error", text: "Please enter marks for at least one student" });
//       return;
//     }

//     const invalidMarks = Object.entries(scores).find(([_, score]) => {
//       if (score.obtainedMarks === "") return false;
//       return parseFloat(score.obtainedMarks) > parseFloat(selectedExam.totalMarks);
//     });

//     if (invalidMarks) {
//       setMessage({ type: "error", text: `Marks cannot exceed ${selectedExam.totalMarks}` });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       // Use the marks API instead of performance API
//       const marksRecords = Object.entries(scores)
//         .filter(([_, score]) => score.obtainedMarks !== "")
//         .map(([studentId, score]) => ({
//           studentId,
//           marksObtained: parseFloat(score.obtainedMarks),
//           status: 'present',
//           remarks: score.remarks || ""
//         }));

//       console.log('Submitting marks:', { examId: selectedExam.id, marks: marksRecords });

//       const result = await apiService.enterBulkMarks({
//         examId: selectedExam.id,
//         marks: marksRecords
//       });
      
//       console.log('Marks submission result:', result);
      
//       if (result.success) {
//         setMessage({ 
//           type: "success", 
//           text: `✅ ${isEditMode ? 'Updated' : 'Saved'} marks successfully! ${result.entered} student${result.entered !== 1 ? 's' : ''} processed.${result.failed > 0 ? ` (${result.failed} failed)` : ''}` 
//         });
        
//         // Refresh to show as "already entered"
//         await checkExistingMarks();
        
//         setTimeout(() => {
//           setMessage({ type: "", text: "" });
//         }, 3000);
//       } else {
//         setMessage({ type: "error", text: result.error || "Failed to save marks" });
//       }
//     } catch (error) {
//       console.error('Score submission error:', error);
//       if (error.message.includes('404') || error.message.includes('Endpoint not found')) {
//         setMessage({ 
//           type: "error", 
//           text: "Backend API not available. Please ensure the server is running on port 5000." 
//         });
//       } else if (error.message.includes('Cannot connect to backend')) {
//         setMessage({ 
//           type: "error", 
//           text: "Cannot connect to backend server. Please check if it's running." 
//         });
//       } else {
//         setMessage({ type: "error", text: "Failed to save marks: " + error.message });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {message.text && (
//         <div className={`mb-4 p-3 rounded-lg text-sm ${
//           message.type === "success" 
//             ? "bg-green-50 text-green-700 border border-green-200" 
//             : "bg-red-50 text-red-700 border border-red-200"
//         }`}>
//           {message.text}
//         </div>
//       )}

//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Select Exam <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedExam?.id || ""}
//           onChange={handleExamChange}
//           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Choose an exam</option>
//           {exams.map(exam => (
//             <option key={exam.id} value={exam.id}>
//               {exam.name} - {exam.className} - {exam.subjectName} ({exam.totalMarks} marks)
//             </option>
//           ))}
//         </select>
//         {exams.length === 0 && (
//           <p className="text-xs text-yellow-600 mt-2">
//             No exams available. Exams are created by admin through exam periods.
//           </p>
//         )}
//       </div>

//       {selectedExam && (
//         <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h3 className="text-sm font-medium text-gray-900 mb-2">Exam Details</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
//             <div>
//               <span className="text-gray-500">Class:</span>
//               <p className="font-medium text-gray-900">{selectedExam.className}</p>
//             </div>
//             <div>
//               <span className="text-gray-500">Subject:</span>
//               <p className="font-medium text-gray-900">{selectedExam.subjectName}</p>
//             </div>
//             <div>
//               <span className="text-gray-500">Total Marks:</span>
//               <p className="font-medium text-gray-900">{selectedExam.totalMarks}</p>
//             </div>
//             <div>
//               <span className="text-gray-500">Passing Marks:</span>
//               <p className="font-medium text-gray-900">{selectedExam.passingMarks || 'N/A'}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Marks Already Entered Banner */}
//       {isMarksEntered && !isEditMode && selectedExam && students.length > 0 && (
//         <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex-shrink-0">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-sm font-semibold text-green-800">Marks Already Entered</h3>
//                 <p className="text-xs text-green-700 mt-1">
//                   Marks for this exam have been recorded.
//                   {marksStats && (
//                     <>
//                       <br />
//                       <span className="font-medium">
//                         Entered: {marksStats.marksEntered}/{marksStats.totalStudents} | 
//                         Average: {marksStats.averagePercentage?.toFixed(1)}% | 
//                         Pass: {marksStats.passCount} | 
//                         Fail: {marksStats.failCount}
//                       </span>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={loadExistingMarksForEdit}
//               className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <FaEdit />
//               Edit Marks
//             </button>
//           </div>
//         </div>
//       )}

//       {selectedExam && students.length > 0 && (isEditMode || !isMarksEntered) && (
//         <>
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
//             <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                   <tr>
//                     <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase w-8">#</th>
//                     <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student Name</th>
//                     <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Enrollment No</th>
//                     <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
//                     <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Percentage</th>
//                     <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Grade</th>
//                     <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
//                     <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {students.map((student, index) => {
//                     const studentScore = scores[student.id] || { obtainedMarks: "", remarks: "" };
//                     const passStatus = getPassStatus(studentScore.obtainedMarks);
                    
//                     return (
//                       <tr key={student.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
//                         <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
//                         <td className="px-4 py-3 text-sm text-gray-600">{student.enrollmentNo}</td>
//                         <td className="px-4 py-3 text-center">
//                           <input
//                             type="number"
//                             value={studentScore.obtainedMarks}
//                             onChange={(e) => handleScoreChange(student.id, 'obtainedMarks', e.target.value)}
//                             placeholder="0"
//                             min="0"
//                             max={selectedExam.totalMarks}
//                             step="0.01"
//                             className="w-20 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                           <span className="text-xs text-gray-500 ml-1">/ {selectedExam.totalMarks}</span>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-center text-gray-900">
//                           {studentScore.obtainedMarks ? calculatePercentage(studentScore.obtainedMarks) + '%' : '-'}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           {studentScore.obtainedMarks ? (
//                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                               calculateGrade(studentScore.obtainedMarks) === 'F' 
//                                 ? 'bg-red-50 text-red-700'
//                                 : calculateGrade(studentScore.obtainedMarks).includes('A')
//                                 ? 'bg-green-50 text-green-700'
//                                 : 'bg-blue-50 text-blue-700'
//                             }`}>
//                               {calculateGrade(studentScore.obtainedMarks)}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           {passStatus !== null && (
//                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                               passStatus 
//                                 ? 'bg-green-50 text-green-700'
//                                 : 'bg-red-50 text-red-700'
//                             }`}>
//                               {passStatus ? 'Pass' : 'Fail'}
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <input
//                             type="text"
//                             value={studentScore.remarks}
//                             onChange={(e) => handleScoreChange(student.id, 'remarks', e.target.value)}
//                             placeholder="Optional"
//                             className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             {isEditMode && (
//               <button
//                 onClick={cancelEdit}
//                 className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   {isEditMode ? 'Updating...' : 'Saving...'}
//                 </>
//               ) : (
//                 <>
//                   <FaCheck />
//                   {isEditMode ? 'Update Marks' : 'Save All Scores'}
//                 </>
//               )}
//             </button>
//           </div>
//         </>
//       )}

//       {selectedExam && students.length === 0 && !loading && (
//         <div className="text-center py-12 text-gray-500">
//           No students found in this class
//         </div>
//       )}

//       {!selectedExam && (
//         <div className="text-center py-12 text-gray-500">
//           Please select an exam to enter scores
//         </div>
//       )}
//     </div>
//   );
// }






import { useState, useEffect, useRef } from "react";
import { FaSpinner, FaCheck, FaEdit, FaCheckCircle, FaExclamationTriangle, FaDownload, FaUpload, FaFileExcel } from "react-icons/fa";
import apiService from "../../../services/apiService";
import { useGameification } from "../../../hooks/useGameification";

const HORIZON_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --primary-blue: #1a6fb5;
    --blue-light: #2d8fd4;
    --blue-deep: #0e4a80;
    --accent-gold: #f0a500;
    --slate: #3c4a5a;
    --gray: #6b7a8d;
    --light-bg: #f5f8fb;
    --white: #ffffff;
    --text-dark: #1e2c3a;
    --font-heading: 'DM Serif Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  * { box-sizing: border-box; }

  .horizon-input {
    border: 1.5px solid rgba(26, 111, 181, 0.2);
    border-radius: 8px;
    background: var(--white);
    color: var(--text-dark);
    transition: all 0.2s ease;
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
  }
  .horizon-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(26, 111, 181, 0.25);
  }
  .horizon-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .horizon-btn-secondary {
    background: transparent;
    color: var(--primary-blue);
    border: 1.5px solid var(--primary-blue);
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.25s ease;
  }
  .horizon-btn-secondary:hover {
    background: rgba(26, 111, 181, 0.06);
    transform: translateY(-2px);
  }

  .alert-success {
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #166534;
  }
  .alert-error {
    background: rgba(220, 38, 38, 0.08);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #991b1b;
  }
`;

export default function ScoresTab() {
  const { awardMarksXP } = useGameification();
  const fileInputRef = useRef(null);
  
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isMarksEntered, setIsMarksEntered] = useState(false);
  const [existingMarks, setExistingMarks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [marksStats, setMarksStats] = useState(null);

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      loadStudents();
      checkExistingMarks();
    }
  }, [selectedExam]);

  const checkExistingMarks = async () => {
    if (!selectedExam) return;

    try {
      const result = await apiService.getMarksByExam(selectedExam.id);
      
      if (result.success && result.marks && result.marks.length > 0) {
        setIsMarksEntered(true);
        setExistingMarks(result.marks);
        setMarksStats(result.statistics);
      } else {
        setIsMarksEntered(false);
        setExistingMarks([]);
        setMarksStats(null);
      }
    } catch (error) {
      console.error('Error checking existing marks:', error);
      setIsMarksEntered(false);
      setExistingMarks([]);
    }
  };

  const loadExistingMarksForEdit = () => {
    const marksMap = {};
    existingMarks.forEach(mark => {
      marksMap[mark.studentId] = {
        obtainedMarks: mark.marksObtained || mark.marks_obtained || "",
        remarks: mark.remarks || ""
      };
    });
    setScores(marksMap);
    setIsEditMode(true);
    setIsMarksEntered(false);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setIsMarksEntered(true);
    const initialScores = {};
    students.forEach(student => {
      initialScores[student.id] = { obtainedMarks: "", remarks: "" };
    });
    setScores(initialScores);
  };

  const loadExams = async () => {
    try {
      const result = await apiService.getExams();
      if (result.success) {
        setExams(result.exams || []);
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
      setExams([]);
    }
  };

  const loadStudents = async () => {
    if (!selectedExam) return;
    
    setLoading(true);
    try {
      const result = await apiService.getStudents(selectedExam.classId);
      if (result.success) {
        setStudents(result.students || []);
        
        const initialScores = {};
        (result.students || []).forEach(student => {
          initialScores[student.id] = { obtainedMarks: "", remarks: "" };
        });
        setScores(initialScores);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      setMessage({ type: "error", text: "Failed to load students" });
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (e) => {
    const examId = e.target.value;
    const exam = exams.find(ex => ex.id === examId);
    setSelectedExam(exam || null);
    setScores({});
    setStudents([]);
    setMessage({ type: "", text: "" });
  };

  const handleScoreChange = (studentId, field, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const calculatePercentage = (obtainedMarks) => {
    if (!selectedExam || !obtainedMarks) return "-";
    return ((obtainedMarks / selectedExam.totalMarks) * 100).toFixed(2);
  };

  const calculateGrade = (obtainedMarks) => {
    const percentage = parseFloat(calculatePercentage(obtainedMarks));
    if (isNaN(percentage)) return "-";
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const getPassStatus = (obtainedMarks) => {
    if (!selectedExam || !selectedExam.passingMarks || !obtainedMarks) return null;
    return parseFloat(obtainedMarks) >= parseFloat(selectedExam.passingMarks);
  };

  const handleSubmit = async () => {
    if (!selectedExam) {
      setMessage({ type: "error", text: "Please select an exam" });
      return;
    }

    const hasAnyMarks = Object.values(scores).some(score => score.obtainedMarks !== "");
    if (!hasAnyMarks) {
      setMessage({ type: "error", text: "Please enter marks for at least one student" });
      return;
    }

    const invalidMarks = Object.entries(scores).find(([_, score]) => {
      if (score.obtainedMarks === "") return false;
      return parseFloat(score.obtainedMarks) > parseFloat(selectedExam.totalMarks);
    });

    if (invalidMarks) {
      setMessage({ type: "error", text: `Marks cannot exceed ${selectedExam.totalMarks}` });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const marksRecords = Object.entries(scores)
        .filter(([_, score]) => score.obtainedMarks !== "")
        .map(([studentId, score]) => ({
          studentId,
          marksObtained: parseFloat(score.obtainedMarks),
          status: 'submitted',
          remarks: score.remarks || ""
        }));

      const result = await apiService.enterBulkMarks({
        examId: selectedExam.id,
        marks: marksRecords
      });
      
      if (result.success) {
        // Award XP for entering marks (+30 XP)
        try {
          await awardMarksXP();
          console.log('✅ XP awarded for marks entry!');
        } catch (xpError) {
          console.error('Failed to award XP:', xpError);
          // Don't fail the whole operation if XP award fails
        }
        
        setMessage({ 
          type: "success", 
          text: `✓ ${isEditMode ? 'Updated' : 'Saved'} marks! ${result.entered} student${result.entered !== 1 ? 's' : ''} processed.${result.failed > 0 ? ` (${result.failed} failed)` : ''} +30 XP earned!` 
        });
        
        await checkExistingMarks();
        
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save marks" });
      }
    } catch (error) {
      console.error('Score submission error:', error);
      
      // Provide more specific error messages
      let errorText = "Failed to save marks";
      
      if (error.message.includes('Cannot connect')) {
        errorText = "Cannot connect to server. Please ensure backend is running on port 5000.";
      } else if (error.message.includes('404')) {
        errorText = "API endpoint not found. Please check backend server.";
      } else if (error.message.includes('Insufficient data')) {
        errorText = "Cannot save marks - student data insufficient for ML prediction. This is expected for new students.";
      } else if (error.message) {
        errorText = `Failed to save marks: ${error.message}`;
      }
      
      setMessage({ 
        type: "error", 
        text: errorText
      });
    } finally {
      setLoading(false);
    }
  };

  // Download CSV Template
  const downloadTemplate = () => {
    if (!selectedExam || students.length === 0) {
      setMessage({ type: "error", text: "Please select an exam with students first" });
      return;
    }

    const csvContent = [
      ['Enrollment_No', 'Student_Name', 'Marks_Obtained', 'Remarks'].join(','),
      ...students.map(student => [
        student.enrollmentNo,
        `"${student.name}"`,
        '',
        ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedExam.name.replace(/[^a-z0-9]/gi, '_')}_marks_template.csv`;
    link.click();
    
    setMessage({ type: "success", text: `✓ Template downloaded! Max marks: ${selectedExam.totalMarks}` });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Upload CSV File
  const handleCSVUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setMessage({ type: "error", text: "Please upload a CSV file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        parseCSV(text);
      } catch (error) {
        console.error('CSV parse error:', error);
        setMessage({ type: "error", text: "Failed to parse CSV file: " + error.message });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Parse CSV Content
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setMessage({ type: "error", text: "CSV file is empty or invalid" });
      return;
    }

    // Skip header row
    const dataLines = lines.slice(1);
    const newScores = { ...scores };
    let imported = 0;
    let errors = [];

    dataLines.forEach((line, index) => {
      // Simple CSV parsing (handles quoted fields)
      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.trim().replace(/^"|"$/g, '')) || [];
      
      if (values.length < 3) return;

      const [enrollmentNo, , marksStr, remarks] = values;
      
      // Find student by enrollment number
      const student = students.find(s => s.enrollmentNo === enrollmentNo);
      
      if (!student) {
        errors.push(`Row ${index + 2}: Student ${enrollmentNo} not found`);
        return;
      }

      const marks = parseFloat(marksStr);
      
      if (marksStr && (isNaN(marks) || marks < 0 || marks > selectedExam.totalMarks)) {
        errors.push(`Row ${index + 2}: Invalid marks ${marksStr} (must be 0-${selectedExam.totalMarks})`);
        return;
      }

      if (marksStr) {
        newScores[student.id] = {
          obtainedMarks: marksStr,
          remarks: remarks || ""
        };
        imported++;
      }
    });

    setScores(newScores);
    
    if (imported > 0) {
      setMessage({ 
        type: "success", 
        text: `✓ Imported marks for ${imported} student${imported !== 1 ? 's' : ''}!${errors.length > 0 ? ` ${errors.length} error(s) - check console` : ''}` 
      });
      if (errors.length > 0) {
        console.error('CSV import errors:', errors);
      }
    } else {
      setMessage({ type: "error", text: "No valid marks found in CSV. " + (errors.length > 0 ? errors[0] : '') });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HORIZON_STYLES }} />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        style={{ display: 'none' }}
      />

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 ${
          message.type === "success" ? "alert-success" : "alert-error"
        }`}>
          {message.type === "success" ? (
            <FaCheckCircle className="mt-0.5 flex-shrink-0" />
          ) : (
            <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Exam Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
          Select Exam <span style={{ color: 'var(--accent-gold)' }}>*</span>
        </label>
        <select
          value={selectedExam?.id || ""}
          onChange={handleExamChange}
          className="w-full horizon-input px-4 py-2.5 text-sm"
        >
          <option value="">Choose an exam</option>
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>
              {exam.name} - {exam.className} - {exam.subjectName} ({exam.totalMarks} marks)
            </option>
          ))}
        </select>
        {exams.length === 0 && (
          <p className="text-xs mt-2" style={{ color: 'var(--accent-gold)' }}>
            No exams available. Exams are created by admin.
          </p>
        )}
      </div>

      {/* Exam Details */}
      {selectedExam && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(26, 111, 181, 0.04)', border: '1px solid rgba(26, 111, 181, 0.12)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-dark)' }}>Exam Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span style={{ color: 'var(--gray)' }}>Class:</span>
              <p className="font-semibold mt-1" style={{ color: 'var(--text-dark)' }}>{selectedExam.className}</p>
            </div>
            <div>
              <span style={{ color: 'var(--gray)' }}>Subject:</span>
              <p className="font-semibold mt-1" style={{ color: 'var(--text-dark)' }}>{selectedExam.subjectName}</p>
            </div>
            <div>
              <span style={{ color: 'var(--gray)' }}>Total Marks:</span>
              <p className="font-semibold mt-1" style={{ color: 'var(--text-dark)' }}>{selectedExam.totalMarks}</p>
            </div>
            <div>
              <span style={{ color: 'var(--gray)' }}>Passing Marks:</span>
              <p className="font-semibold mt-1" style={{ color: 'var(--text-dark)' }}>{selectedExam.passingMarks || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Section */}
      {selectedExam && students.length > 0 && !isMarksEntered && (
        <div className="mb-6 p-4 rounded-lg border" style={{ background: 'rgba(240, 165, 0, 0.04)', borderColor: 'rgba(240, 165, 0, 0.2)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <FaFileExcel style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }} className="mt-1" />
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>Bulk Upload via CSV</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--gray)' }}>
                  Download the template, fill in marks, and upload to save time
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 rounded-lg transition-all"
                style={{ 
                  borderColor: 'var(--accent-gold)', 
                  color: 'var(--accent-gold)',
                  background: 'transparent'
                }}
              >
                <FaDownload />
                Download Template
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{ 
                  background: 'var(--accent-gold)',
                  color: 'white'
                }}
              >
                <FaUpload />
                Upload CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already Entered Banner */}
      {isMarksEntered && !isEditMode && selectedExam && students.length > 0 && (
        <div className="mb-6 p-4 rounded-lg border-l-4" style={{ background: 'rgba(34, 197, 94, 0.08)', borderLeftColor: '#16a34a', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCheckCircle style={{ color: '#16a34a', fontSize: '1.5rem' }} />
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#15803d' }}>Marks Already Entered</h3>
                <p className="text-xs mt-1" style={{ color: '#166534' }}>
                  Marks have been recorded.
                  {marksStats && (
                    <>
                      <br />
                      <span className="font-medium">
                        Entered: {marksStats.marksEntered}/{marksStats.totalStudents} | 
                        Avg: {marksStats.averagePercentage?.toFixed(1)}% | 
                        Pass: {marksStats.passCount} | 
                        Fail: {marksStats.failCount}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={loadExistingMarksForEdit}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:-translate-y-0.5"
              style={{ background: '#16a34a' }}
            >
              <FaEdit className="inline mr-1" />
              Edit
            </button>
          </div>
        </div>
      )}

      {selectedExam && students.length > 0 && (isEditMode || !isMarksEntered) && (
        <>
          {/* Marks Table */}
          <div className="mb-6 rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)', position: 'sticky', top: 0 }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Enrollment</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Marks</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>%</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Grade</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap" style={{ color: 'var(--gray)' }}>Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const studentScore = scores[student.id] || { obtainedMarks: "", remarks: "" };
                    const passStatus = getPassStatus(studentScore.obtainedMarks);
                    
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid rgba(26, 111, 181, 0.06)' }}>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--gray)' }}>{index + 1}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-dark)' }}>{student.name}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--gray)' }}>{student.enrollmentNo}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              value={studentScore.obtainedMarks}
                              onChange={(e) => handleScoreChange(student.id, 'obtainedMarks', e.target.value)}
                              placeholder="0"
                              min="0"
                              max={selectedExam.totalMarks}
                              step="0.01"
                              className="w-16 horizon-input px-2 py-1 text-sm text-center"
                            />
                            <span className="text-xs" style={{ color: 'var(--gray)' }}>/ {selectedExam.totalMarks}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center" style={{ color: 'var(--text-dark)' }}>
                          {studentScore.obtainedMarks ? calculatePercentage(studentScore.obtainedMarks) + '%' : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {studentScore.obtainedMarks ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              calculateGrade(studentScore.obtainedMarks) === 'F' 
                                ? 'bg-red-50 text-red-700'
                                : calculateGrade(studentScore.obtainedMarks).includes('A')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {calculateGrade(studentScore.obtainedMarks)}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--gray)' }}>-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {passStatus !== null && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              passStatus 
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              {passStatus ? 'Pass' : 'Fail'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={studentScore.remarks}
                            onChange={(e) => handleScoreChange(student.id, 'remarks', e.target.value)}
                            placeholder="Optional"
                            className="w-full horizon-input px-2 py-1 text-sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            {isEditMode && (
              <button
                onClick={cancelEdit}
                className="horizon-btn-secondary px-6 py-2.5 text-sm"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="horizon-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <FaCheck />
                  {isEditMode ? 'Update Marks' : 'Save All Scores'}
                </>
              )}
            </button>
          </div>
        </>
      )}

      {selectedExam && students.length === 0 && !loading && (
        <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
          No students found in this class
        </div>
      )}

      {!selectedExam && (
        <div className="text-center py-12" style={{ color: 'var(--gray)' }}>
          Please select an exam to enter marks
        </div>
      )}
    </>
  );
}