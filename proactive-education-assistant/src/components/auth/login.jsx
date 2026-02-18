import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";

const ROLE_ADMIN = "admin";
const ROLE_TEACHER = "teacher";

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  if (!isOpen) return null;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDashboardRoute = (userRole) =>
    userRole === ROLE_ADMIN ? "/admin/dashboard" : "/teacher/dashboard";

  const simulateLoginRequest = async ({ email: inputEmail, password: inputPassword }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (inputEmail.includes("network")) {
      return { ok: false, code: "NETWORK_ERROR", error: "Network error. Please try again." };
    }

    if (!inputEmail || !inputPassword) {
      return { ok: false, code: "INVALID_CREDENTIALS", error: "Invalid credentials." };
    }

    if (inputEmail.includes("pending")) {
      return { ok: false, code: "ACCOUNT_PENDING", error: "Account not approved yet." };
    }

    if (inputEmail.includes("inactive")) {
      return { ok: false, code: "SCHOOL_INACTIVE", error: "School is inactive." };
    }

    const isAdmin = inputEmail.includes("admin");
    return {
      ok: true,
      data: {
        role: isAdmin ? ROLE_ADMIN : ROLE_TEACHER,
        token: "demo-jwt-token",
        school_id: "SCH-0000",
        school_name: "Demo School"
      }
    };
  };

  const storeAuthSession = ({ token, role, school_id, school_name }) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("role", role);
    storage.setItem("school_id", school_id || "");
    storage.setItem("school_name", school_name || "");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await simulateLoginRequest({ email, password });

      if (!response.ok) {
        setErrorMessage(response.error || "Invalid credentials.");
        return;
      }

      const { role, token, school_id, school_name } = response.data || {};
      const resolvedRole = role;

      if (resolvedRole !== ROLE_ADMIN && resolvedRole !== ROLE_TEACHER) {
        throw new Error("Invalid role from server.");
      }

      storeAuthSession({ token, role: resolvedRole, school_id, school_name });
      const targetRoute = getDashboardRoute(resolvedRole);
      onClose();
      navigate(targetRoute);

    } catch (error) {
      setErrorMessage("Unable to sign in. Please check your credentials.");
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
        className="bg-white rounded-xl w-full max-w-md mx-4 p-8 shadow-2xl relative"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("app.brand_full", "Welcome Back")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("landing.early_detection", "Sign in to continue to your dashboard")}
          </p>
          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {errorMessage && (
            <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("login.email_label", "Email Address")}
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder={t("login.email_placeholder", "educator@school.org")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("login.password_label", "Password")}
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder={t("login.password_placeholder", "Enter your password")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Signing In...
              </span>
            ) : (
              t("login.sign_in_button", "Sign In")
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {t("login.no_account", "Don't have an account?")}
          </p>
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {t("signup.page_title", "Create Account")}
          </button>
          <p className="mt-4 text-xs text-gray-500">
            Demo: admin@demo.com / teacher@demo.com (password: demo)
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
