import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

const ROLE_ADMIN = "admin";
const ROLE_TEACHER = "teacher";

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  schoolName: "",
  schoolAddress: "",
  schoolCity: "",
  schoolState: "",
  schoolPhone: ""
};

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock schools list for teacher registration
  const schools = [
    "Sunrise Public School",
    "Green Valley High School",
    "St. Mary's Academy",
    "Delhi Public School",
    "Modern International School"
  ];

  const handleRoleSelect = (nextRole) => {
    setRole(nextRole);
    setStep("form");
    setFormData(initialFormState);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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

    if (!formData.schoolName.trim()) {
      nextErrors.schoolName = "School name is required.";
    }

    if (role === ROLE_ADMIN) {
      if (!formData.schoolAddress.trim()) {
        nextErrors.schoolAddress = "School address is required.";
      }
      if (!formData.schoolCity.trim()) {
        nextErrors.schoolCity = "City is required.";
      }
      if (!formData.schoolState.trim()) {
        nextErrors.schoolState = "State is required.";
      }
      if (!formData.schoolPhone.trim()) {
        nextErrors.schoolPhone = "Phone number is required.";
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
      // Store registration data
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("role", role);
      
      const targetRoute = role === ROLE_ADMIN ? "/admin/dashboard" : "/teacher/dashboard";
      onClose();
      navigate(targetRoute);
    } catch (error) {
      setErrors({ form: "Unable to create account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md mx-4 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("signup.page_title", "Create Your Account")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("signup.page_subtitle", "Choose your role to continue")}
          </p>
          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        {step === "role" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 mb-4">I am signing up as</p>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLE_ADMIN)}
                className="w-full text-left border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 transition-all group"
              >
                <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600">Admin</div>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage your school
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLE_TEACHER)}
                className="w-full text-left border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 transition-all group"
              >
                <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600">Teacher</div>
                <p className="text-sm text-gray-600 mt-1">
                  Request to join an existing school
                </p>
              </button>
            </div>
            {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
          </div>
        )}

        {step === "form" && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {role === ROLE_ADMIN ? "Create Your School" : "Join a School"}
              </h3>
              <button
                type="button"
                onClick={() => setStep("role")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change Role
              </button>
            </div>

            {errors.form && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("signup.name_label", "Full Name")} <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                placeholder={t("signup.name_placeholder", "John Doe")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("signup.email_label", "Email Address")} <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder={t("signup.email_placeholder", "educator@school.org")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("signup.password_label", "Password")} <span className="text-red-500">*</span>
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder={t("signup.password_placeholder", "Create a secure password")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name <span className="text-red-500">*</span>
              </label>
              {role === ROLE_ADMIN ? (
                <input
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Sunrise Public School"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              ) : (
                <select
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a school</option>
                  {schools.map((school, index) => (
                    <option key={index} value={school}>{school}</option>
                  ))}
                </select>
              )}
              {errors.schoolName && <p className="text-sm text-red-600 mt-1">{errors.schoolName}</p>}
            </div>

            {role === ROLE_ADMIN && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {errors.schoolAddress && <p className="text-sm text-red-600 mt-1">{errors.schoolAddress}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="schoolCity"
                      value={formData.schoolCity}
                      onChange={handleChange}
                      type="text"
                      placeholder="Mumbai"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {errors.schoolCity && <p className="text-sm text-red-600 mt-1">{errors.schoolCity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="schoolState"
                      value={formData.schoolState}
                      onChange={handleChange}
                      type="text"
                      placeholder="Maharashtra"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {errors.schoolState && <p className="text-sm text-red-600 mt-1">{errors.schoolState}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="schoolPhone"
                    value={formData.schoolPhone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {errors.schoolPhone && <p className="text-sm text-red-600 mt-1">{errors.schoolPhone}</p>}
                </div>
              </>
            )}

            {role === ROLE_ADMIN && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  You can update school details from your profile after registration.
                </p>
              </div>
            )}

            {role === ROLE_TEACHER && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  Your request will be sent to the school admin for approval.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : t("signup.sign_up_button", "Create Account")}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-600">
            {t("signup.already_have_account", "Already have an account?")}
          </span>
          <button
            onClick={onSwitchToLogin}
            className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("signup.sign_in_link", "Sign in")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
