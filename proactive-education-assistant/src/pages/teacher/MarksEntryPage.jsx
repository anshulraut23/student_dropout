import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import apiService from '../../services/apiService';

export default function MarksEntryPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [existingMarks, setExistingMarks] = useState({});

  useEffect(() => {
    loadExamAndMarks();
  }, [examId]);

  const loadExamAndMarks = async () => {
    try {
      setLoading(true);
      
      console.log('Loading exam and marks for examId:', examId);
      
      // Load exam details
      let examData;
      try {
        const examResponse = await apiService.getExamById(examId);
        console.log('Exam response:', examResponse);
        
        if (!examResponse || !examResponse.exam) {
          throw new Error('Invalid exam response from server');
        }
        
        examData = examResponse.exam;
        setExam(examData);
      } catch (examError) {
        console.error('Error loading exam:', examError);
        throw new Error(`Failed to load exam: ${examError.message}`);
      }

      // Load students
      try {
        const studentsResponse = await apiService.getStudents(examData.classId);
        console.log('Students response:', studentsResponse);
        setStudents(studentsResponse.students || []);
      } catch (studentsError) {
        console.error('Error loading students:', studentsError);
        // Continue even if students fail to load
        setStudents([]);
      }

      // Load existing marks
      try {
        const marksResponse = await apiService.getMarksByExam(examId);
        console.log('Marks response:', marksResponse);
        
        const existing = {};
        const current = {};
        
        (marksResponse.marks || []).forEach(mark => {
          const normalizedStatus = ['submitted', 'verified'].includes(mark.status) ? 'present' : mark.status;
          existing[mark.studentId] = mark;
          current[mark.studentId] = {
            marksObtained: mark.marksObtained,
            status: normalizedStatus,
            remarks: mark.remarks || ''
          };
        });

        setExistingMarks(existing);
        setMarksData(current);
      } catch (marksError) {
        console.error('Error loading marks:', marksError);
        // Continue even if marks fail to load
        setExistingMarks({});
        setMarksData({});
      }
      
    } catch (error) {
      console.error('Fatal error loading exam data:', error);
      
      let errorMessage = 'Error loading exam data: ' + error.message;
      
      if (error.message.includes('Cannot connect to backend')) {
        errorMessage = 'Cannot connect to backend server.\n\nPlease check:\n1. Backend is running on port 5000\n2. You are logged in\n3. Your auth token is valid';
      } else if (error.message.includes('Endpoint not found')) {
        errorMessage = 'API endpoint not found.\n\nThe exam or marks endpoint may not be available.';
      } else if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        errorMessage = 'Authentication failed.\n\nPlease logout and login again.';
      } else if (error.message.includes('Forbidden') || error.message.includes('403')) {
        errorMessage = 'Access denied.\n\nYou may not have permission to view this exam.';
      }
      
      alert(errorMessage);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleStatusChange = (studentId, status) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        marksObtained: status === 'present' ? (prev[studentId]?.marksObtained || 0) : 0
      }
    }));
  };

  const calculateGrade = (marks) => {
    if (!exam) return '-';
    const percentage = (marks / exam.totalMarks) * 100;
    
    if (percentage >= 91) return 'A+';
    if (percentage >= 81) return 'A';
    if (percentage >= 71) return 'B+';
    if (percentage >= 61) return 'B';
    if (percentage >= 51) return 'C+';
    if (percentage >= 41) return 'C';
    if (percentage >= 33) return 'D';
    return 'E';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare bulk marks data
    const marksArray = students.map(student => {
      const data = marksData[student.id] || {};
      return {
        studentId: student.id,
        marksObtained: parseFloat(data.marksObtained) || 0,
        status: data.status || 'present',
        remarks: data.remarks || ''
      };
    }).filter(m => m.status || m.marksObtained > 0);

    if (marksArray.length === 0) {
      alert('Please enter marks for at least one student');
      return;
    }

    // Validate marks
    for (const mark of marksArray) {
      if (mark.status === 'present' && (mark.marksObtained < 0 || mark.marksObtained > exam.totalMarks)) {
        alert(`Invalid marks for a student. Marks must be between 0 and ${exam.totalMarks}`);
        return;
      }
    }

    try {
      setSaving(true);
      
      console.log('Submitting marks:', { examId, marks: marksArray });
      
      const response = await apiService.enterBulkMarks({
        examId,
        marks: marksArray
      });

      console.log('Response:', response);

      if (response.success) {
        alert(`Marks saved successfully!\nEntered: ${response.entered}\nFailed: ${response.failed}`);
        if (response.failed > 0) {
          console.error('Errors:', response.errors);
        }
        loadExamAndMarks(); // Reload to show updated data
      }
    } catch (error) {
      console.error('Submit error:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('Cannot connect to backend')) {
        alert('Cannot connect to backend server.\n\nPlease make sure:\n1. Backend server is running (npm start in backend folder)\n2. Server is running on http://localhost:5000\n3. Check the backend terminal for errors');
      } else if (error.message.includes('Endpoint not found')) {
        alert('API endpoint not found.\n\nPlease make sure:\n1. Backend server is running\n2. All routes are properly registered\n3. Check backend/server.js for /api/marks/bulk route');
      } else {
        alert('Error saving marks: ' + error.message + '\n\nCheck the console for more details.');
      }
    } finally {
      setSaving(false);
    }
  };

  const getProgress = () => {
    if (!students.length) return 0;
    const entered = Object.keys(existingMarks).length;
    return Math.round((entered / students.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 pt-20 md:pt-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading exam data...</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="p-6 pt-20 md:pt-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Exam not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pt-20 md:pt-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft />
            Back to Exams
          </button>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{exam.name}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Class:</span> {exam.className}
              </div>
              <div>
                <span className="font-medium">Subject:</span> {exam.subjectName}
              </div>
              <div>
                <span className="font-medium">Total Marks:</span> {exam.totalMarks}
              </div>
              <div>
                <span className="font-medium">Passing Marks:</span> {exam.passingMarks}
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress: {Object.keys(existingMarks).length}/{students.length} students</span>
                <span>{getProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Marks Entry Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saved
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => {
                  const data = marksData[student.id] || {};
                  const marks = parseFloat(data.marksObtained) || 0;
                  const status = data.status || 'present';
                  const percentage = status === 'present' ? ((marks / exam.totalMarks) * 100).toFixed(2) : '-';
                  const grade = status === 'present' ? calculateGrade(marks) : '-';
                  const isSaved = !!existingMarks[student.id];

                  return (
                    <tr key={student.id} className={isSaved ? 'bg-green-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                        <div className="text-xs text-gray-500">{student.enrollmentNo}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          value={data.marksObtained || ''}
                          onChange={(e) => handleMarksChange(student.id, 'marksObtained', e.target.value)}
                          min="0"
                          max={exam.totalMarks}
                          step="0.01"
                          disabled={status !== 'present'}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          placeholder="0"
                        />
                        <span className="ml-1 text-sm text-gray-500">/ {exam.totalMarks}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {percentage}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          grade === 'A+' || grade === 'A' ? 'bg-green-100 text-green-800' :
                          grade === 'B+' || grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade === 'C+' || grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          grade === 'E' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="exempted">Exempted</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={data.remarks || ''}
                          onChange={(e) => handleMarksChange(student.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Optional"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isSaved && (
                          <FaCheckCircle className="inline text-green-600" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FaSave />
              {saving ? 'Saving...' : 'Save All Marks'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
