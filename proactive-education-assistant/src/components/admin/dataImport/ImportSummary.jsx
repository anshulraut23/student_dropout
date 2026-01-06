import { FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa';

function ImportSummary({ result, onReset }) {
  const successRate = result.total > 0 
    ? Math.round((result.successful / result.total) * 100) 
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Summary Header */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          successRate >= 90 ? 'bg-green-100' : successRate >= 50 ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {successRate >= 90 ? (
            <FaCheckCircle className="text-4xl text-green-600" />
          ) : (
            <FaTimesCircle className="text-4xl text-yellow-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Import Complete</h2>
        <p className="text-gray-600 mt-2">
          {result.successful} of {result.total} records imported successfully
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-gray-900">{result.total}</p>
          <p className="text-sm text-gray-600 mt-1">Total Records</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-green-600">{result.successful}</p>
          <p className="text-sm text-gray-600 mt-1">Successful</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-3xl font-bold text-red-600">{result.failed}</p>
          <p className="text-sm text-gray-600 mt-1">Failed</p>
        </div>
      </div>

      {/* Success Rate */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Success Rate</span>
          <span className="text-sm font-medium text-gray-900">{successRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
              successRate >= 90 ? 'bg-green-600' : successRate >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Errors ({result.errors.length})
          </h3>
          <div className="max-h-48 overflow-y-auto bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="space-y-2">
              {result.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-800 flex gap-2">
                  <span className="font-medium">Row {error.row}:</span>
                  <span>{error.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaRedo /> Import Another File
        </button>
      </div>

      {/* Info Note */}
      {result.failed > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Failed records were skipped. You can review the errors above 
            and re-import those records after fixing the issues.
          </p>
        </div>
      )}
    </div>
  );
}

export default ImportSummary;
