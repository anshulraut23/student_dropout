import { useState } from 'react';
import { adminService } from '../../services/adminService';
import UploadBox from '../../components/admin/dataImport/UploadBox';
import ImportSummary from '../../components/admin/dataImport/ImportSummary';

function DataImport() {
  const [importType, setImportType] = useState('students');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const importTypes = [
    { value: 'students', label: 'Student Data', description: 'Import student records' },
    { value: 'attendance', label: 'Attendance Data', description: 'Import attendance records' },
    { value: 'marks', label: 'Marks/Grades', description: 'Import marks and grades' }
  ];

  const handleImport = async (file) => {
    setImporting(true);
    setImportResult(null);

    try {
      const result = await adminService.importData(file, importType);
      setImportResult(result.data);
    } catch (error) {
      setImportResult({
        total: 0,
        successful: 0,
        failed: 0,
        errors: [{ row: 0, reason: 'Import failed: ' + error.message }]
      });
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
        <p className="text-gray-600 mt-1">Bulk upload student, attendance, and marks data</p>
      </div>

      {/* Import Type Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Import Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {importTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setImportType(type.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                importType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <p className="font-semibold text-gray-900">{type.label}</p>
              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">Import Guidelines:</h3>
        <ul className="text-sm text-yellow-800 space-y-1 ml-4 list-disc">
          <li>File format: CSV or Excel (.xlsx)</li>
          <li>Column-based mapping (column order doesn't matter)</li>
          <li>Row order is irrelevant</li>
          <li>Invalid rows will be skipped automatically</li>
          <li>Maximum file size: 10 MB</li>
        </ul>
      </div>

      {/* Upload Box */}
      {!importResult && (
        <UploadBox
          onUpload={handleImport}
          importing={importing}
          importType={importType}
        />
      )}

      {/* Import Summary */}
      {importResult && (
        <ImportSummary
          result={importResult}
          onReset={handleReset}
        />
      )}

      {/* Sample Format */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sample Format for {importTypes.find(t => t.value === importType)?.label}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                {importType === 'students' && (
                  <>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  </>
                )}
                {importType === 'attendance' && (
                  <>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </>
                )}
                {importType === 'marks' && (
                  <>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max Marks</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exam Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importType === 'students' && (
                <>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">S001</td>
                    <td className="px-4 py-2 text-sm text-gray-900">John Doe</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Grade 7A</td>
                    <td className="px-4 py-2 text-sm text-gray-900">john@example.com</td>
                    <td className="px-4 py-2 text-sm text-gray-900">7</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">S002</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Jane Smith</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Grade 7B</td>
                    <td className="px-4 py-2 text-sm text-gray-900">jane@example.com</td>
                    <td className="px-4 py-2 text-sm text-gray-900">7</td>
                  </tr>
                </>
              )}
              {importType === 'attendance' && (
                <>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">S001</td>
                    <td className="px-4 py-2 text-sm text-gray-900">2026-01-06</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Present</td>
                    <td className="px-4 py-2 text-sm text-gray-900">-</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">S002</td>
                    <td className="px-4 py-2 text-sm text-gray-900">2026-01-06</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Absent</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Sick</td>
                  </tr>
                </>
              )}
              {importType === 'marks' && (
                <>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-900">S001</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Mathematics</td>
                    <td className="px-4 py-2 text-sm text-gray-900">85</td>
                    <td className="px-4 py-2 text-sm text-gray-900">100</td>
                    <td className="px-4 py-2 text-sm text-gray-900">2026-01-05</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">S002</td>
                    <td className="px-4 py-2 text-sm text-gray-900">Science</td>
                    <td className="px-4 py-2 text-sm text-gray-900">78</td>
                    <td className="px-4 py-2 text-sm text-gray-900">100</td>
                    <td className="px-4 py-2 text-sm text-gray-900">2026-01-05</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataImport;
