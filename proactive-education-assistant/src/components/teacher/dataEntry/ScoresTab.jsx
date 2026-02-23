import { useState, useEffect } from "react";
import { FaSpinner, FaCheck, FaEdit } from "react-icons/fa";
import apiService from "../../../services/apiService";

export default function ScoresTab() {
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
        console.log('Existing marks found:', result.marks.length);
      } else {
        setIsMarksEntered(false);
        setExistingMarks([]);
        setMarksStats(null);
        console.log('No existing marks found');
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
    setIsMarksEntered(false); // Hide the banner when editing
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setIsMarksEntered(true);
    // Reset scores to empty
    const initialScores = {};
    students.forEach(student => {
      initialScores[student.id] = {
        obtainedMarks: "",
        remarks: ""
      };
    });
    setScores(initialScores);
  };

  const loadExams = async () => {
    try {
      const result = await apiService.getExams();
      if (result.success) {
        setExams(result.exams || []);
      } else {
        setExams(getMockExams());
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
      setExams(getMockExams());
    }
  };

  const getMockExams = () => {
    return [
      {
        id: "mock-1",
        name: "Mathematics Mid Term 2024",
        classId: "class-1",
        className: "Class 7-A",
        subjectId: "math",
        subjectName: "Mathematics",
        examType: "Mid Term",
        examDate: "2024-03-15",
        totalMarks: 100,
        passingMarks: 40
      }
    ];
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
          initialScores[student.id] = {
            obtainedMarks: "",
            remarks: ""
          };
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
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
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
      const marksArray = Object.entries(scores)
        .filter(([_, score]) => score.obtainedMarks !== "")
        .map(([studentId, score]) => ({
          studentId,
          marksObtained: parseFloat(score.obtainedMarks),
          remarks: score.remarks || ""
        }));

      const result = await apiService.enterBulkMarks({
        examId: selectedExam.id,
        marks: marksArray
      });
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: `✅ ${isEditMode ? 'Updated' : 'Saved'} marks successfully! ${result.entered} student${result.entered !== 1 ? 's' : ''} processed.` 
        });
        
        // Refresh to show as "already entered"
        await checkExistingMarks();
        
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save marks" });
      }
    } catch (error) {
      console.error('Score submission error:', error);
      setMessage({ type: "error", text: error.message || "Failed to save marks. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Exam <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedExam?.id || ""}
          onChange={handleExamChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose an exam</option>
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>
              {exam.name} - {exam.className} - {exam.subjectName} ({exam.totalMarks} marks)
            </option>
          ))}
        </select>
        {exams.length === 0 && (
          <p className="text-xs text-yellow-600 mt-2">
            No exams available. Exams are created by admin through exam periods.
          </p>
        )}
      </div>

      {selectedExam && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Exam Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Class:</span>
              <p className="font-medium text-gray-900">{selectedExam.className}</p>
            </div>
            <div>
              <span className="text-gray-500">Subject:</span>
              <p className="font-medium text-gray-900">{selectedExam.subjectName}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Marks:</span>
              <p className="font-medium text-gray-900">{selectedExam.totalMarks}</p>
            </div>
            <div>
              <span className="text-gray-500">Passing Marks:</span>
              <p className="font-medium text-gray-900">{selectedExam.passingMarks || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Marks Already Entered Banner */}
      {isMarksEntered && !isEditMode && selectedExam && students.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-800">Marks Already Entered</h3>
                <p className="text-xs text-green-700 mt-1">
                  Marks for this exam have been recorded.
                  {marksStats && (
                    <>
                      <br />
                      <span className="font-medium">
                        Entered: {marksStats.marksEntered}/{marksStats.totalStudents} | 
                        Average: {marksStats.averagePercentage?.toFixed(1)}% | 
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaEdit />
              Edit Marks
            </button>
          </div>
        </div>
      )}

      {selectedExam && students.length > 0 && (isEditMode || !isMarksEntered) && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase w-8">#</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Enrollment No</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student, index) => {
                    const studentScore = scores[student.id] || { obtainedMarks: "", remarks: "" };
                    const passStatus = getPassStatus(studentScore.obtainedMarks);
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.enrollmentNo}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            value={studentScore.obtainedMarks}
                            onChange={(e) => handleScoreChange(student.id, 'obtainedMarks', e.target.value)}
                            placeholder="0"
                            min="0"
                            max={selectedExam.totalMarks}
                            step="0.01"
                            className="w-20 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500 ml-1">/ {selectedExam.totalMarks}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900">
                          {studentScore.obtainedMarks ? calculatePercentage(studentScore.obtainedMarks) + '%' : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {studentScore.obtainedMarks ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              calculateGrade(studentScore.obtainedMarks) === 'F' 
                                ? 'bg-red-50 text-red-700'
                                : calculateGrade(studentScore.obtainedMarks).includes('A')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {calculateGrade(studentScore.obtainedMarks)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {passStatus !== null && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {isEditMode && (
              <button
                onClick={cancelEdit}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="text-center py-12 text-gray-500">
          No students found in this class
        </div>
      )}

      {!selectedExam && (
        <div className="text-center py-12 text-gray-500">
          Please select an exam to enter scores
        </div>
      )}
    </div>
  );
}
