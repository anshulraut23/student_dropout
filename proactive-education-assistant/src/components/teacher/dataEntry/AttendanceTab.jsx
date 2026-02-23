import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSpinner, FaUpload, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import apiService from "../../../services/apiService";

export default function AttendanceTab() {
  const [mode, setMode] = useState("manual");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceMode, setAttendanceMode] = useState("daily");
  const [teacherRole, setTeacherRole] = useState(""); // incharge, subject_teacher, or both
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      checkClassAttendanceMode();
    } else {
      setStudents([]);
      setAvailableSubjects([]);
      setSelectedSubject("");
      setIsAttendanceMarked(false);
      setExistingAttendance([]);
      setIsEditMode(false);
    }
  }, [selectedClass]);

  // Check for existing attendance when date or subject changes
  useEffect(() => {
    if (selectedClass && selectedDate) {
      // For daily attendance, check immediately
      if (attendanceMode === 'daily') {
        checkExistingAttendance();
      }
      // For subject-wise attendance, only check when subject is selected
      else if ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && selectedSubject) {
        checkExistingAttendance();
      }
      // If subject-wise but no subject selected, clear the banner
      else if ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && !selectedSubject) {
        setIsAttendanceMarked(false);
        setExistingAttendance([]);
        setIsEditMode(false);
      }
    }
  }, [selectedClass, selectedDate, selectedSubject, attendanceMode, students]);

  const checkExistingAttendance = async () => {
    try {
      // Don't check if we don't have the required information
      if (!selectedClass || !selectedDate) {
        setIsAttendanceMarked(false);
        setExistingAttendance([]);
        return;
      }
      
      // For subject-wise attendance, don't check until subject is selected
      if ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && !selectedSubject) {
        setIsAttendanceMarked(false);
        setExistingAttendance([]);
        return;
      }
      
      const filters = {
        date: selectedDate
      };
      
      // Only add subjectId if in subject-wise mode and subject is selected
      if ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && selectedSubject) {
        filters.subjectId = selectedSubject;
      }

      console.log('Checking existing attendance with filters:', filters);
      console.log('Selected class:', selectedClass);
      console.log('Attendance mode:', attendanceMode);
      
      const result = await apiService.getClassAttendance(selectedClass, filters);
      console.log('Existing attendance result:', result);
      console.log('Marked count:', result.marked);
      console.log('Attendance array:', result.attendance);
      
      // Check if attendance is actually marked by looking at the 'marked' count
      // The backend returns all students with status:null if no attendance is marked
      const hasAttendance = result.success && 
                           result.marked > 0 && // This is the key check!
                           result.attendance && 
                           Array.isArray(result.attendance);
      
      if (hasAttendance) {
        console.log('Setting attendance as marked');
        setIsAttendanceMarked(true);
        setExistingAttendance(result.attendance);
        
        // Load existing attendance into state (only non-null statuses)
        const existingData = {};
        result.attendance.forEach(record => {
          if (record.status) {
            existingData[record.studentId] = record.status;
          }
        });
        setAttendance(existingData);
        setIsEditMode(false);
      } else {
        console.log('No attendance found, clearing state');
        setIsAttendanceMarked(false);
        setExistingAttendance([]);
        setIsEditMode(false);
        
        // Initialize with 'present' for all students
        const initialAttendance = {};
        students.forEach(student => {
          initialAttendance[student.id] = "present";
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Failed to check existing attendance:', error);
      setIsAttendanceMarked(false);
      setExistingAttendance([]);
      setIsEditMode(false);
    }
  };

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      if (result.success) {
        // For attendance, show:
        // 1. Classes where teacher is incharge (for daily attendance)
        // 2. Classes where teacher teaches subjects (for subject-wise attendance)
        const allClasses = result.classes || [];
        
        // Filter classes where teacher has any role
        const attendanceClasses = allClasses.filter(cls => 
          cls.isIncharge || 
          cls.role === 'incharge' || 
          cls.role === 'both' ||
          cls.role === 'subject_teacher' ||
          (cls.subjects && cls.subjects.length > 0)
        );
        
        setClasses(attendanceClasses);
        
        if (attendanceClasses.length === 0) {
          setMessage({
            type: "warning",
            text: "You are not assigned to any classes. Please contact admin."
          });
          setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
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

  const checkClassAttendanceMode = async () => {
    try {
      // Find the selected class details
      const classData = classes.find(c => c.id === selectedClass);
      if (!classData) return;

      // Set attendance mode
      setAttendanceMode(classData.attendanceMode || 'daily');
      
      // Set teacher role
      setTeacherRole(classData.role || 'incharge');

      // If subject-wise mode, load subjects (check all formats: 'subject', 'subject-wise', 'subject_wise')
      if (classData.attendanceMode === 'subject' || classData.attendanceMode === 'subject-wise' || classData.attendanceMode === 'subject_wise') {
        // Load subjects for this class
        const subjectsResult = await apiService.getSubjectsByClass(selectedClass);
        
        if (subjectsResult.success) {
          // Filter to show only subjects this teacher teaches
          let teacherSubjects = subjectsResult.subjects || [];
          
          // If teacher is not incharge, show only their subjects
          if (classData.role === 'subject_teacher') {
            // Get current user ID from token or state
            const currentUser = await apiService.getCurrentUser();
            if (currentUser.success) {
              teacherSubjects = teacherSubjects.filter(
                subject => subject.teacherId === currentUser.user.id
              );
            }
          }
          // If incharge or both, show all subjects
          
          setAvailableSubjects(teacherSubjects);
          
          // Auto-select first subject if only one
          if (teacherSubjects.length === 1) {
            setSelectedSubject(teacherSubjects[0].id);
          }
        }
      } else {
        setAvailableSubjects([]);
        setSelectedSubject("");
      }
    } catch (error) {
      console.error('Failed to check attendance mode:', error);
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
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    // Check if subject is required but not selected
    if ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && !selectedSubject) {
      setMessage({ type: "error", text: "Please select a subject" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare bulk attendance data for new API
      const attendanceArray = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }));

      const bulkData = {
        classId: selectedClass,
        subjectId: (attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') ? selectedSubject : null,
        date: selectedDate,
        attendance: attendanceArray
      };

      // Use new bulk attendance API
      const result = await apiService.markBulkAttendance(bulkData);
      
      if (result.success) {
        const successCount = result.marked || 0;
        const failCount = result.failed || 0;
        
        let messageText = '';
        if (failCount === 0) {
          messageText = `✅ Attendance saved successfully! ${successCount} student${successCount !== 1 ? 's' : ''} marked.`;
        } else {
          messageText = `⚠️ Attendance partially saved. ${successCount} successful, ${failCount} failed.`;
        }
        
        setMessage({ 
          type: failCount === 0 ? "success" : "warning", 
          text: messageText
        });
        
        // Show errors if any
        if (result.errors && result.errors.length > 0) {
          console.error('Attendance errors:', result.errors);
          // Log detailed error information
          result.errors.forEach((err, index) => {
            console.error(`Error ${index + 1}:`, err);
          });
        }
        
        // Refresh to show as "already marked"
        await checkExistingAttendance();
        
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      } else {
        setMessage({ 
          type: "error", 
          text: `❌ Failed to save attendance: ${result.error || 'Unknown error'}` 
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      }
    } catch (error) {
      console.error('Attendance submission error:', error);
      setMessage({ 
        type: "error", 
        text: `❌ Error: ${error.message || 'Failed to save attendance. Please try again.'}` 
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
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

    // Check if subject is required but not selected
    if ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && !selectedSubject) {
      setMessage({ type: "error", text: "Please select a subject" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Map parsed data to attendance array
      const attendanceArray = parsedData.map(row => {
        const student = students.find(s => 
          s.enrollmentNo === row['Enrollment No'] || s.name === row['Student Name']
        );
        
        return {
          studentId: student?.id,
          status: (row.Status || 'Present').toLowerCase()
        };
      }).filter(record => record.studentId);

      const bulkData = {
        classId: selectedClass,
        subjectId: (attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') ? selectedSubject : null,
        date: selectedDate,
        attendance: attendanceArray
      };

      // Use new bulk attendance API
      const result = await apiService.markBulkAttendance(bulkData);
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: `Successfully uploaded! ${result.marked} students marked, ${result.failed} failed.` 
        });
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
        <div className={`mb-4 p-4 rounded-lg text-sm font-medium border-2 ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border-green-300" 
            : message.type === "warning"
            ? "bg-yellow-50 text-yellow-800 border-yellow-300"
            : "bg-red-50 text-red-800 border-red-300"
        }`}>
          <div className="flex items-start gap-2">
            {message.type === "success" && (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {message.type === "warning" && (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {message.type === "error" && (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
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

            {/* Subject Selection - Only for subject-wise attendance */}
            {(attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && availableSubjects.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a subject</option>
                  {availableSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Info message for subject-wise attendance */}
          {(attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && selectedClass && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              <strong>Subject-wise Attendance:</strong> This class uses subject-wise attendance. 
              {teacherRole === 'subject_teacher' 
                ? ' You can mark attendance only for subjects you teach.'
                : ' You can mark attendance for all subjects as class incharge.'}
            </div>
          )}

          {/* Attendance Already Marked Banner */}
          {isAttendanceMarked && !isEditMode && selectedClass && students.length > 0 && (
            attendanceMode === 'daily' || ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && selectedSubject)
          ) && (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-green-800">Attendance Already Marked</h3>
                    <p className="text-xs text-green-700 mt-1">
                      Attendance for this {(attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') ? 'subject' : 'class'} on {new Date(selectedDate).toLocaleDateString()} has been recorded.
                      <br />
                      <span className="font-medium">
                        Present: {existingAttendance.filter(a => a.status === 'present').length} | 
                        Absent: {existingAttendance.filter(a => a.status === 'absent').length} | 
                        Late: {existingAttendance.filter(a => a.status === 'late').length}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Attendance
                </button>
              </div>
            </div>
          )}

          {selectedClass && students.length > 0 && (
            attendanceMode === 'daily' || ((attendanceMode === 'subject' || attendanceMode === 'subject-wise' || attendanceMode === 'subject_wise') && selectedSubject)
          ) && (isEditMode || !isAttendanceMarked) && (
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
                                onClick={() => {
                                  setAttendance(prev => ({ ...prev, [student.id]: "present" }));
                                }}
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
                                onClick={() => {
                                  setAttendance(prev => ({ ...prev, [student.id]: "absent" }));
                                }}
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
              <div className="flex justify-end gap-3">
                {isEditMode && (
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      checkExistingAttendance(); // Reload original data
                    }}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {isEditMode ? 'Update Attendance' : 'Save Attendance'}
                    </>
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
