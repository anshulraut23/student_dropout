import { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaDownload, FaEye, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiService from "../../services/apiService";

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
      if (result.success) {
        setClasses(result.classes || []);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadAttendanceHistory = async () => {
    setLoading(true);
    try {
      const result = await apiService.getAttendanceHistory();
      if (result.success) {
        setAttendanceHistory(result.history || []);
      } else {
        setMessage({ type: "error", text: "Failed to load attendance history" });
      }
    } catch (error) {
      console.error('Failed to load attendance history:', error);
      setMessage({ type: "error", text: "Failed to load attendance history" });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendanceHistory];

    // Filter by class
    if (filters.classId) {
      filtered = filtered.filter(record => record.classId === filters.classId);
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(record => record.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(record => record.date <= filters.endDate);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.className?.toLowerCase().includes(query) ||
        record.date?.includes(query)
      );
    }

    setFilteredHistory(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      classId: "",
      startDate: "",
      endDate: "",
      searchQuery: ""
    });
  };

  const viewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredHistory.map(record => ({
        "Date": record.date,
        "Class": record.className,
        "Total Students": record.totalStudents,
        "Present": record.presentCount,
        "Absent": record.absentCount,
        "Attendance %": record.attendancePercentage + "%",
        "Marked By": record.markedBy,
        "Marked At": new Date(record.markedAt).toLocaleString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");

      worksheet['!cols'] = [
        { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 10 },
        { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 20 }
      ];

      XLSX.writeFile(workbook, `attendance_history_${new Date().toISOString().split('T')[0]}.xlsx`);
      setMessage({ type: "success", text: "Attendance history exported successfully!" });
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
    <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Attendance History</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">View and manage your attendance records</p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={filteredHistory.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDownload />
            Export to Excel
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <h2 className="text-sm font-medium text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search by class or date..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                name="classId"
                value={filters.classId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Attendance History Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500 mt-2">Loading attendance history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No attendance records found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or add new attendance records</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Class</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total Students</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Present</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Absent</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.className}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-900">{record.totalStudents}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            {record.presentCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                            {record.absentCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(record.attendancePercentage)}`}>
                            {record.attendancePercentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <button
                            onClick={() => viewDetails(record)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
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

              {/* Pagination Info */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
                Showing {filteredHistory.length} record{filteredHistory.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm font-medium text-gray-900">{selectedRecord.className}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Students</p>
                      <p className="text-sm font-medium text-gray-900">{selectedRecord.totalStudents}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Attendance Rate</p>
                      <p className={`text-sm font-medium ${getAttendanceColor(selectedRecord.attendancePercentage).split(' ')[0]}`}>
                        {selectedRecord.attendancePercentage}%
                      </p>
                    </div>
                  </div>

                  {/* Student List */}
                  {selectedRecord.students && selectedRecord.students.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Student Attendance</h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Student Name</th>
                              <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Enrollment No</th>
                              <th className="text-center px-3 py-2 text-xs font-medium text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedRecord.students.map((student, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-2 text-gray-900">{student.name}</td>
                                <td className="px-3 py-2 text-gray-600">{student.enrollmentNo}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    student.status === 'present' 
                                      ? 'bg-green-50 text-green-700' 
                                      : 'bg-red-50 text-red-700'
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
                  )}

                  {/* Marked By Info */}
                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <p>Marked by: {selectedRecord.markedBy}</p>
                    <p>Marked at: {new Date(selectedRecord.markedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
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
