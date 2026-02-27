import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacher } from "../../context/TeacherContext";
import { FaSpinner, FaUser, FaSchool, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import apiService from "../../services/apiService";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { teacher, logoutTeacher } = useTeacher();

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    designation: "",
    schoolName: "",
    schoolAddress: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getProfile();
      
      if (response.success) {
        const data = {
          fullName: response.user.fullName || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          address: response.user.address || '',
          city: response.user.city || '',
          state: response.user.state || '',
          pincode: response.user.pincode || '',
          designation: response.user.designation || '',
          schoolName: response.school?.name || '',
          schoolAddress: response.school?.address || '',
        };
        
        setForm(data);
        setOriginalData(data);
        
        if (response.user.profilePicture) {
          setProfilePic(response.user.profilePicture);
        }
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      console.error('Load profile error:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const uploadImage = e => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setEdit(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setForm(originalData);
    setEdit(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    // Validation
    if (!form.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updates = {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        designation: form.designation
      };

      const response = await apiService.updateProfile(updates);
      
      if (response.success) {
        setOriginalData(form);
        setEdit(false);
        setSuccess('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen px-4 md:px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-slate-600">Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="font-medium">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* PROFILE HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer relative group">
                    <input type="file" hidden onChange={uploadImage} disabled={!edit} />
                    <div className="w-20 h-20 rounded-xl bg-blue-500 flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
                      {profilePic ? (
                        <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <FaUser className="text-white" />
                      )}
                    </div>
                    {edit && (
                      <span className="absolute bottom-0 right-0 bg-white text-slate-900 text-xs px-2 py-1 rounded-md shadow-md group-hover:bg-blue-50 transition-colors">
                        <FaEdit className="inline" /> Edit
                      </span>
                    )}
                  </label>

                  <div>
                    <h2 className="text-2xl font-semibold">{form.fullName || "Teacher"}</h2>
                    <p className="text-sm opacity-90 flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-xs" /> {form.email}
                    </p>
                    {form.designation && (
                      <p className="text-xs opacity-80 mt-1">{form.designation}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!edit ? (
                    <button
                      onClick={handleEdit}
                      className="bg-white text-blue-600 px-5 py-2 rounded-md hover:bg-blue-50 font-medium flex items-center gap-2 shadow-md transition-colors"
                    >
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="bg-white text-slate-600 px-4 py-2 rounded-md hover:bg-slate-100 font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 font-medium flex items-center gap-2 disabled:opacity-50 shadow-md transition-colors"
                      >
                        {saving ? (
                          <>
                            <FaSpinner className="animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <FaSave /> Save Changes
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <FaUser className="text-blue-600 text-lg" />
                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Full Name" icon={FaUser} name="fullName" edit={edit} value={form.fullName} onChange={change} required />
                <Field label="Email" icon={FaEnvelope} name="email" edit={false} value={form.email} onChange={change} disabled />
                <Field label="Phone" icon={FaPhone} name="phone" edit={edit} value={form.phone} onChange={change} placeholder="+91 9876543210" />
                <Field label="Designation" icon={FaBriefcase} name="designation" edit={edit} value={form.designation} onChange={change} placeholder="e.g., Senior Teacher" />
                <Field label="City" icon={FaMapMarkerAlt} name="city" edit={edit} value={form.city} onChange={change} placeholder="e.g., Mumbai" />
                <Field label="State" icon={FaMapMarkerAlt} name="state" edit={edit} value={form.state} onChange={change} placeholder="e.g., Maharashtra" />
                <Field label="Pincode" icon={FaMapMarkerAlt} name="pincode" edit={edit} value={form.pincode} onChange={change} placeholder="e.g., 400001" />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Field label="Address" icon={FaMapMarkerAlt} name="address" edit={edit} value={form.address} onChange={change} placeholder="Full address" />
                </div>
              </div>
            </div>

            {/* SCHOOL INFORMATION */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <FaSchool className="text-blue-600 text-lg" />
                <h3 className="text-lg font-semibold text-slate-900">School Information</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="School Name" icon={FaSchool} name="schoolName" edit={false} value={form.schoolName} disabled />
                <Field label="School Address" icon={FaMapMarkerAlt} name="schoolAddress" edit={false} value={form.schoolAddress} disabled />
              </div>
              
              <p className="text-xs text-slate-500 mt-4">
                * School information cannot be changed. Contact your administrator for school-related updates.
              </p>
            </div>

            {/* ACCOUNT SECTION */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Account Status</h3>
                  <p className="text-sm text-slate-600">Your account is active and verified</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logoutTeacher();
                      navigate("/");
                    }
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* -------- FIELD COMPONENT -------- */

function Field({ label, value, edit, name, onChange, icon: Icon, disabled, required, placeholder }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:border-slate-300">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="text-slate-400 text-sm" />}
        <p className="text-xs font-medium text-slate-600">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      </div>
      {edit && !disabled ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="border border-slate-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <p className="font-medium text-slate-900 min-h-[32px] flex items-center">
          {value || <span className="text-slate-400">Not provided</span>}
        </p>
      )}
    </div>
  );
}
