import { useNavigate } from "react-router-dom";
import { students } from "../../data/students";
import RiskBadge from "../../components/RiskBadge";
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaUserPlus,
  FaClipboardList,
  FaChartLine,
  FaPlusCircle,
} from "react-icons/fa";

export default function DashboardPage() {
  const navigate = useNavigate();

  const stats = {
    total: students.length,
    high: students.filter(s => s.riskLevel === "high").length,
    medium: students.filter(s => s.riskLevel === "medium").length,
    low: students.filter(s => s.riskLevel === "low").length,
  };

  const highRiskStudents = students.filter(s => s.riskLevel === "high");

  // Quick actions
  const quickActions = [
    {
      title: "Add Attendance",
      icon: FaClipboardList,
      color: "blue",
      action: () => navigate("/data-entry")
    },
    {
      title: "Add Student",
      icon: FaUserPlus,
      color: "green",
      action: () => navigate("/students")
    },
    {
      title: "View Students",
      icon: FaUsers,
      color: "purple",
      action: () => navigate("/students")
    },
    {
      title: "Add Score",
      icon: FaPlusCircle,
      color: "orange",
      action: () => navigate("/data-entry")
    },
  ];

  // Mock data for risk trend
  const riskTrendData = [
    { month: 'Jan', high: 5, medium: 12, low: 28 },
    { month: 'Feb', high: 7, medium: 15, low: 23 },
    { month: 'Mar', high: 4, medium: 10, low: 31 },
    { month: 'Apr', high: 6, medium: 13, low: 26 },
    { month: 'May', high: 3, medium: 8, low: 34 },
  ];

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Early warning overview of student dropout risk
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Students" value={stats.total} icon={<FaUsers />} color="blue" />
          <StatCard title="High Risk" value={stats.high} icon={<FaExclamationTriangle />} color="red" />
          <StatCard title="Medium Risk" value={stats.medium} icon={<FaExclamationTriangle />} color="yellow" />
          <StatCard title="Low Risk" value={stats.low} icon={<FaCheckCircle />} color="green" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200',
                green: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200',
                purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200',
                orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200',
              };

              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 rounded-xl border-2 transition-all ${colorClasses[action.color]}`}
                >
                  <Icon className="text-2xl mb-2 mx-auto" />
                  <p className="text-sm font-medium">{action.title}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Risk Trend Graph */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Risk Analysis Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Student risk levels over the past 5 months</p>
              </div>
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {riskTrendData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-700">{data.month}</div>
                  <div className="flex-1 flex gap-1 h-8">
                    <div 
                      className="bg-red-500 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(data.high / stats.total) * 100}%` }}
                    >
                      {data.high > 0 && data.high}
                    </div>
                    <div 
                      className="bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(data.medium / stats.total) * 100}%` }}
                    >
                      {data.medium > 0 && data.medium}
                    </div>
                    <div 
                      className="bg-green-500 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(data.low / stats.total) * 100}%` }}
                    >
                      {data.low > 0 && data.low}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Low Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Students Requiring Immediate Attention
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                High-risk students need urgent intervention
              </p>
            </div>
            <button
              onClick={() => navigate("/students")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              View All
            </button>
          </div>

          {highRiskStudents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
              <p className="text-gray-600">
                No high-risk students currently
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Student</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Class</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Attendance</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Risk Level</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {highRiskStudents.slice(0, 5).map(student => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{student.class}</td>
                      <td className="px-6 py-4 text-gray-600">{student.attendance}%</td>
                      <td className="px-6 py-4">
                        <RiskBadge level={student.riskLevel} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">
            {title}
          </p>
          <p className="text-3xl font-semibold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <div className="text-xl">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
