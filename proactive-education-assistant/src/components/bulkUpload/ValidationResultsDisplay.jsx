import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function ValidationResultsDisplay({ 
  validationResults, 
  onConfirm, 
  onCancel, 
  type = 'attendance',
  loading = false 
}) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    warnings: false,
    errors: false,
    preview: false
  });

  const { valid, errors, warnings, summary } = validationResults;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    if (status === 'present') return '#10b981';
    if (status === 'absent') return '#ef4444';
    if (status === 'pass' || status === 'true') return '#10b981';
    if (status === 'fail' || status === 'false') return '#ef4444';
    return '#6b7a8d';
  };

  const canConfirm = errors.length === 0 && valid.length > 0;

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px', background: '#f5f8fb' }}>
      
      {/* AI Explanation Section - Prominent at top */}
      {summary.explanation && (
        <div
          style={{
            background: errors.length > 0 
              ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
              : warnings.length > 0 
                ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: errors.length > 0 
              ? '2px solid #ef4444' 
              : warnings.length > 0 
                ? '2px solid #fbbf24'
                : '2px solid #10b981',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '12px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#1f2937',
            whiteSpace: 'pre-line'
          }}>
            <div style={{ fontSize: '24px', flexShrink: 0 }}>
              {errors.length > 0 ? '🚫' : warnings.length > 0 ? '⚠️' : '✅'}
            </div>
            <div>
              <div style={{ 
                fontWeight: '700', 
                fontSize: '15px', 
                marginBottom: '8px',
                color: errors.length > 0 ? '#991b1b' : warnings.length > 0 ? '#92400e' : '#065f46'
              }}>
                File Validation Results
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.7' }}>
                {summary.explanation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div 
        style={{
          background: '#ffffff',
          border: '2px solid #0ea5e9',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}
      >
        <div
          onClick={() => toggleSection('summary')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            color: '#0c4a6e'
          }}
        >
          <span>📊 Upload Summary</span>
          {expandedSections.summary ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {expandedSections.summary && (
          <div style={{ marginTop: '12px', fontSize: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '8px' }}>
                <span style={{ color: '#6b7a8d', fontSize: '12px' }}>Total Records</span>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: '#1a6fb5' }}>
                  {summary.totalRows}
                </p>
              </div>
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
                <span style={{ color: '#6b7a8d', fontSize: '12px' }}>Valid Records</span>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: '#10b981' }}>
                  {valid.length} ✓
                </p>
              </div>
              <div style={{ padding: '12px', background: errors.length > 0 ? '#fef2f2' : '#f0fdf4', borderRadius: '8px' }}>
                <span style={{ color: '#6b7a8d', fontSize: '12px' }}>Errors</span>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: errors.length > 0 ? '#ef4444' : '#10b981' }}>
                  {errors.length} {errors.length === 0 ? '✓' : '✗'}
                </p>
              </div>
              {type === 'marks' && (
                <>
                  <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
                    <span style={{ color: '#6b7a8d', fontSize: '12px' }}>Pass</span>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: '#10b981' }}>
                      {summary.passCount}
                    </p>
                  </div>
                  <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
                    <span style={{ color: '#6b7a8d', fontSize: '12px' }}>Fail</span>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0', color: '#ef4444' }}>
                      {summary.failCount}
                    </p>
                  </div>
                </>
              )}
            </div>

            {valid.length > 0 && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                <p style={{ color: '#10b981', fontWeight: '600', margin: '0 0 8px 0', fontSize: '14px' }}>
                  ✅ Ready to upload {valid.length} record{valid.length !== 1 ? 's' : ''}
                </p>
                {summary.missingStudents > 0 && (
                  <p style={{ color: '#f59e0b', fontSize: '13px', margin: '0', fontWeight: '500' }}>
                    ⚠️ Note: {summary.missingStudents} student{summary.missingStudents !== 1 ? 's' : ''} not in this upload
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <div
            onClick={() => toggleSection('warnings')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              color: '#92400e'
            }}
          >
            <span>⚠️ Warnings ({warnings.length})</span>
            {expandedSections.warnings ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedSections.warnings && (
            <div style={{ marginTop: '12px', fontSize: '14px' }}>
              {warnings.map((warning, idx) => (
                <div key={idx} style={{ marginBottom: '12px', padding: '12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                  <p style={{ fontWeight: '600', margin: '0 0 8px 0', color: '#d97706', fontSize: '13px' }}>
                    {warning.message}
                  </p>
                  {warning.students && warning.students.length > 0 && (
                    <div style={{ fontSize: '12px', maxHeight: '120px', overflowY: 'auto' }}>
                      {warning.students.slice(0, 8).map((s, i) => (
                        <div key={i} style={{ color: '#78350f', marginBottom: '4px', paddingLeft: '16px' }}>
                          • {s.enrollmentNo} - {s.name}
                        </div>
                      ))}
                      {warning.moreCount > 0 && (
                        <div style={{ color: '#78350f', fontStyle: 'italic', fontSize: '11px', paddingLeft: '16px' }}>
                          ... and {warning.moreCount} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Errors Section */}
      {errors.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <div
            onClick={() => toggleSection('errors')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              color: '#7f1d1d'
            }}
          >
            <span>❌ Errors ({errors.length})</span>
            {expandedSections.errors ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedSections.errors && (
            <div style={{ marginTop: '12px', fontSize: '13px', maxHeight: '350px', overflowY: 'auto' }}>
              {errors.slice(0, 20).map((error, idx) => (
                <div key={idx} style={{
                  marginBottom: '10px',
                  padding: '12px',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  borderLeft: '4px solid #ef4444',
                  border: '1px solid #fecaca'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#991b1b' }}>
                      Row {error.rowNum}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6b7a8d' }}>
                      {error.enrollmentNo}
                    </span>
                  </div>
                  <div style={{ color: '#dc2626' }}>
                    {error.errors.map((err, eIdx) => (
                      <div key={eIdx} style={{ marginBottom: '4px', fontSize: '12px' }}>
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {errors.length > 20 && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '12px', fontWeight: '500' }}>
                  📋 Showing first 20 errors. Fix these and check your file for more issues.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preview Section */}
      {valid.length > 0 && (
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <div
            onClick={() => toggleSection('preview')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              color: '#065f46'
            }}
          >
            <span>👁️ Preview ({Math.min(valid.length, 10)} of {valid.length})</span>
            {expandedSections.preview ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {expandedSections.preview && (
            <div style={{ marginTop: '12px', maxHeight: '280px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d1fae5', background: '#f0fdf4' }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#065f46', fontWeight: '600', fontSize: '11px' }}>Enrollment</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: '#065f46', fontWeight: '600', fontSize: '11px' }}>Name</th>
                    {type === 'marks' && (
                      <>
                        <th style={{ textAlign: 'center', padding: '10px', color: '#065f46', fontWeight: '600', fontSize: '11px' }}>Marks</th>
                        <th style={{ textAlign: 'center', padding: '10px', color: '#065f46', fontWeight: '600', fontSize: '11px' }}>Result</th>
                      </>
                    )}
                    {type === 'attendance' && (
                      <th style={{ textAlign: 'center', padding: '10px', color: '#065f46', fontWeight: '600', fontSize: '11px' }}>Status</th>
                    )}
                    {type === 'students' && (
                      <th style={{ textAlign: 'left', padding: '10px', color: '#065f46', fontWeight: '600', fontSize: '11px' }}>Contact</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {valid.slice(0, 10).map((record, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #d1fae5' }}>
                      <td style={{ padding: '10px', color: '#1a6fb5', fontWeight: '600' }}>
                        {record.enrollmentNo}
                      </td>
                      <td style={{ padding: '10px', color: '#059669' }}>
                        {record.studentName || record.name}
                      </td>
                      {type === 'marks' && (
                        <>
                          <td style={{ textAlign: 'center', padding: '10px', color: '#1a6fb5', fontWeight: '600' }}>
                            {record.marksObtained}
                          </td>
                          <td style={{ textAlign: 'center', padding: '10px', color: record.willPass ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                            {record.willPass ? '✓ Pass' : '✗ Fail'}
                          </td>
                        </>
                      )}
                      {type === 'attendance' && (
                        <td style={{ textAlign: 'center', padding: '10px', fontWeight: '600', color: getStatusColor(record.status) }}>
                          {record.status}
                        </td>
                      )}
                      {type === 'students' && (
                        <td style={{ padding: '10px', color: '#6b7a8d', fontSize: '11px' }}>
                          {record.contact || 'N/A'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {valid.length > 10 && (
                <div style={{ marginTop: '12px', color: '#6b7a8d', fontSize: '11px', fontStyle: 'italic', textAlign: 'center' }}>
                  ... showing 10 of {valid.length} records
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', position: 'sticky', bottom: 0, background: '#f5f8fb', paddingBottom: '12px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            background: 'white',
            color: '#374151',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
          onMouseOut={(e) => e.target.style.background = 'white'}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!canConfirm || loading}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: canConfirm ? '#10b981' : '#d1d5db',
            color: 'white',
            fontWeight: '600',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (canConfirm && !loading) e.target.style.background = '#059669';
          }}
          onMouseOut={(e) => {
            if (canConfirm && !loading) e.target.style.background = '#10b981';
          }}
        >
          {loading ? '⏳ Uploading...' : `✓ Upload ${valid.length} Record${valid.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {errors.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#7f1d1d',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          <strong>🔴 Cannot Upload:</strong> Please fix all {errors.length} error{errors.length !== 1 ? 's' : ''} above before proceeding. Review the error messages for details.
        </div>
      )}
    </div>
  );
}
