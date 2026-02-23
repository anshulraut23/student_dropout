import { useState, useEffect } from "react";
import { FaBook, FaFilter, FaDownload, FaEye, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiService from "../../services/apiService";

export default function ScoreHistoryPage() {
  const [scoreHistory, setScoreHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [filters, setFilters] = useState({
    classId: "",
    subjectId: "",
    startDate: "",
    endDate: "",
    searchQuery: ""
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadClasses();
    loadScoreHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, scoreHistory]);

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      if (result.success) {
        setClasses(result.classes || []);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadScoreHistory = async () => {
    setLoading(true);
    try {
      const classesResult = await apiService.getMyClasses();
      if (!classesResult.success) {
        throw new Error('Failed to load classes');
      }

      const allHistory = [];
      
      for (const cls of classesResult.classes || []) {
        try {
          const subjectsResponse = await apiService.getSubjectsByClass(cls.id);
          const classSubjects = subjectsResponse.subjects || [];
          
          const examsResponse = await apiService.getExams({ classId: cls.id });
          const exams = examsResponse.exams || [];
          
          for (const exam of exams) {
            try {
              const marksResponse = await apiService.getMarksByExam(exam.id);
              
              if (marksResponse.success && marksResponse.marks) {
                const subject = classSubjects.find(s => s.id === exam.subjectId);
                const marks = marksResponse.marks;
                const presentMarks = marks.filter(m => m.status === 'present');
                
                const averageMarks = presentMarks.length > 0 
                  ? (presentMarks.reduce((sum, m) => sum + m.marksObtained, 0) / presentMarks.length).toFixed(2)
                  : 0;
                const averagePercentage = presentMarks.length > 0
                  ? (presentMarks.reduce((sum, m) => sum + m.percentage, 0) / presentMarks.length).toFixed(2)
                  : 0;
                const passCount = presentMarks.filter(m => m.marksObtained >= exam.passingMarks).length;
                const passPercentage = presentMarks.length > 0 
                  ? ((passCount / presentMarks.length) * 100).toFixed(2)
                  : 0;
                
                allHistory.push({
                  id: exam.id,
                  examName: exam.name,
                  examType: exam.type,
                  examDate: exam.examDate,
                  className: cls.name,
                  classId: cls.id,
                  subjectName: subject?.name || 'Unknown',
                  subjectId: exam.subjectId,
                  totalMarks: exam.totalMarks,
                  passingMarks: exam.passingMarks,
                  totalStudents: marks.length,
                  studentsAppeared: presentMarks.length,
                  averageMarks: parseFloat(averageMarks),
                  averagePercentage: parseFloat(averagePercentage),
                  passCount,
                  failCount: presentMarks.filter(m => m.marksObtained < exam.passingMarks).length,
                  passPercentage: parseFloat(passPercentage),
                  marks: marks
                });
              }
            } catch (error) {
              console.error(`Failed to load marks for exam ${exam.id}:`, error);
            }
          }
        } catch (error) {
          console.error(`Failed to load data for class ${cls.id}:`, error);
        }
      }
      
      allHistory.sort((a, b) => new Date(b.examDate) - new Date(a.examDate));
      setScoreHistory(allHistory);
      
      if (allHistory.length === 0) {
        setMessage({ type: "info", text: "No score records found." });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error('Failed to load score history:', error);
      setMessage({ type: "error", text: "Failed to load score history." });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...scoreHistory];

    if (filters.classId) {
      filtered = filtered.filter(record => record.classId === filters.classId);
    }
    if (filters.subjectId) {
      filtered = filtered.filter(record => record.subjectId === filters.subjectId);
    }
    if (filters.startDate) {
      filtered = filtered.filter(record => record.examDate >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(record => record.examDate <= filters.endDate);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.examName?.toLowerCase().includes(query) ||
        record.className?.toLowerCase().includes(query) ||
        record.subjectName?.toLowerCase().includes(query)
      );
    }

    setFilteredHistory(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    if (name === 'classId' && value) {
      loadSubjectsForClass(value);
    }
  };

  const loadSubjectsForClass = async (classId) => {
    try {
      const response = await apiService.getSubjectsByClass(classId);
      setSubjects(response.subjects || []);
    } catch (error) {
      setSubjects([]);
    }
  };

  const clearFilters = () => {
    setFilters({
      classId: "",
      subjectId: "",
      startDate: "",
      endDate: "",
      searchQuery: ""
    });
    setSubjects([]);
  };

  const viewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredHistory.map(record => ({
        "Exam": record.examName,
        "Date": record.examDate,
        "Class": record.className,
        "Subject": record.subjectName,
        "Avg Marks": record.averageMarks,
        "Avg %": record.averagePercentage + "%",
        "Pass %": record.passPercentage + "%"
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Score History");
      XLSX.writeFile(workbook, `score_history_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setMessage({ type: "success", text: "Exported successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export" });
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-blue-600 bg-blue-50";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Score History</h1>
            <p className="text-sm text-gray-500 mt-1">View exam scores and performance</p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <FaDownload />
            Export
          </button>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700" : 
            message.type === "info" ? "bg-blue-50 text-blue-700" :
            "bg-red-50 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter />
            <h2 className="font-medium">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm mb-1">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Class</label>
              <select
                name="classId"
                value={filters.classId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Subject</label>
              <select
                name="subjectId"
                value={filters.subjectId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={!filters.classId}
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">From</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">To</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <FaBook className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Exam</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Avg %</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pass %</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{record.examName}</div>
                        <div className="text-xs text-gray-500">{record.examType}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(record.examDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{record.className}</td>
                      <td className="px-4 py-3 text-sm">{record.subjectName}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        {record.studentsAppeared}/{record.totalStudents}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(record.averagePercentage)}`}>
                          {record.averagePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(record.passPercentage)}`}>
                          {record.passPercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => viewDetails(record)}
                          className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 mx-auto"
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Score Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Exam</p>
                      <p className="text-sm font-medium">{selectedRecord.examName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm font-medium">{selectedRecord.className}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subject</p>
                      <p className="text-sm font-medium">{selectedRecord.subjectName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium">{new Date(selectedRecord.examDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">Students</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedRecord.totalStudents}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">Appeared</p>
                      <p className="text-2xl font-bold text-green-900">{selectedRecord.studentsAppeared}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600">Avg Marks</p>
                      <p className="text-2xl font-bold text-purple-900">{selectedRecord.averageMarks}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-600">Pass Rate</p>
                      <p className="text-2xl font-bold text-yellow-900">{selectedRecord.passPercentage}%</p>
                    </div>
                  </div>

                  {selectedRecord.marks && selectedRecord.marks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Student Scores</h4>
                      <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="text-left px-3 py-2 text-xs">#</th>
                              <th className="text-left px-3 py-2 text-xs">Student</th>
                              <th className="text-center px-3 py-2 text-xs">Marks</th>
                              <th className="text-center px-3 py-2 text-xs">%</th>
                              <th className="text-center px-3 py-2 text-xs">Grade</th>
                              <th className="text-center px-3 py-2 text-xs">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedRecord.marks
                              .sort((a, b) => (b.marksObtained || 0) - (a.marksObtained || 0))
                              .map((mark, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2">{idx + 1}</td>
                                <td className="px-3 py-2">
                                  <div className="font-medium">{mark.studentName || 'Unknown'}</div>
                                  <div className="text-xs text-gray-500">{mark.enrollmentNo}</div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {mark.status === 'present' ? `${mark.marksObtained}/${selectedRecord.totalMarks}` : '-'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {mark.status === 'present' ? `${mark.percentage}%` : '-'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {mark.grade ? (
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      mark.grade.includes('A') ? 'bg-green-50 text-green-700' :
                                      mark.grade.includes('B') ? 'bg-blue-50 text-blue-700' :
                                      'bg-yellow-50 text-yellow-700'
                                    }`}>
                                      {mark.grade}
                                    </span>
                                  ) : '-'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    mark.status === 'present' 
                                      ? mark.marksObtained >= selectedRecord.passingMarks
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                      : 'bg-gray-50 text-gray-700'
                                  }`}>
                                    {mark.status === 'present' 
                                      ? mark.marksObtained >= selectedRecord.passingMarks ? 'Pass' : 'Fail'
                                      : mark.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
