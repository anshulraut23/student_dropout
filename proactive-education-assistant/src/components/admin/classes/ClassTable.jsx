import { FaEdit, FaBan } from 'react-icons/fa';

function ClassTable({ classes, onEdit, onDeactivate }) {
  // Ensure classes is always an array
  const classList = Array.isArray(classes) ? classes : [];

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
        Inactive
      </span>
    );
  };

  const getAttendanceModeBadge = (mode) => {
    return mode === 'daily' ? (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
        Daily
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700">
        Subject-wise
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Class Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Academic Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Incharge
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Attendance Mode
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classList.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                  <div className="text-xs text-gray-500">
                    Grade {cls.grade}{cls.section ? ` - Section ${cls.section}` : ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{cls.academicYear}</div>
                </td>
                <td className="px-6 py-4">
                  {cls.inchargeName ? (
                    <div className="text-sm text-gray-900">{cls.inchargeName}</div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getAttendanceModeBadge(cls.attendanceMode)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(cls.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(cls)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => onDeactivate(cls.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium text-sm"
                    >
                      <FaBan /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {classList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classes found</p>
        </div>
      )}
    </div>
  );
}

export default ClassTable;
