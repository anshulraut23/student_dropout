import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTeacher } from '../../context/TeacherContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FaUser,
  FaEnvelope,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaLock,
} from 'react-icons/fa';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { teacher, logoutTeacher } = useTeacher();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    email: teacher?.email || '',
    subject: teacher?.subject || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    alert(t('profile.updateSuccess') || 'Profile updated successfully!');
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
    if (window.confirm(t('common.logoutConfirm') || 'Are you sure you want to logout?')) {
      logoutTeacher();
      navigate('/');
    }
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{t('profile.noData') || 'No profile data available'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            {t('common.goHome') || 'Go to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            👤 {t('profile.myProfile') || 'My Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{t('profile.manageInfo') || 'Manage your account information'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 relative">
            <div className="absolute inset-0 opacity-20 bg-pattern" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}></div>
          </div>

          <div className="relative px-6 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-20 mb-8">
              <div className="flex items-end gap-4">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-5xl font-bold border-4 border-white dark:border-gray-800 transform transition-all duration-300 hover:scale-105">
                  {teacher.name?.charAt(0).toUpperCase() || 'T'}
                </div>

                <div className="pb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{teacher.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600">
                      ✓ {t('profile.active') || 'Active'}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                      🎓 {teacher.subject || t('profile.teacher') || 'Teacher'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-0 flex gap-3 flex-wrap">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
                  >
                    <FaEdit /> {t('common.edit') || 'Edit'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
                    >
                      <FaTimes /> {t('common.cancel') || 'Cancel'}
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
                    >
                      <FaSave /> {t('common.save') || 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-gray-700/20 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaUser className="text-blue-600" /> {t('profile.personalInfo') || 'Personal Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                      👤 {t('profile.fullName') || 'Full Name'}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white dark:bg-gray-600/50 rounded-xl text-gray-900 dark:text-white font-medium">
                        {teacher.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                      ✉️ {t('profile.email') || 'Email Address'}
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white dark:bg-gray-600/50 rounded-xl text-gray-900 dark:text-white font-medium">
                        {teacher.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                      📚 {t('profile.subject') || 'Subject/Specialization'}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder={t('profile.subjectPlaceholder') || 'e.g., Mathematics'}
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white dark:bg-gray-600/50 rounded-xl text-gray-900 dark:text-white font-medium">
                        {teacher.subject || t('profile.notSpecified') || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                      📊 {t('profile.status') || 'Account Status'}
                    </label>
                    <div className="px-4 py-3 bg-white dark:bg-gray-600/50 rounded-xl text-gray-900 dark:text-white font-medium capitalize">
                      {teacher.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-blue-600" /> {t('profile.assignedClasses') || 'Assigned Classes'}
                </h3>
                {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {teacher.assignedClasses.map((cls, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default"
                      >
                        🎓 {cls}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-white dark:bg-gray-700/50 rounded-xl text-gray-600 dark:text-gray-300 italic">
                    {t('profile.noClasses') || 'No classes assigned'}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaLock className="text-purple-600" /> {t('profile.security') || 'Security Settings'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-2xl border border-purple-100 dark:border-purple-700 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:translate-x-1">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">🔐 {t('profile.twoFactor') || 'Two-Factor Authentication'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('profile.twoFactorDesc') || 'Add an extra layer of security to your account'}</p>
                    </div>
                    <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-bold whitespace-nowrap ml-4">
                      {t('common.enable') || 'Enable'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-2xl border border-purple-100 dark:border-purple-700 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:translate-x-1">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">🔔 {t('profile.loginAlerts') || 'Login Alerts'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('profile.loginAlertsDesc') || 'Get notified about new device logins'}</p>
                    </div>
                    <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-bold whitespace-nowrap ml-4">
                      {t('common.manage') || 'Manage'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <FaSignOutAlt className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-red-700 dark:text-red-200 text-lg">👋 {t('profile.signOut') || 'Sign Out'}</p>
                    <p className="text-sm text-red-600 dark:text-red-300">{t('profile.signOutDesc') || 'You can sign back in anytime'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  {t('common.logout') || 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 flex items-start gap-4">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">{t('profile.accountInfo') || 'Account Information'}</h4>
            <p className="text-sm text-blue-800 dark:text-blue-100/80 mt-2 leading-relaxed">
              {t('profile.accountInfoDesc') || 'Your profile information is used to personalize your experience and manage class assignments. Contact your administrator if you need to update your assigned classes.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
