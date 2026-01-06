import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFileCsv, FaFileExcel } from 'react-icons/fa';

function UploadBox({ onUpload, importing, importType }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      alert('Please upload a CSV or Excel file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10 MB');
      return;
    }

    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        } ${importing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={handleChange}
          className="hidden"
          disabled={importing}
        />

        {importing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="text-lg font-medium text-gray-900">Importing data...</p>
            <p className="text-sm text-gray-500">Please wait while we process your file</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <FaCloudUploadAlt className="text-6xl text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Uploading <span className="font-medium">{importType}</span> data
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaFileCsv className="text-green-600" />
                <span className="text-sm">CSV</span>
              </div>
              <div className="text-gray-300">|</div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaFileExcel className="text-green-600" />
                <span className="text-sm">Excel</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadBox;
