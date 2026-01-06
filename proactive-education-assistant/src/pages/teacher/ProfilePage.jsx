import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../../context/TeacherContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaChalkboardTeacher, 
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaLock
} from 'react-icons/fa';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { teacher, logoutTeacher } = useTeacher();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    email: teacher?.email || '',
    subject: teacher?.subject || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would call an API to update profile
    alert('Profile updated successfully!');
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: teacher?.name || '',
      email: teacher?.email || '',
      subject: teacher?.subject || '',
    });
    setEditMode(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logoutTeacher();
      navigate('/');
    }
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile data available</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-500"></div>
          
          {/* Avatar Section */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {teacher.name?.charAt(0) || 'T'}
                  </div>
                </div>
                
                {/* Name & Status */}
                <div className="pb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                      Active
                    </span>
                    <span className="text-sm text-gray-600">{teacher.subject || 'Teacher'}</span>
                  </div>
                </div>
              </div>

              {/* Edit/Save Buttons */}
              <div className="mt-4 sm:mt-0 flex gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <FaSave /> Save
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{teacher.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FaEnvelope className="text-gray-500" />
                      Email Address
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{teacher.email}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject/Specialization
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Mathematics"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{teacher.subject || 'Not specified'}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Status
                    </label>
                    <p className="text-gray-900 py-2 capitalize">{teacher.status}</p>
                  </div>
                </div>
              </div>

              {/* Assigned Classes */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-blue-600" />
                  Assigned Classes
                </h3>
                {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teacher.assignedClasses.map((cls, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No classes assigned yet</p>
                )}
              </div>

              {/* Account Actions */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Change password feature coming soon!')}
                    className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FaLock /> Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors ml-0 sm:ml-3"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaCalendarAlt className="text-blue-600 text-xl mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900">Account Information</h4>
              <p className="text-sm text-blue-800 mt-1">
                Your profile information is used to personalize your experience and manage class assignments.
                Contact your administrator if you need to update your assigned classes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
