import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/apiService';

export default function SuperAdminSchoolDetailPage() {
  const { schoolId } = useParams();
  const [summary, setSummary] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [highRiskStudents, setHighRiskStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [summaryResponse, updatesResponse, highRiskResponse] = await Promise.all([
          apiService.getSchoolSummary(schoolId),
          apiService.getSchoolUpdates(schoolId),
          apiService.getSchoolHighRiskStudents(schoolId)
        ]);

        setSummary(summaryResponse.summary || null);
        setUpdates(updatesResponse.updates || []);
        setHighRiskStudents(highRiskResponse.students || []);
      } catch (err) {
        setError(err.message || 'Failed to load school details');
      } finally {
        setLoading(false);
      }
    };

    if (schoolId) {
      loadData();
    }
  }, [schoolId]);

  if (loading) {
    return <div className="p-6 text-gray-700">Loading school details...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{summary?.schoolName || 'School Details'}</h1>
          <p className="text-sm text-gray-600">Live school metrics and recent updates</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Students" value={summary?.totalStudents ?? 0} />
        <StatCard title="Teachers" value={summary?.totalTeachers ?? 0} />
        <StatCard title="High Risk" value={summary?.highRiskStudents ?? 0} />
        <StatCard title="Risk %" value={`${summary?.riskPercentage ?? 0}%`} />
        <StatCard title="Active Interventions" value={summary?.activeInterventions ?? 0} />
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">High-Risk Students</h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Student</th>
                <th className="text-left px-4 py-2">Class</th>
                <th className="text-left px-4 py-2">Risk Level</th>
                <th className="text-left px-4 py-2">Risk Score</th>
                <th className="text-left px-4 py-2">Confidence</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {highRiskStudents.map((student) => (
                <tr key={student.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">{student.name}</td>
                  <td className="px-4 py-2">{student.className || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${student.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {student.riskLevel || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{student.riskScore !== null && student.riskScore !== undefined ? `${student.riskScore}%` : '-'}</td>
                  <td className="px-4 py-2">{student.confidence || '-'}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className="px-3 py-1 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {!highRiskStudents.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No high-risk students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-3 space-y-3">
          {highRiskStudents.map((student) => (
            <div key={student.id} className="border border-gray-200 rounded-xl p-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                <span className={`px-2 py-1 rounded text-xs ${student.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                  {student.riskLevel || '-'}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Class: {student.className || '-'}</p>
              <p className="text-xs text-gray-600 mt-1">Risk Score: {student.riskScore !== null && student.riskScore !== undefined ? `${student.riskScore}%` : '-'}</p>
              <button
                type="button"
                onClick={() => setSelectedStudent(student)}
                className="mt-2 w-full px-3 py-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                View Profile
              </button>
            </div>
          ))}
          {!highRiskStudents.length && (
            <div className="px-4 py-6 text-center text-gray-500">No high-risk students found</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Recent School Updates</h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Time</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Update</th>
                <th className="text-left px-4 py-2">Actor</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-2">{formatDateTime(item.time)}</td>
                  <td className="px-4 py-2">{formatType(item.type)}</td>
                  <td className="px-4 py-2 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-2">{item.actorName || '-'}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                      {item.status || '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {!updates.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No updates found for this school</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-3 space-y-3">
          {updates.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">{item.status || '-'}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{formatType(item.type)} • {item.actorName || '-'}</p>
              <p className="text-xs text-gray-500 mt-1">{formatDateTime(item.time)}</p>
            </div>
          ))}
          {!updates.length && (
            <div className="px-4 py-6 text-center text-gray-500">No updates found for this school</div>
          )}
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-600">{selectedStudent.className || '-'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <InfoItem label="Risk Level" value={selectedStudent.riskLevel || '-'} />
              <InfoItem label="Risk Score" value={selectedStudent.riskScore !== null && selectedStudent.riskScore !== undefined ? `${selectedStudent.riskScore}%` : '-'} />
              <InfoItem label="Confidence" value={selectedStudent.confidence || '-'} />
              <InfoItem label="Contact" value={selectedStudent.contactNumber || '-'} />
              <InfoItem label="Father Name" value={selectedStudent.fatherName || '-'} />
              <InfoItem label="Mother Name" value={selectedStudent.motherName || '-'} />
            </div>

            {Array.isArray(selectedStudent.recommendations) && selectedStudent.recommendations.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Recommendations</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {selectedStudent.recommendations.slice(0, 5).map((item, index) => (
                    <li key={`${selectedStudent.id}-rec-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
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

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function formatType(type) {
  if (type === 'admin_registration') return 'Admin Registration';
  if (type === 'teacher_request') return 'Teacher Request';
  if (type === 'intervention') return 'Intervention';
  return type || '-';
}

function InfoItem({ label, value }) {
  return (
    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
      <p className="text-xs uppercase text-gray-500 tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-1">{value}</p>
    </div>
  );
}
