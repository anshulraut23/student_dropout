import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { students as initialStudents } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
import {
  FaSearch,
  FaFileExport,
  FaEye,
  FaSortAmountDown,
} from "react-icons/fa";

export default function StudentListPage() {
  const navigate = useNavigate();
  const [studentsList] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterClass, setFilterClass] = useState("all");

  // Get unique classes
  const uniqueClasses = [...new Set(studentsList.map(s => s.class))].sort();

  // Filter and sort students
  let filteredStudents = studentsList.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === "all" || student.riskLevel === filterRisk;
    const matchesClass = filterClass === "all" || student.class === filterClass;
    return matchesSearch && matchesRisk && matchesClass;
  });

  // Sort students
  filteredStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "class":
        return a.class.localeCompare(b.class);
      case "attendance":
        return b.attendance - a.attendance;
      case "risk":
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      default:
        return 0;
    }
  });

  // Export to CSV
  const handleExport = () => {
    const headers = ["Name", "Class", "Attendance", "Risk Level"];
    const rows = filteredStudents.map(student => [
      student.name,
      student.class,
      `${student.attendance}%`,
      student.riskLevel
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
            <p className="text-sm text-gray-500 mt-1">{filteredStudents.length} total students</p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFileExport className="text-sm" />
            Export
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="text-gray-400 text-sm" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="class">Sort by Class</option>
                <option value="attendance">Sort by Attendance</option>
                <option value="risk">Sort by Risk</option>
              </select>
            </div>

            {/* Filter by Risk */}
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            {/* Filter by Class */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-600">{student.class}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-16">
                            <div
                              className={`h-1.5 rounded-full ${
                                student.attendance >= 75
                                  ? 'bg-green-500'
                                  : student.attendance >= 50
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            student.attendance >= 75
                              ? 'text-green-600'
                              : student.attendance >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <RiskBadge level={student.riskLevel} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <FaEye className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaSearch className="mx-auto text-3xl text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No students found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
