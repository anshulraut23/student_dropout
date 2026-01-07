import { FaEdit, FaBan } from 'react-icons/fa';

function ClassTable({ classes, onEdit, onDeactivate }) {
  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-300">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-300">
        Inactive
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class Name
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Students
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Teachers
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[180px] sm:max-w-none">{cls.name}</div>
                  <div className="text-xs text-gray-500">Grade {cls.grade}</div>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <div className="text-sm text-gray-900 line-clamp-2 sm:line-clamp-none">{cls.description}</div>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cls.studentCount}</div>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  {cls.assignedTeachers.length > 0 ? (
                    <div className="text-sm text-gray-900 truncate max-w-[200px] sm:max-w-none">
                      {cls.assignedTeachers.join(', ')}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No teachers assigned</span>
                  )}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {getStatusBadge(cls.status)}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => onEdit(cls)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      title="Edit Class"
                    >
                      <FaEdit className="hidden sm:inline" /> <span>Edit</span>
                    </button>
                    {cls.status === 'active' && (
                      <button
                        onClick={() => onDeactivate(cls.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        title="Deactivate Class"
                      >
                        <FaBan className="hidden sm:inline" /> <span>Deactivate</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {classes.length === 0 && (
        <div className="text-center py-10 sm:py-12">
          <p className="text-gray-500">No classes found</p>
        </div>
      )}
    </div>
  );
}

export default ClassTable;
