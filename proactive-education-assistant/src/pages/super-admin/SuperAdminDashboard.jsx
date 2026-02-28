import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [statsRes, schoolsRes] = await Promise.all([
          apiService.getPlatformStats(),
          apiService.getAllSchoolsSummary()
        ]);

        setStats(statsRes.stats || null);
        setSchools(schoolsRes.schools || []);
      } catch (err) {
        setError(err.message || 'Failed to load super admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-700">Loading super admin dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Cross-school platform governance overview</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Total Schools" value={stats?.totalSchools ?? 0} />
        <StatCard title="Total Teachers" value={stats?.totalTeachers ?? 0} />
        <StatCard title="Total Students" value={stats?.totalStudents ?? 0} />
        <StatCard title="High Risk Students" value={stats?.totalHighRiskStudents ?? 0} />
        <StatCard title="Active Interventions" value={stats?.totalActiveInterventions ?? 0} />
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <h2 className="font-semibold text-gray-800">School-wise Risk Breakdown</h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">School</th>
                <th className="text-left px-4 py-2">Students</th>
                <th className="text-left px-4 py-2">High Risk</th>
                <th className="text-left px-4 py-2">Risk %</th>
                <th className="text-left px-4 py-2">Intervention %</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr
                  key={school.id}
                  className="border-t border-gray-100 cursor-pointer hover:bg-blue-50/60"
                  onClick={() => navigate(`/super-admin/schools/${school.id}`)}
                >
                  <td className="px-4 py-2 font-medium text-gray-900">{school.name}</td>
                  <td className="px-4 py-2">{school.studentsCount}</td>
                  <td className="px-4 py-2">{school.highRiskCount}</td>
                  <td className="px-4 py-2">{school.riskPercentage}%</td>
                  <td className="px-4 py-2">{school.interventionPercentage}%</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${school.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {!schools.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No schools found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-3 space-y-3">
          {schools.map((school) => (
            <button
              key={school.id}
              type="button"
              onClick={() => navigate(`/super-admin/schools/${school.id}`)}
              className="w-full text-left border border-gray-200 rounded-xl p-3 bg-white hover:bg-blue-50/60"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900">{school.name}</p>
                <span className={`px-2 py-1 rounded text-xs ${school.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                  {school.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <p>Students: <span className="font-medium text-gray-800">{school.studentsCount}</span></p>
                <p>High Risk: <span className="font-medium text-gray-800">{school.highRiskCount}</span></p>
                <p>Risk %: <span className="font-medium text-gray-800">{school.riskPercentage}%</span></p>
                <p>Intervention %: <span className="font-medium text-gray-800">{school.interventionPercentage}%</span></p>
              </div>
            </button>
          ))}
          {!schools.length && (
            <div className="px-4 py-6 text-center text-gray-500">No schools found</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <p className="text-xs uppercase text-gray-500 tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
