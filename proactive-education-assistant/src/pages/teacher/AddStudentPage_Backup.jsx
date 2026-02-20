import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUser, FaUpload, FaDownload, FaPlus, FaSpinner } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function AddStudentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classIdFromUrl = searchParams.get('class');

  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    classId: classIdFromUrl || "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const result = await apiService.getMyClasses();
      if (result.success) {
        // Only show classes where teacher is incharge
        const inchargeClasses = (result.classes || []).filter(
          c => c.role === 'incharge' || c.role === 'both'
        );
        setClasses(inchargeClasses);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.enrollmentNo || !formData.classId) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await apiService.createStudent(formData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Student added successfully!" });
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            enrollmentNo: "",
            classId: classIdFromUrl || "",
            dateOfBirth: "",
            gender: "",
            contact: "",
            email: "",
            address: "",
            parentName: "",
            parentContact: "",
            parentEmail: "",
          });
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to add student" });
      }
    } catch (error) {
      console.error('Add student error:', error);
      setMessage({ type: "error", text: error.message || "Failed to add student" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setMessage({ type: "", text: "" });

    try {
      // Dynamic import of papaparse
      const Papa = (await import("papaparse")).default;
      
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setParsedData(results.data);
            setMessage({ 
              type: "success", 
              text: `File parsed successfully! Found ${results.data.length} students.` 
            });
          } else {
            setMessage({ type: "error", text: "No valid data found in file" });
          }
        },
        error: (error) => {
          console.error('Parse error:', error);
          setMessage({ type: "error", text: "Failed to parse file" });
        }
      });
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ 
        type: "error", 
        text: "CSV parser not available. Please install papaparse: npm install papaparse" 
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!formData.classId) {
      setMessage({ type: "error", text: "Please select a class first" });
      return;
    }

    if (parsedData.length === 0) {
      setMessage({ type: "error", text: "Please upload a file with student data" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Map CSV columns to API format
      const students = parsedData.map(row => ({
        name: row.Name || row.name || "",
        enrollmentNo: row['Enrollment No'] || row.enrollmentNo || row['Enrollment Number'] || "",
        dateOfBirth: row.DOB || row.dateOfBirth || row['Date of Birth'] || null,
        gender: row.Gender || row.gender || null,
        contact: row.Contact || row.contact || row['Contact Number'] || null,
        email: row.Email || row.email || null,
        address: row.Address || row.address || null,
        parentName: row['Parent Name'] || row.parentName || null,
        parentContact: row['Parent Contact'] || row.parentContact || null,
        parentEmail: row['Parent Email'] || row.parentEmail || null,
      }));

      const result = await apiService.createStudentsBulk(formData.classId, students);
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: `Successfully added ${result.created} students${result.failed > 0 ? `. ${result.failed} failed.` : ''}` 
        });
        
        // Reset after 3 seconds
        setTimeout(() => {
          setUploadedFile(null);
          setParsedData([]);
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to upload students" });
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      setMessage({ type: "error", text: error.message || "Failed to upload students" });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = "Name,Enrollment No,DOB,Gender,Contact,Email,Address,Parent Name,Parent Contact,Parent Email\nJohn Doe,2024001,2010-01-15,Male,9876543210,john@example.com,123 Main Street,Jane Doe,9876543211,parent@example.com";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student_template.csv";
    link.click();
  };

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add Student</h1>
          <p className="text-sm text-gray-500 mt-1">Add students individually or upload in bulk</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "single"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaUser className="inline mr-2" />
              Single Student
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "bulk"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaUpload className="inline mr-2" />
              Bulk Upload
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Single Student Form */}
          {activeTab === "single" && (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Class */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                {/* Enrollment No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024001"
                    required
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 9876543210"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="student@example.com"
                  />
                </div>

                {/* Parent Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Jane Doe"
                  />
                </div>

                {/* Parent Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Contact
                  </label>
                  <input
                    type="tel"
                    name="parentContact"
                    value={formData.parentContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 9876543211"
                  />
                </div>

                {/* Parent Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="parent@example.com"
                  />
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-xs" />
                      Add Student
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bulk Upload */}
          {activeTab === "bulk" && (
            <div className="p-6">
              
              {/* Class Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - Grade {cls.grade}{cls.section ? ` Section ${cls.section}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Download Template */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Download Template</h3>
                    <p className="text-xs text-gray-600">
                      Download the CSV template and fill in student details
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FaDownload className="text-xs" />
                    Download
                  </button>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Upload Student Data
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  CSV file (Max 5MB)
                </p>
                
                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <FaUpload className="text-xs" />
                  Choose File
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedFile && (
                  <div className="mt-4 text-sm text-gray-600">
                    Selected: <span className="font-medium">{uploadedFile.name}</span>
                  </div>
                )}

                {parsedData.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={handleBulkUpload}
                      disabled={loading || !formData.classId}
                      className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="text-xs" />
                          Upload {parsedData.length} Students
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Select the class where students will be added</li>
                  <li>• Download the CSV template file</li>
                  <li>• Fill in all required fields (Name, Enrollment No)</li>
                  <li>• Save the file in CSV format</li>
                  <li>• Upload the completed file</li>
                  <li>• Review and confirm the imported data</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
