import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSpinner, FaUpload, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiService from "../../../services/apiService";

export default function AttendanceTab() {
  const [mode, setMode] = useState("manual");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    }
  }, [selectedClass]);

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

  const loadStudents = async () => {
    try {
      const result = await apiService.getStudents(selectedClass);
      if (result.success) {
        setStudents(result.students || []);
        // Initialize attendance state
        const initialAttendance = {};
        (result.students || []).forEach(student => {
          initialAttendance[student.id] = "present";
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      setMessage({ type: "error", text: "Failed to load students" });
    }
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate) {
      setMessage({ type: "error", text: "Please select class and date" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        classId: selectedClass,
        date: selectedDate,
        status,
        markedBy: "teacher"
      }));

      // Try to save to backend
      try {
        const result = await apiService.createAttendanceBulk(attendanceRecords);
        
        if (result.success) {
          setMessage({ type: "success", text: "Attendance saved successfully!" });
          setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } else {
          setMessage({ type: "error", text: result.error || "Failed to save attendance" });
        }
      } catch (apiError) {
        // If API is not available, save to localStorage as fallback
        console.log('API not available, saving locally:', apiError);
        
        // Save to localStorage
        const savedAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        const newRecord = {
          id: Date.now().toString(),
          date: selectedDate,
          classId: selectedClass,
          className: classes.find(c => c.id === selectedClass)?.name || 'Unknown Class',
          records: attendanceRecords,
          totalStudents: students.length,
          presentCount: attendanceRecords.filter(r => r.status === 'present').length,
          absentCount: attendanceRecords.filter(r => r.status === 'absent').length,
          markedAt: new Date().toISOString()
        };
        newRecord.attendancePercentage = Math.round((newRecord.presentCount / newRecord.totalStudents) * 100);
        
        savedAttendance.unshift(newRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendance));
        
        setMessage({ 
          type: "success", 
          text: "Attendance saved locally! (Backend API not available)" 
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error('Attendance submission error:', error);
      setMessage({ type: "error", text: "Failed to save attendance. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    try {
      const templateData = students.map(student => ({
        "Student Name": student.name,
        "Enrollment No": student.enrollmentNo,
        "Date": selectedDate,
        "Status": "Present"
      }));

      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

      worksheet['!cols'] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 }
      ];

      XLSX.writeFile(workbook, `attendance_template_${selectedDate}.xlsx`);
      setMessage({ type: "success", text: "Template downloaded successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    } catch (error) {
      console.error('Template download error:', error);
      setMessage({ type: "error", text: "Failed to download template" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setMessage({ type: "error", text: "Please upload a valid CSV or Excel file" });
      return;
    }

    setBulkFile(file);
    setMessage({ type: "", text: "" });
    setParsedData([]);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          
          if (jsonData.length === 0) {
            setMessage({ type: "error", text: "No data found in file" });
            setBulkFile(null);
            return;
          }

          setParsedData(jsonData);
          setMessage({ type: "success", text: `File parsed successfully! Found ${jsonData.length} records.` });
        } catch (error) {
          console.error('Parse error:', error);
          setMessage({ type: "error", text: "Failed to parse file" });
          setBulkFile(null);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('File read error:', error);
      setMessage({ type: "error", text: "Failed to read file" });
      setBulkFile(null);
    }
  };

  const handleBulkUpload = async () => {
    if (parsedData.length === 0) {
      setMessage({ type: "error", text: "Please upload a file first" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const attendanceRecords = parsedData.map(row => {
        const student = students.find(s => 
          s.enrollmentNo === row['Enrollment No'] || s.name === row['Student Name']
        );
        
        return {
          studentId: student?.id,
          classId: selectedClass,
          date: row.Date || selectedDate,
          status: (row.Status || 'Present').toLowerCase(),
        };
      }).filter(record => record.studentId);

      const result = await apiService.createAttendanceBulk(attendanceRecords);
      
      if (result.success) {
        setMessage({ type: "success", text: `Successfully uploaded ${attendanceRecords.length} attendance records!` });
        setBulkFile(null);
        setParsedData([]);
        document.getElementById('bulk-file-input').value = '';
      } else {
        setMessage({ type: "error", text: result.error || "Failed to upload attendance" });
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      setMessage({ type: "error", text: error.message || "Failed to upload attendance" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {mode === "manual" ? (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {selectedClass && students.length > 0 && (
            <>
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleMarkAll("present")}
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll("absent")}
                  className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  Mark All Absent
                </button>
              </div>

              {/* Students List */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-200 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student Name</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Enrollment No</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.enrollmentNo}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "present" }))}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  attendance[student.id] === "present"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <FaCheck className="inline mr-1" />
                                Present
                              </button>
                              <button
                                onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "absent" }))}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  attendance[student.id] === "absent"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <FaTimes className="inline mr-1" />
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Attendance"
                  )}
                </button>
              </div>
            </>
          )}

          {selectedClass && students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found in this class
            </div>
          )}
        </>
      ) : (
        <>
          {/* Bulk Upload Section */}
          {selectedClass && students.length > 0 && (
            <div className="mb-6">
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <FaDownload />
                Download Template
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Download template with current class students
              </p>
            </div>
          )}

          {/* Class Selection for Bulk */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">Upload Attendance Data</h3>
            <p className="text-xs text-gray-500 mb-4">CSV or Excel file</p>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
              <FaUpload className="text-xs" />
              Choose File
              <input
                type="file"
                id="bulk-file-input"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {bulkFile && (
              <div className="mt-4 text-sm text-gray-600">
                Selected: <span className="font-medium">{bulkFile.name}</span>
              </div>
            )}
          </div>

          {parsedData.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleBulkUpload}
                disabled={loading || !selectedClass}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Upload Attendance
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
