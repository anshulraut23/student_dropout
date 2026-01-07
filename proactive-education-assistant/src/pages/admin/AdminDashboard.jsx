import { useState, useEffect } from 'react';
import { FaUserTie, FaChalkboard, FaUsers, FaExclamationTriangle, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { adminService } from '../../services/adminService';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const result = await adminService.getAnalytics();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Teachers',
      value: stats?.totalTeachers || 0,
      icon: FaUserTie,
      color: 'blue',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-300'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      icon: FaExclamationTriangle,
      color: 'yellow',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-300',
      alert: stats?.pendingApprovals > 0
    },
    {
      title: 'Total Classes',
      value: stats?.totalClasses || 0,
      icon: FaChalkboard,
      color: 'green',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-green-300'
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: FaUsers,
      color: 'purple',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-300'
    },
    {
      title: 'High-Risk Students',
      value: stats?.highRiskStudents || 0,
      icon: FaExclamationTriangle,
      color: 'red',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-300',
      alert: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome! Here's your school management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 ${stat.borderColor} ${stat.alert ? 'ring-2 ring-red-400' : ''} transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`text-2xl ${stat.textColor}`} />
                </div>
                {stat.alert && stat.value > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">Alert</span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.textColor} mb-3`}>{stat.value}</p>
              <div className={`h-1 w-8 rounded-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}></div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/admin/teachers"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-blue-500 transform hover:-translate-y-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-600 transition-all">
                <FaUserTie className="text-2xl text-blue-600 group-hover:text-white transition-all" />
              </div>
              <FaArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Teachers</h3>
            <p className="text-gray-600 text-sm">Approve & assign classes to teachers</p>
          </a>
          <a
            href="/admin/classes"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-green-500 transform hover:-translate-y-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-600 transition-all">
                <FaChalkboard className="text-2xl text-green-600 group-hover:text-white transition-all" />
              </div>
              <FaArrowRight className="text-green-600 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Classes</h3>
            <p className="text-gray-600 text-sm">Create and organize school classes</p>
          </a>
          <a
            href="/admin/data-import"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-purple-500 transform hover:-translate-y-2"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-600 transition-all">
                <FaUsers className="text-2xl text-purple-600 group-hover:text-white transition-all" />
              </div>
              <FaArrowRight className="text-purple-600 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Import Data</h3>
            <p className="text-gray-600 text-sm">Bulk upload student data via CSV</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
