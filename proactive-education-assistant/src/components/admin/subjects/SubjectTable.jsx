import { FaEdit, FaTrash } from 'react-icons/fa';

function SubjectTable({ subjects, onEdit, onDelete }) {
  const subjectList = Array.isArray(subjects) ? subjects : [];

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Subject Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Assigned Teacher
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
            {subjectList.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{subject.className}</div>
                </td>
                <td className="px-6 py-4">
                  {subject.teacherName ? (
                    <div className="text-sm text-gray-900">{subject.teacherName}</div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(subject.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(subject)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(subject.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subjectList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No subjects found</p>
        </div>
      )}
    </div>
  );
}

export default SubjectTable;
