import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaArrowRight,
  FaChartLine,
  FaUsers,
  FaBrain,
  FaMobileAlt
} from "react-icons/fa";
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);

  const features = [
    {
      icon: FaChartLine,
      title: "Risk Analytics",
      desc: "Instant visual risk scoring for every student"
    },
    {
      icon: FaUsers,
      title: "Class Management",
      desc: "Organize classes, subjects, and student data"
    },
    {
      icon: FaBrain,
      title: "Smart Insights",
      desc: "AI-style alerts for attendance drops and score dips"
    },
    {
      icon: FaMobileAlt,
      title: "Offline First",
      desc: "Works without internet, syncs when online"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            ES
          </div>
          <span className="font-bold text-xl">EduShield</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 text-sm font-medium hover:text-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 mb-6">
          <FaShieldAlt className="text-xs" />
          AI-Powered Dropout Prevention
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Every Student <span className="text-blue-600">Deserves</span> to Stay in School
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          EduShield helps teachers identify at-risk students early using attendance,
          academics, and behaviour data — before it's too late.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowRegister(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            Start Free
            <FaArrowRight className="text-xs" />
          </button>

          <button
            onClick={() => {
              setLoginRedirectPath("/dashboard");
              setShowLogin(true);
            }}
            className="px-6 py-3 border border-slate-300 rounded-lg font-medium hover:bg-slate-100"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-slate-500">
        © 2026 EduShield — Built for Teachers, By Teachers
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => {
          setShowLogin(false);
          setLoginRedirectPath(null);
        }}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={() => {
          if (loginRedirectPath) {
            navigate(loginRedirectPath);
            setLoginRedirectPath(null);
          }
        }}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}
