import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function StudentListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classIdFromUrl = searchParams.get('class');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, [classIdFromUrl]);

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading students for class:', classIdFromUrl);
      const result = await apiService.getStudents(classIdFromUrl);
      console.log('Students result:', result);
      
      if (result.success) {
        setStudents(result.students || []);
      } else {
        setError(result.error || 'Failed to load students');
      }
    } catch (err) {
      console.error('Load students error:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Students</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={loadStudents}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500 mt-1">
          {students.length} student{students.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {students.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Enrollment No
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    {student.email && (
                      <div className="text-xs text-gray-500">{student.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm text-gray-600">{student.enrollmentNo}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm text-gray-600">{student.className || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="text-sm text-gray-600">{student.contact || '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500">No students found</p>
          <button
            onClick={() => navigate('/add-student')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Students
          </button>
        </div>
      )}
    </div>
  );
}
