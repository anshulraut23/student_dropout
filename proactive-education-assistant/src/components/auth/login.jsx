import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import LanguageSelector from "../LanguageSelector";

const ROLE_ADMIN = "admin";
const ROLE_TEACHER = "teacher";

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  if (!isOpen) return null;

  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === "dark";

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
      // TODO: Replace with real login API call and JWT handling.
      // const response = await api.post("/auth/login", { email, password });
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
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <h1 className={`text-2xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("app.brand_full", "Proactive Education Assistant")}
          </h1>
          <p className={`text-sm text-center leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {t("landing.early_detection", "Helping educators identify and support at-risk students early.")}
          </p>

          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        <div className={`h-px mb-6 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {errorMessage && (
            <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-800">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {t("login.email_label", "Email Address")}
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder={t("login.email_placeholder", "educator@school.org")}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                           email
                             ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                             : isDark
                               ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                               : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                         }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {t("login.password_label", "Password")}
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder={t("login.password_placeholder", "Enter your password")}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                           password
                             ? "bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                             : isDark
                               ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400"
                               : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300"
                         }`}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className={`flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3.5 rounded-xl text-base
                       hover:from-blue-700 hover:to-blue-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50
                       transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isSubmitting && (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {isSubmitting ? "Signing In..." : t("login.sign_in_button", "Sign In")}
            </span>
          </button>

          <p className={`text-xs text-center mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Your data is encrypted and securely stored.
          </p>
        </form>

        <div className={`h-px my-6 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>

        <div className="text-center">
          <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {t("login.no_account", "Don't have an account?")}
          </p>
          <button
            onClick={onSwitchToRegister}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold
                       hover:bg-blue-50 hover:border-blue-700 dark:hover:bg-blue-600/20 dark:border-blue-400 dark:text-blue-400
                       transition-all duration-200"
          >
            {t("signup.page_title", "Create Account")}
          </button>
          <p className={`mt-4 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Demo Login: admin@demo.com / teacher@demo.com (password: demo)
          </p>
        </div>

        <button
          onClick={onClose}
          className={`absolute top-5 right-5 rounded-full p-2.5 transition-all ${
            isDark ? "text-gray-500 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LoginModal;