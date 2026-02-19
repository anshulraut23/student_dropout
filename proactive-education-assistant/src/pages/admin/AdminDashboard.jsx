import { OverviewCards } from '../../components/admin/dashboard/OverviewCards';
import { RiskPieChart } from '../../components/admin/dashboard/RiskPieChart';
import { RiskTrendChart } from '../../components/admin/dashboard/RiskTrendChart';
import { AlertsPanel } from '../../components/admin/dashboard/AlertsPanel';
import { useAdmin } from '../../context/AdminContext';

export const AdminDashboard = () => {
  const { stats, riskDistribution, riskTrendData, alerts, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-sm text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your school's performance and student risk levels
          </p>
        </div>

        {/* Overview Cards */}
        {stats && <OverviewCards stats={stats} />}

        {/* Charts and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Risk Distribution - Takes 1 column */}
          {riskDistribution.length > 0 && (
            <div className="lg:col-span-1">
              <RiskPieChart data={riskDistribution} />
            </div>
          )}

          {/* Alerts - Takes 2 columns */}
          {alerts.length > 0 && (
            <div className="lg:col-span-2">
              <AlertsPanel alerts={alerts} />
            </div>
          )}
        </div>

        {/* Trend Chart - Full width */}
        {riskTrendData.length > 0 && <RiskTrendChart data={riskTrendData} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
