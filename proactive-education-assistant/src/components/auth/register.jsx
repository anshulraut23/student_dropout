import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import LanguageSelector from "../LanguageSelector";

const ROLE_ADMIN = "admin";
const ROLE_TEACHER = "teacher";

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  schoolName: "",
  schoolType: "School",
  city: "",
  schoolId: ""
};

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === "dark";
  const schoolIdPattern = /^SCH-[A-Z0-9]{4,10}$/;

  const handleRoleSelect = (nextRole) => {
    setRole(nextRole);
    setStep("form");
    setFormData(initialFormState);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "schoolId" ? value.toUpperCase() : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!role) {
      nextErrors.role = "Select a role to continue.";
    }

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (role === ROLE_ADMIN) {
      if (!formData.schoolName.trim()) {
        nextErrors.schoolName = "School name is required.";
      }
    }

    if (role === ROLE_TEACHER) {
      if (!formData.schoolId.trim()) {
        nextErrors.schoolId = "School ID is required.";
      } else if (!schoolIdPattern.test(formData.schoolId.trim())) {
        nextErrors.schoolId = "Use format SCH-XXXX (letters/numbers).";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with real signup API call and JWT handling.
      const targetRoute = role === ROLE_ADMIN ? "/admin/dashboard" : "/teacher/dashboard";
      onClose();
      navigate(targetRoute);
    } catch (error) {
      setErrors({ form: "Unable to create account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSchoolLookupPlaceholder =
    role === ROLE_TEACHER && formData.schoolId.trim().length > 0 && schoolIdPattern.test(formData.schoolId.trim());

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl w-[90%] max-w-md p-8 relative max-h-[90vh] overflow-y-auto ${
          isDark ? "bg-gray-800 shadow-2xl shadow-black/50" : "bg-white shadow-2xl shadow-blue-200/30"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>

          <h1 className={`text-2xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("signup.page_title", "Create Your Account")}
          </h1>
          <p className={`text-sm text-center leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {t("signup.page_subtitle", "Choose your role to continue.")}
          </p>

          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        <div className={`h-px mb-6 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>

        {step === "role" && (
          <div className="space-y-4">
            <div className={`text-sm font-semibold uppercase tracking-wide ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              I am signing up as
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLE_ADMIN)}
                className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                  isDark
                    ? "border-gray-600 hover:border-blue-400 bg-gray-700/50"
                    : "border-blue-200 hover:border-blue-400 bg-blue-50/60"
                }`}
              >
                <div className="text-sm font-semibold text-blue-700">Admin</div>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Create and manage a school or organization.
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLE_TEACHER)}
                className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                  isDark
                    ? "border-gray-600 hover:border-emerald-400 bg-gray-700/50"
                    : "border-emerald-200 hover:border-emerald-400 bg-emerald-50/60"
                }`}
              >
                <div className="text-sm font-semibold text-emerald-700">Teacher</div>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Join an existing school with a School ID.
                </p>
              </button>
            </div>
            {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
          </div>
        )}

        {step === "form" && (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {role === ROLE_ADMIN ? "Create Your Organization" : "Join Your School"}
              </div>
              <button
                type="button"
                onClick={() => setStep("role")}
                className={`text-xs font-semibold ${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
              >
                Change Role
              </button>
            </div>

            {errors.form && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors.form}
              </div>
            )}

            <div>
              <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {t("signup.name_label", "Full Name")}
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                placeholder={t("signup.name_placeholder", "John Doe")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                             formData.fullName
                               ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               : isDark
                                 ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                 : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                           }`}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {t("signup.email_label", "Email Address")}
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder={t("signup.email_placeholder", "educator@school.org")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                             formData.email
                               ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               : isDark
                                 ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                 : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                           }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {t("signup.password_label", "Password")}
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder={t("signup.password_placeholder", "Create a secure password")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                             formData.password
                               ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               : isDark
                                 ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                 : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                           }`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                             formData.confirmPassword
                               ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               : isDark
                                 ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                 : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                           }`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {role === ROLE_ADMIN && (
              <>
                <div>
                  <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    School Name
                  </label>
                  <input
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Sunrise Public School"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                                 formData.schoolName
                                   ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                                   : isDark
                                     ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                     : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               }`}
                  />
                  {errors.schoolName && <p className="text-xs text-red-500 mt-1">{errors.schoolName}</p>}
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    School Type
                  </label>
                  <select
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                    }`}
                  >
                    <option value="School">School</option>
                    <option value="NGO">NGO</option>
                    <option value="Tuition Center">Tuition Center</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    City (Optional)
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    type="text"
                    placeholder="Mumbai"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                                 formData.city
                                   ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                                   : isDark
                                     ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                     : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               }`}
                  />
                </div>
              </>
            )}

            {role === ROLE_TEACHER && (
              <>
                <div>
                  <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    School ID
                  </label>
                  <input
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    type="text"
                    placeholder="SCH-49A8X2"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                                 formData.schoolId
                                   ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                                   : isDark
                                     ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                                     : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                               }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    School ID is required to join your organization.
                  </p>
                  {errors.schoolId && <p className="text-xs text-red-500 mt-1">{errors.schoolId}</p>}
                </div>

                {showSchoolLookupPlaceholder && (
                  <div className={`border rounded-lg p-3 text-xs ${
                    isDark ? "border-blue-600 bg-blue-900/20 text-blue-200" : "border-blue-200 bg-blue-50 text-blue-800"
                  }`}>
                    <div className="font-semibold">School Lookup</div>
                    <div className="mt-1">School validation will appear here after backend integration.</div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-linear-to-r from-teal-500 to-blue-500 text-white
                         font-semibold py-3 rounded-lg hover:from-teal-600 hover:to-blue-600
                         focus:outline-none focus:ring-4 focus:ring-teal-200 transition-all duration-200
                         shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : t("signup.sign_up_button", "Create Account")}
            </button>
          </form>
        )}

        <div className={`text-center mt-6 pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {t("signup.already_have_account", "Already have an account?")}
          </span>
          <button
            onClick={onSwitchToLogin}
            className="ml-2 text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
          >
            {t("signup.sign_in_link", "Sign in")}
          </button>
        </div>

        <button
          onClick={onClose}
          className={`absolute top-4 right-4 rounded-full p-2 transition-all ${
            isDark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RegisterModal;
