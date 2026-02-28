import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaSpinner, FaShieldAlt } from 'react-icons/fa';
import apiService from '../../services/apiService';

export default function SuperAdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    designation: '',
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      
      if (response.success) {
        const data = {
          fullName: response.user.fullName || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          designation: response.user.designation || 'Super Administrator',
        };
        
        setProfileData(data);
        setOriginalData(data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    // Validation
    if (!profileData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return;
    }
    if (!profileData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const updates = {
        fullName: profileData.fullName,
        phone: profileData.phone,
        designation: profileData.designation,
      };

      const response = await apiService.updateProfile(updates);

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setOriginalData(profileData);
        setIsEditing(false);
      } else {
        setMessage({ 
          type: 'error', 
          text: response.error || 'Failed to update profile' 
        });
      }
    } catch (error) {
      console.error('Save profile error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to save changes. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Super Admin Profile</h1>
          <p className="text-sm text-gray-600">Manage your account information</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                <FaShieldAlt className="text-4xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profileData.fullName || 'Super Administrator'}</h2>
                <p className="text-blue-100 text-sm mt-1">{profileData.designation}</p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={profileData.designation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium text-gray-900">Super Administrator</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Access Level</span>
              <span className="font-medium text-blue-600">Full Platform Access</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Permissions</span>
              <span className="font-medium text-gray-900">All Schools Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
