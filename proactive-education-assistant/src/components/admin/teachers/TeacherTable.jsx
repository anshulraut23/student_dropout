import { FaCheck, FaTimes, FaUserPlus } from 'react-icons/fa';

function TeacherTable({ teachers, onApprove, onAssignClasses }) {
  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
    };

    const style = styles[status] || styles.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Classes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                  <div className="text-xs text-gray-500">Joined: {teacher.joinedDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{teacher.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{teacher.subject}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(teacher.status)}
                </td>
                <td className="px-6 py-4">
                  {teacher.assignedClasses.length > 0 ? (
                    <div className="text-sm text-gray-900">
                      {teacher.assignedClasses.join(', ')}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No classes assigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    {teacher.status === 'pending' && (
                      <button
                        onClick={() => onApprove(teacher)}
                        className="text-green-600 hover:text-green-900 flex items-center gap-1"
                        title="Approve Teacher"
                      >
                        <FaCheck /> Approve
                      </button>
                    )}
                    {teacher.status === 'approved' && (
                      <button
                        onClick={() => onAssignClasses(teacher)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="Assign Classes"
                      >
                        <FaUserPlus /> Assign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {teachers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No teachers found</p>
        </div>
      )}
    </div>
  );
}

export default TeacherTable;
