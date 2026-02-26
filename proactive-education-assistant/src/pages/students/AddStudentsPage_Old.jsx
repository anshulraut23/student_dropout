import { useState, useEffect } from "react";
import { FaUpload, FaUserPlus, FaWifi, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import offlineDataService from "../../services/OfflineDataService";
import useNetworkStatus from "../../hooks/useNetworkStatus";
import { v4 as uuidv4 } from 'uuid';

export default function AddStudentsPage() {
  const [mode, setMode] = useState("single");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { isOnline } = useNetworkStatus();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    class_id: '',
    date_of_birth: '',
    gender: 'male',
    parent_phone: '',
    parent_name: '',
    address: ''
  });

  // Initialize offline service and load classes
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await offlineDataService.initialize();
      // Load classes from API or local DB
      // For now, using mock data - you can integrate with your classes API
      setClasses([
        { id: '1', name: '6th' },
        { id: '2', name: '7th' },
        { id: '3', name: '8th' },
        { id: '4', name: '9th' },
        { id: '5', name: '10th' },
      ]);
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.roll_number || !formData.class_id) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields (Name, Roll No, Class)'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Create student data
      const studentData = {
        id: uuidv4(),
        name: formData.name,
        roll_number: formData.roll_number,
        class_id: formData.class_id,
        school_id: localStorage.getItem('school_id') || 'default-school',
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        parent_name: formData.parent_name || null,
        parent_phone: formData.parent_phone || null,
        parent_email: null,
        address: formData.address || null,
      };

      // Use offline data service - works online AND offline!
      const result = await offlineDataService.addStudent(studentData);

      // Show success message
      if (result.offline) {
        setMessage({
          type: 'warning',
          text: '📵 Offline: Student saved locally and will sync when online!'
        });
      } else {
        setMessage({
          type: 'success',
          text: '✅ Student added successfully!'
        });
      }

      // Reset form
      setFormData({
        name: '',
        roll_number: '',
        class_id: '',
        date_of_birth: '',
        gender: 'male',
        parent_phone: '',
        parent_name: '',
        address: ''
      });

    } catch (error) {
      console.error('Error adding student:', error);
      setMessage({
        type: 'error',
        text: `❌ Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header with Online/Offline Indicator */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Add Students
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Add individual students or upload them in bulk using CSV/Excel.
            </p>
          </div>
          
          {/* Online/Offline Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            <FaWifi className={isOnline ? '' : 'opacity-50'} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.type === 'warning'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' && <FaCheckCircle className="mt-0.5" />}
            {message.type === 'error' && <FaExclamationCircle className="mt-0.5" />}
            {message.type === 'warning' && <FaExclamationCircle className="mt-0.5" />}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Mode Switch */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
              mode === "single"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Single Student
          </button>

          <button
            onClick={() => setMode("bulk")}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
              mode === "bulk"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Bulk Upload
          </button>
        </div>

        {/* SINGLE STUDENT FORM */}
        {mode === "single" && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">

            <div className="flex items-center gap-2">
              <FaUserPlus className="text-slate-600" />
              <h2 className="font-semibold text-slate-900">
                Add Single Student
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Student Name */}
              <div>
                <label className="form-label">Student Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="form-input"
                  required
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="form-label">Roll No *</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  placeholder="001"
                  className="form-input"
                  required
                />
              </div>

              {/* Class */}
              <div>
                <label className="form-label">Class / Batch *</label>
                <select 
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="form-label">Date of Birth</label>
                <input 
                  type="date" 
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="form-input" 
                />
              </div>

              {/* Gender */}
              <div>
                <label className="form-label">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Parent Contact */}
              <div>
                <label className="form-label">Parent Contact</label>
                <input
                  type="tel"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="form-input"
                />
              </div>

              {/* Guardian Name */}
              <div>
                <label className="form-label">Guardian Name</label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleInputChange}
                  placeholder="Parent / Guardian Name"
                  className="form-input"
                />
              </div>

              {/* Address */}
              <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Village / Area / City"
                  className="form-input"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Student'}
              </button>

              {!isOnline && (
                <p className="text-sm text-yellow-600">
                  📵 Offline mode - will sync when online
                </p>
              )}
            </div>
          </form>
        )}

        {/* BULK UPLOAD */}
        {mode === "bulk" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">

            <div className="flex items-center gap-2">
              <FaUpload className="text-slate-600" />
              <h2 className="font-semibold text-slate-900">
                Bulk Upload Students
              </h2>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
              <FaUpload className="mx-auto text-slate-400 text-3xl mb-3" />
              <p className="text-sm text-slate-700 font-medium">
                Upload CSV or Excel file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop or click to browse
              </p>
              <input type="file" className="hidden" />
            </div>

            {/* Template Format */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
              <p className="text-xs text-slate-500">
                Template format:
              </p>
              <p className="text-xs font-mono text-slate-700 mt-1">
                Name, Roll No, Class, DOB, Gender, Parent Contact, Guardian, Address
              </p>
            </div>

            <button className="px-6 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition">
              Upload File
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
