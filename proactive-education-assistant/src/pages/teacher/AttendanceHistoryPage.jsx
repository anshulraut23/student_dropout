

import { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaDownload, FaEye, FaSearch, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedRemarks, setEditedRemarks] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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
        setMessage({ type: "info", text: t("teacher_attendance.no_records_start_marking", "No attendance records found. Start marking attendance to see history.") });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error('Failed to load attendance history:', error);
      setMessage({ type: "error", text: t("teacher_attendance.failed_to_load", "Failed to load attendance history. Please try again.") });
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
    setIsEditMode(false);
    setTimeout(() => setSelectedRecord(null), 300);
  };

  const startEdit = () => {
    if (selectedRecord && selectedRecord.records && selectedRecord.records.length > 0) {
      // Get the first student record for editing
      const firstRecord = selectedRecord.records[0];
      setEditedStatus(firstRecord.status || 'present');
      setEditedRemarks(firstRecord.remarks || '');
      setIsEditMode(true);
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditedStatus("");
    setEditedRemarks("");
  };

  const saveAttendanceEdit = async () => {
    if (!selectedRecord || !selectedRecord.records || selectedRecord.records.length === 0) {
      return;
    }

    setEditLoading(true);
    try {
      const firstRecord = selectedRecord.records[0];
      
      // Call API to update attendance
      const result = await apiService.updateAttendance(firstRecord.id, {
        status: editedStatus,
        remarks: editedRemarks
      });

      if (result.success) {
        // Update the local state
        const updatedRecord = { ...selectedRecord };
        updatedRecord.records[0] = {
          ...firstRecord,
          status: editedStatus,
          remarks: editedRemarks
        };
        
        // Update the attendance history
        setAttendanceHistory(attendanceHistory.map(r => 
          r.id === updatedRecord.id ? updatedRecord : r
        ));
        
        setSelectedRecord(updatedRecord);
        setIsEditMode(false);
        setMessage({ type: 'success', text: 'Attendance updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update attendance' });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update attendance' });
    } finally {
      setEditLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredHistory.map(record => ({
        [t("teacher_attendance.date", "Date")]: record.date,
        [t("teacher_attendance.class", "Class")]: record.className,
        [t("teacher_attendance.total_students", "Total Students")]: record.totalStudents,
        [t("teacher_attendance.present", "Present")]: record.presentCount,
        [t("teacher_attendance.absent", "Absent")]: record.absentCount,
        [t("teacher_attendance.attendance_percent", "Attendance %")]: record.attendancePercentage + "%"
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance History");
      worksheet['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
      XLSX.writeFile(workbook, `attendance_history_${new Date().toISOString().split('T')[0]}.xlsx`);
      setMessage({ type: "success", text: t("teacher_attendance.export_success", "✓ Attendance history exported successfully!") });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: "error", text: t("teacher_attendance.export_failed", "Failed to export data") });
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
                {t("teacher_attendance.title", "Attendance History")}
              </h1>
              <p className="text-sm md:text-base" style={{ color: 'var(--gray)' }}>
                {t("teacher_attendance.subtitle", "View and manage your attendance records")}
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
                {t("teacher_attendance.export_to_excel", "Export to Excel")}
              </button>
            </div>

            {/* Filters */}
            <div className="mb-8 p-6 rounded-lg border" style={{ background: 'var(--white)', borderColor: 'rgba(26, 111, 181, 0.12)' }}>
              <div className="flex items-center gap-2 mb-5">
                <FaFilter style={{ color: 'var(--primary-blue)' }} />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{t("teacher_attendance.filters", "Filters")}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{t("teacher_attendance.search", "Search")}</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--gray)' }} />
                    <input
                      type="text"
                      name="searchQuery"
                      value={filters.searchQuery}
                      onChange={handleFilterChange}
                      placeholder={t("teacher_attendance.search_placeholder", "Search by class or date...")}
                      className="w-full pl-9 pr-4 py-2.5 text-sm horizon-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{t("teacher_attendance.class", "Class")}</label>
                  <select
                    name="classId"
                    value={filters.classId}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 text-sm horizon-input"
                  >
                    <option value="">{t("teacher_attendance.all_classes", "All Classes")}</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}{cls.section ? ` ${cls.section}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{t("teacher_attendance.from_date", "From Date")}</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2.5 text-sm horizon-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>{t("teacher_attendance.to_date", "To Date")}</label>
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
                  {t("teacher_attendance.clear_filters", "Clear Filters")}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(26, 111, 181, 0.12)', background: 'var(--white)' }}>
              {loading ? (
                <div className="text-center py-16">
                  <FaSpinner className="animate-spin text-4xl mx-auto mb-3" style={{ color: 'var(--primary-blue)' }} />
                  {/* <p className="text-sm" style={{ color: 'var(--gray)' }}>Loading...</p> */}
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-16">
                  <FaCalendarAlt className="mx-auto text-6xl mb-4" style={{ color: 'rgba(26, 111, 181, 0.1)' }} />
                  <p className="text-sm" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.no_records_found", "No attendance records found")}</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                        <tr>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.date", "Date")}</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.class", "Class")}</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.total", "Total")}</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.present", "Present")}</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.absent", "Absent")}</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.attendance_percent", "Attendance %")}</th>
                          <th className="text-center px-6 py-4 text-xs font-semibold uppercase" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.actions", "Actions")}</th>
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
                                {t("teacher_attendance.view", "View")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 text-xs" style={{ background: 'var(--light-bg)', borderTop: '1px solid rgba(26, 111, 181, 0.08)', color: 'var(--gray)' }}>
                    {t("teacher_attendance.showing_records", "Showing {{count}} record(s)", { count: filteredHistory.length })}
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
                          {t("teacher_attendance.attendance_details", "Attendance Details")}
                          {isEditMode && <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '8px', color: 'var(--gray)' }}>(Editing)</span>}
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
                      {isEditMode && selectedRecord.records && selectedRecord.records.length > 0 ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-sm mb-4 text-blue-900">Edit Attendance Record</h4>
                          <div className="space-y-4">
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)' }}>
                                Status
                              </label>
                              <select
                                value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1.5px solid rgba(26, 111, 181, 0.2)',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  backgroundColor: 'white',
                                  color: 'var(--text-dark)',
                                  transition: 'border-color 0.2s'
                                }}
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                                <option value="leave">Leave</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)' }}>
                                Remarks (Optional)
                              </label>
                              <textarea
                                value={editedRemarks}
                                onChange={(e) => setEditedRemarks(e.target.value)}
                                placeholder="Add any remarks about this attendance record..."
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1.5px solid rgba(26, 111, 181, 0.2)',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  minHeight: '80px',
                                  backgroundColor: 'white',
                                  color: 'var(--text-dark)',
                                  fontFamily: 'inherit',
                                  transition: 'border-color 0.2s',
                                  resize: 'vertical'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg" style={{ background: 'var(--light-bg)' }}>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.date", "Date")}</p>
                              <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>
                                {new Date(selectedRecord.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.class", "Class")}</p>
                              <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{selectedRecord.className}</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.total_students", "Total Students")}</p>
                              <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-dark)' }}>{selectedRecord.totalStudents}</p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.rate", "Rate")}</p>
                              <p className={`text-sm font-semibold mt-2 ${getAttendanceColor(selectedRecord.attendancePercentage).split(' ')[0]}`}>
                                {selectedRecord.attendancePercentage}%
                              </p>
                            </div>
                          </div>

                          {selectedRecord.students && selectedRecord.students.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>{t("teacher_attendance.student_attendance", "Student Attendance")}</h4>
                              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                                <div className="overflow-y-auto max-h-80">
                                  <table className="w-full text-sm">
                                    <thead style={{ background: 'var(--light-bg)', borderBottom: '1px solid rgba(26, 111, 181, 0.08)' }}>
                                      <tr>
                                        <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.name", "Name")}</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.enrollment", "Enrollment")}</th>
                                        <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.status", "Status")}</th>
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
                                              {student.status === 'present' ? t("teacher_attendance.present", "Present") : t("teacher_attendance.absent", "Absent")}
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
                            <p className="text-xs" style={{ color: 'var(--gray)' }}>{t("teacher_attendance.marked_by", "Marked by")}: <span style={{ color: 'var(--text-dark)' }} className="font-medium">{selectedRecord.markedBy}</span></p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3" style={{ borderColor: 'rgba(26, 111, 181, 0.12)' }}>
                      {isEditMode ? (
                        <>
                          <button 
                            onClick={cancelEdit}
                            disabled={editLoading}
                            className="horizon-btn-secondary px-6 py-2 text-sm inline-flex items-center gap-2"
                          >
                            <FaTimes className="text-sm" />
                            Cancel
                          </button>
                          <button 
                            onClick={saveAttendanceEdit}
                            disabled={editLoading}
                            className="horizon-btn-primary px-6 py-2 text-sm inline-flex items-center gap-2"
                            style={{ opacity: editLoading ? 0.6 : 1, cursor: editLoading ? 'not-allowed' : 'pointer' }}
                          >
                            {editLoading ? (
                              <>
                                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave className="text-sm" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={startEdit}
                            className="horizon-btn-primary px-6 py-2 text-sm inline-flex items-center gap-2"
                          >
                            <FaEdit className="text-sm" />
                            Edit Record
                          </button>
                          <button 
                            onClick={closeModal}
                            className="horizon-btn-secondary px-6 py-2 text-sm"
                          >
                            {t("teacher_attendance.close", "Close")}
                          </button>
                        </>
                      )}
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