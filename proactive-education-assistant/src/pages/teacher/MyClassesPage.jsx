import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaBook, FaCalendar, FaEye, FaUserTie } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function MyClassesPage() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyClasses();
  }, []);

  const loadMyClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getMyClasses();
      if (result.success) {
        setClasses(result.classes || []);
      } else {
        setError(result.error || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Load classes error:', err);
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const inchargeClasses = classes.filter(c => c.role === 'incharge' || c.role === 'both');
  const subjectTeacherClasses = classes.filter(c => c.role === 'subject_teacher' || c.role === 'both');

  const getRoleBadge = (role, isIncharge) => {
    if (role === 'both') {
      return (
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <FaUserTie className="mr-1" /> Class Incharge
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <FaBook className="mr-1" /> Subject Teacher
          </span>
        </div>
      );
    }
    
    return role === 'incharge' || isIncharge ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <FaUserTie className="mr-1" /> Class Incharge
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
        <FaBook className="mr-1" /> Subject Teacher
      </span>
    );
  };

  const getAttendanceModeBadge = (mode) => {
    return mode === 'daily' ? (
      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
        Daily Attendance
      </span>
    ) : (
      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
        Subject-wise Attendance
      </span>
    );
  };

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view your assigned classes</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="text-2xl font-semibold text-gray-900">{classes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaChalkboardTeacher className="text-xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">As Incharge</p>
                <p className="text-2xl font-semibold text-gray-900">{inchargeClasses.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaUserTie className="text-xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">As Subject Teacher</p>
                <p className="text-2xl font-semibold text-gray-900">{subjectTeacherClasses.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaBook className="text-xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((classItem) => (
            <div
              key={`${classItem.id}-${classItem.role}`}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      Grade {classItem.grade}{classItem.section ? ` - Section ${classItem.section}` : ''}
                    </span>
                  </div>
                  <div className="mt-2">
                    {getRoleBadge(classItem.role, classItem.isIncharge)}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/students?class=${classItem.id}`)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Students"
                >
                  <FaEye />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {/* Academic Year */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-sm text-gray-400" />
                    <span className="text-sm text-gray-600">Academic Year</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{classItem.academicYear}</span>
                </div>

                {/* Attendance Mode */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Attendance Mode</span>
                  {getAttendanceModeBadge(classItem.attendanceMode)}
                </div>

                {/* Subjects (for subject teachers or both) */}
                {(classItem.role === 'subject_teacher' || classItem.role === 'both') && classItem.subjects && classItem.subjects.length > 0 && (
                  <div className="py-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600 block mb-2">Teaching Subjects:</span>
                    <div className="flex flex-wrap gap-1">
                      {classItem.subjects.map((subject) => (
                        <span
                          key={subject.id}
                          className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs"
                        >
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role Description */}
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {classItem.role === 'incharge' 
                      ? 'You are the class incharge. You can manage students and mark attendance.'
                      : classItem.role === 'both'
                      ? 'You are the class incharge and also teach subjects in this class.'
                      : 'You teach specific subjects in this class. You can mark attendance for your subjects.'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                {(classItem.role === 'incharge' || classItem.role === 'both') && (
                  <button
                    onClick={() => navigate(`/add-student?class=${classItem.id}`)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Add Students
                  </button>
                )}
                <button
                  onClick={() => navigate(`/data-entry?class=${classItem.id}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => navigate(`/students?class=${classItem.id}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Students
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FaChalkboardTeacher className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-600">No classes assigned yet</p>
            <p className="text-sm text-gray-500 mt-1">Contact your administrator to get classes assigned</p>
          </div>
        )}

      </div>
    </div>
  );
}
