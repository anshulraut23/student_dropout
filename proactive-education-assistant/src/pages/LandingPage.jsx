import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardCheck,
  FaLightbulb,
  FaFileAlt
} from "react-icons/fa";
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";
import slideOne from "../assets/std1.jpg";
import slideTwo from "../assets/std2.webp";
import slideThree from "../assets/std3.webp";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: slideOne,
      caption: "Student Risk Dashboard"
    },
    {
      image: slideTwo,
      caption: "Early Intervention Suggestions"
    },
    {
      image: slideThree,
      caption: "Attendance Trend Analysis"
    },
    {
      image: slideOne,
      caption: "Organization-Level Overview"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const features = [
    {
      icon: FaChartLine,
      title: "Early Risk Detection",
      description: "Spot attendance and performance declines early."
    },
    {
      icon: FaLightbulb,
      title: "Explainable Insights",
      description: "Clear reasons behind each risk flag."
    },
    {
      icon: FaClipboardCheck,
      title: "Teacher-Friendly Dashboard",
      description: "Simple views that fit real classroom workflows."
    },
    {
      icon: FaFileAlt,
      title: "Offline & CSV Support",
      description: "Work in low-connectivity settings and sync later."
    }
  ];

  const problemPoints = [
    "Dropout signals are missed until it is too late.",
    "Data lives across registers, SMS, and spreadsheets.",
    "Field staff lack a clear, shared risk picture."
  ];

  const solutionPoints = [
    "Unified risk scores with transparent drivers.",
    "Actionable next steps for teachers and coordinators.",
    "Portfolio view for schools and programs."
  ];

  const audiences = [
    {
      title: "Teachers",
      points: ["Class-level risk lists", "Daily follow-up prompts", "Simple intervention notes"]
    },
    {
      title: "Schools",
      points: ["Multi-class oversight", "Attendance and learning trends", "Export-ready reports"]
    },
    {
      title: "NGOs / Government",
      points: ["Program-level monitoring", "Field team coordination", "Evidence for funding and audits"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden text-slate-900">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center border border-slate-200">
                <FaBook className="text-blue-700 text-base" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Proactive Education
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm text-white">
              <a href="#features" className="text-white hover:text-white no-underline">Features</a>
              <a href="#how" className="text-white hover:text-white no-underline">How it Works</a>
              <a href="#audience" className="text-white hover:text-white no-underline">For Schools</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="px-3 py-1.5 text-sm text-white hover:text-white font-medium border border-transparent"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-3.5 sm:px-4 py-2 text-sm bg-blue-700 text-white rounded-md hover:bg-blue-800 font-semibold shadow-sm border border-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-6">
              <h1 className="text-[42px] sm:text-6xl font-semibold text-slate-900 leading-tight tracking-tight">
                Stop Student Dropout Before It Happens
              </h1>

              <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-xl">
                AI-powered early warning system for teachers, fieldworkers, and NGOs
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setLoginRedirectPath('/pricing');
                    setShowLogin(true);
                  }}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold text-base shadow-sm flex items-center justify-center gap-2 border border-blue-700"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => {
                    setLoginRedirectPath('/dashboard');
                    setShowLogin(true);
                  }}
                  className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 font-semibold text-base shadow-sm flex items-center justify-center gap-2"
                >
                  View Demo
                </button>
              </div>
            </div>

            {/* Right: Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].caption}
                    className="w-full h-[260px] sm:h-[320px] object-cover"
                  />
                  <div className="absolute bottom-3 left-3 text-xs text-slate-700 bg-white/90 border border-slate-200 rounded px-2 py-1">
                    {slides[currentSlide].caption}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900"
                    aria-label="Previous slide"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900"
                    aria-label="Next slide"
                  >
                    <FaChevronRight />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 border-t border-slate-200 bg-slate-50">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.caption}
                      type="button"
                      className={`w-2 h-2 rounded-full ${
                        index === currentSlide ? "bg-blue-700" : "bg-slate-300"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem to Solution */}
      <section id="how" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">The Problem</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {problemPoints.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">The Solution</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              {solutionPoints.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Core Features</h2>
            <p className="text-sm text-slate-500 max-w-md text-right">
              A focused toolset for early detection and coordinated intervention.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2"
                >
                  <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Icon className="text-sm" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="audience" className="py-14 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-8">Who It's For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {audiences.map((audience) => (
              <div key={audience.title} className="border border-slate-200 rounded-lg p-5 bg-white">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">{audience.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {audience.points.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center border border-slate-200 rounded-lg bg-white px-6 sm:px-10 py-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
            Help students before it's too late.
          </h2>
          <button
            onClick={() => setShowRegister(true)}
            className="mt-4 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold shadow-sm border border-blue-700"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaBook className="text-blue-400" />
              <span className="font-semibold text-white">Proactive Education</span>
            </div>
            <p className="text-sm text-slate-300">
              Decision support for keeping students in school.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <a href="/privacy" className="hover:text-white">Privacy</a>
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/contact" className="hover:text-white">Contact</a>
            <span className="text-slate-400">© 2026 Proactive Education</span>
          </div>
        </div>
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
