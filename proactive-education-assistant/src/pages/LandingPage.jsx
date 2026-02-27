import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaShieldAlt,
  FaArrowRight,
  FaChartLine,
  FaUsers,
  FaBrain,
  FaMobileAlt,
  FaExclamationTriangle,
  FaDatabase,
  FaLightbulb,
  FaWifi,
  FaGlobe,
  FaUniversalAccess,
  FaTachometerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import LanguageSelector from "../components/LanguageSelector";
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";
import HomePageVideo from "../assets/video/HomePage.mp4";

/* ─── CSS injected once ─────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --sky:       #1a6fb5;
    --sky-light: #2d8fd4;
    --sky-deep:  #0e4a80;
    --accent:    #f0a500;
    --slate:     #3c4a5a;
    --gray:      #6b7a8d;
    --light:     #f5f8fb;
    --white:     #ffffff;
    --text:      #1e2c3a;
    --font-heading: 'DM Serif Display', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); color: var(--text); }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Animated gradient text ── */
  .gradient-text {
    background: linear-gradient(135deg, #f0a500 0%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Blob blobs ── */
  @keyframes blobFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-20px) scale(1.04); }
  }
  .blob { animation: blobFloat 8s ease-in-out infinite; }
  .blob2 { animation: blobFloat 10s ease-in-out 2s infinite; }

  /* ── Counter animation ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-fade-up { animation: fadeUp 0.7s ease both; }

  /* ── Step connector line ── */
  .step-line::after {
    content: '';
    position: absolute;
    top: 26px; left: calc(50% + 26px);
    width: calc(100% - 52px);
    height: 2px;
    background: linear-gradient(90deg, var(--sky)44, var(--sky)11);
  }

  /* ── Dashboard mock ── */
  .risk-high   { background: #FEE2E2; color: #991B1B; }
  .risk-medium { background: #FEF3C7; color: #92400E; }
  .risk-low    { background: #D1FAE5; color: #065F46; }

  /* ── Glassmorphism header ── */
  .glass-header {
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(26,111,181,0.1);
    box-shadow: 0 1px 40px rgba(0,0,0,0.06);
  }

  /* ── Card hover via class ── */
  .horizon-card {
    border: 1px solid rgba(26,111,181,0.1);
    border-radius: 16px;
    background: white;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .horizon-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--sky), var(--sky-light));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .horizon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(26,111,181,0.13);
    border-color: rgba(26,111,181,0.22);
  }
  .horizon-card:hover::before { transform: scaleX(1); }

  /* ── Problem card ── */
  .problem-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    transition: transform 0.25s ease, background 0.25s ease;
  }
  .problem-card:hover {
    transform: translateY(-4px);
    background: rgba(255,255,255,0.1);
  }

  /* ── Scroll counter ── */
  .counter-num {
    font-family: var(--font-heading);
    font-size: 3rem;
    color: var(--sky);
    line-height: 1;
  }

  /* ── Floating animation ── */
  @keyframes floatVideo {
    0%, 100% { 
      transform: translateY(0px);
    }
    50% { 
      transform: translateY(-15px);
    }
  }

  .video-float {
    animation: floatVideo 5s ease-in-out infinite;
  }

  /* ── Video container with beautiful background ── */
  .video-container {
    position: relative;
    padding: 1.5rem;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(26,111,181,0.15) 0%, rgba(240,165,0,0.15) 100%);
    backdrop-filter: blur(10px);
    box-shadow: 
      0 0 0 1.5px rgba(26,111,181,0.5),
      0 0 20px rgba(26,111,181,0.4),
      0 20px 60px rgba(26,111,181,0.3);
    border: 1.5px solid rgba(26,111,181,0.6);
  }

  .video-container::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(135deg, #1a6fb5, #f0a500);
    border-radius: 28px;
    z-index: -1;
    opacity: 0.3;
    filter: blur(30px);
  }

  .video-container::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(26,111,181,0.2) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: -2;
    filter: blur(60px);
  }
`;

/* ─── Scroll reveal hook ────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Animated counter ──────────────────────────────────────────────────── */
function AnimCounter({ target, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect();
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(timer); }
          else setVal(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref} className="counter-num">{val}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);
  const videoRef = useRef(null);

  useReveal();

  // Auto-unmute video after it starts playing (works on initial load and refresh)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptUnmute = () => {
      video.muted = false;
      video.volume = 0.7;
    };

    // Try to unmute immediately
    attemptUnmute();

    // Also try when video starts playing
    const handlePlay = () => {
      attemptUnmute();
    };

    const handleLoadedData = () => {
      video.play().catch(() => {
        // If blocked, play muted then unmute
        video.muted = true;
        video.play().then(() => {
          setTimeout(attemptUnmute, 200);
        });
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const features = [
    {
      icon: FaChartLine,
      title: t("landing_page.features.risk_analytics_title", "Risk Analytics"),
      desc: t("landing_page.features.risk_analytics_desc", "Instant visual risk scoring for every student"),
    },
    {
      icon: FaUsers,
      title: t("landing_page.features.class_management_title", "Class Management"),
      desc: t("landing_page.features.class_management_desc", "Organize classes, subjects, and student data"),
    },
    {
      icon: FaBrain,
      title: t("landing_page.features.smart_insights_title", "Smart Insights"),
      desc: t("landing_page.features.smart_insights_desc", "AI-style alerts for attendance drops and score dips"),
    },
    {
      icon: FaMobileAlt,
      title: t("landing_page.features.offline_first_title", "Offline First"),
      desc: t("landing_page.features.offline_first_desc", "Works without internet, syncs when online"),
    },
  ];

  const problems = [
    {
      icon: FaExclamationTriangle,
      title: t("landing_page.problems.missed_signals_title", "Dropout signals are missed"),
      desc: t(
        "landing_page.problems.missed_signals_desc",
        "Teachers can't manually track 40+ students daily. Early warning signs go unnoticed until it's too late."
      ),
    },
    {
      icon: FaDatabase,
      title: t("landing_page.problems.scattered_data_title", "Data scattered in registers & sheets"),
      desc: t(
        "landing_page.problems.scattered_data_desc",
        "Attendance, marks, and behavior data live in separate places with no unified view or trend analysis."
      ),
    },
    {
      icon: FaLightbulb,
      title: t("landing_page.problems.no_intervention_title", "No early intervention system"),
      desc: t(
        "landing_page.problems.no_intervention_desc",
        "Without actionable alerts, well-meaning teachers have no structured process to intervene before a student drops out."
      ),
    },
  ];

  const steps = [
    {
      num: "01",
      icon: FaDatabase,
      title: t("landing_page.steps.collect_data_title", "Collect Data"),
      desc: t("landing_page.steps.collect_data_desc", "Attendance, marks, and behavior inputs — even offline via mobile."),
    },
    {
      num: "02",
      icon: FaBrain,
      title: t("landing_page.steps.ai_trends_title", "AI Analyzes Trends"),
      desc: t(
        "landing_page.steps.ai_trends_desc",
        "Our explainable AI engine scores each student's dropout risk in real time."
      ),
    },
    {
      num: "03",
      icon: FaCheckCircle,
      title: t("landing_page.steps.act_early_title", "Teachers Act Early"),
      desc: t(
        "landing_page.steps.act_early_desc",
        "Receive targeted intervention recommendations before it's too late."
      ),
    },
  ];

  const accessibility = [
    { icon: FaWifi, label: t("landing_page.accessibility.offline_first", "Offline First") },
    { icon: FaGlobe, label: t("landing_page.accessibility.multilingual", "Multilingual") },
    { icon: FaUniversalAccess, label: t("landing_page.accessibility.accessible", "Accessible") },
    { icon: FaTachometerAlt, label: t("landing_page.accessibility.low_data_mode", "Low Data Mode") },
  ];

  const heroHighlights = [
    t("landing_page.hero.highlights.realtime", "Real-time Risk Prediction"),
    t("landing_page.hero.highlights.offline", "Offline-First for Rural Areas"),
    t("landing_page.hero.highlights.interventions", "Actionable Intervention Insights"),
  ];

  const riskStudents = [
    { name: t("landing_page.preview.students.aarav", "Aarav Shah"), risk: "High", score: 87 },
    { name: t("landing_page.preview.students.priya", "Priya Nair"), risk: "Medium", score: 54 },
    { name: t("landing_page.preview.students.rahul", "Rahul Verma"), risk: "High", score: 91 },
    { name: t("landing_page.preview.students.sana", "Sana Sheikh"), risk: "Low", score: 18 },
    { name: t("landing_page.preview.students.dev", "Dev Patil"), risk: "Medium", score: 63 },
  ];

  const riskLabelMap = {
    High: t("landing_page.preview.risk_high", "High"),
    Medium: t("landing_page.preview.risk_medium", "Medium"),
    Low: t("landing_page.preview.risk_low", "Low"),
  };

  const alertMessages = [
    { msg: t("landing_page.preview.alert_1", "Aarav missed 8 of last 10 classes"), type: "high" },
    { msg: t("landing_page.preview.alert_2", "Rahul's math score dropped 22pts"), type: "high" },
    { msg: t("landing_page.preview.alert_3", "Dev showing disengagement pattern"), type: "medium" },
  ];

  const impactMetrics = [
    {
      target: 30,
      suffix: "%",
      label: t("landing_page.impact.earlier_detection", "Earlier Risk Detection"),
    },
    {
      target: 60,
      suffix: "%",
      label: t("landing_page.impact.faster_response", "Faster Intervention Response"),
    },
    {
      target: 100,
      suffix: "%",
      label: t("landing_page.impact.offline_compatibility", "Offline Compatibility"),
    },
  ];

  return (
    <>
      {/* Inject global styles once */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <div className="min-h-screen" style={{ fontFamily: "var(--font-body)", background: "var(--white)", color: "var(--text)" }}>

        {/* ══ NAVBAR ════════════════════════════════════════════════════════ */}
        <header className="glass-header fixed top-0 left-0 right-0 z-50" style={{ height: "70px" }}>
          <div className="flex items-center justify-between h-full px-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-sm" style={{ background: "var(--sky)" }}>
                {t("landing_page.brand_initials", "ES")}
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>{t("landing_page.brand_name", "EduShield")}</span>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSelector />
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:text-blue-600"
                style={{ color: "var(--slate)", fontWeight: 500 }}
              >
                {t("landing_page.nav.sign_in", "Sign In")}
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="text-white text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                style={{ background: "var(--sky)", padding: "0.5rem 1.3rem", borderRadius: "6px", fontWeight: 600 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sky-deep)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sky)")}
              >
                {t("landing_page.nav.get_started", "Get Started")}
              </button>
            </div>
          </div>
        </header>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
          style={{ paddingTop: "10px", background: "linear-gradient(135deg, #1a6fb5 0%, #2d8fd4 50%, #7ec8e3 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="blob pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)" }} />
          <div className="blob2 pointer-events-none absolute bottom-10 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #f0a500, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-0 opacity-5"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div className="relative z-10 max-w-[1400px] mx-auto w-full -mt-4 lg:-mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.35fr] gap-8 lg:gap-14 items-center">
              <div className="anim-fade-up text-center lg:text-left max-w-xl lg:max-w-[540px] lg:-ml-8">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.5)", color: "white", fontSize: "0.76rem", letterSpacing: "2px", fontWeight: 700 }}
                >
                  <FaShieldAlt />
                  {t("landing_page.hero.badge", "EXPLAINABLE AI RISK ENGINE")}
                </div>

                <h1
                  className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
                  style={{ fontFamily: "var(--font-heading)", color: "white", textShadow: "0 2px 12px rgba(14,74,128,0.15)" }}
                >
                  {t("landing_page.hero.title_prefix", "Predict Dropouts")} {" "}
                  <span className="gradient-text">{t("landing_page.hero.title_highlight", "Before")}</span>{" "}
                  {t("landing_page.hero.title_suffix", "They Happen.")}
                </h1>

                <p
                  className="text-lg max-w-2xl lg:mx-0 mx-auto mb-4"
                  style={{ color: "rgba(255,255,255,0.92)", fontWeight: 400 }}
                >
                  {t(
                    "landing_page.hero.subtitle",
                    "AI-powered early warning system for schools, NGOs, and rural education programs."
                  )}
                </p>

                {/* Bullet highlights */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-10">
                  {heroHighlights.map((b) => (
                    <span key={b} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.95)", fontWeight: 500 }}>
                      <FaCheckCircle style={{ color: "#f0a500" }} /> {b}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => setShowRegister(true)}
                    className="flex items-center gap-2 font-semibold rounded-lg transition-all hover:-translate-y-1 active:translate-y-0"
                    style={{ background: "var(--accent)", color: "#1e2c3a", padding: "0.9rem 2rem", borderRadius: "8px", fontWeight: 700, boxShadow: "0 4px 24px rgba(240,165,0,0.4)", fontSize: "0.95rem" }}
                  >
                    {t("landing_page.hero.start_free", "Start Free")} <FaArrowRight className="text-xs" />
                  </button>
                  <button
                    onClick={() => { setLoginRedirectPath("/dashboard"); setShowLogin(true); }}
                    className="font-semibold rounded-lg transition-all hover:bg-white/10 hover:border-white active:scale-95"
                    style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.45)", padding: "0.9rem 2rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.95rem" }}
                  >
                    {t("landing_page.nav.sign_in", "Sign In")}
                  </button>
                </div>
              </div>

              <div className="anim-fade-up w-full lg:justify-self-end lg:max-w-[980px] xl:max-w-[1060px] px-4 sm:px-0 mt-8 lg:mt-12">
                <div className="video-container video-float">
                  <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <video
                      ref={videoRef}
                      src={HomePageVideo}
                      className="w-full h-auto aspect-video object-cover block"
                      autoPlay
                      loop
                      playsInline
                      controls
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave */}
          <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#1e2c3a" />
          </svg>
        </section>

        {/* ══ PROBLEM SECTION ═══════════════════════════════════════════════ */}
        <section style={{ background: "var(--text)", padding: "6rem 5%" }}>
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "3px" }}>{t("landing_page.problem.badge", "The Challenge")}</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "white" }}>
                {t("landing_page.problem.title", "The Problem Schools Face")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {problems.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="problem-card reveal p-7" style={{ animationDelay: `${i * 0.12}s` }}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                      style={{ background: "rgba(240,165,0,0.15)", border: "1px solid rgba(240,165,0,0.25)" }}>
                      <Icon style={{ color: "var(--accent)", fontSize: "1.2rem" }} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: "white", fontWeight: 600, fontFamily: "var(--font-body)" }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════════════════════ */}
        <section style={{ background: "var(--light)", padding: "6rem 5%" }}>
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>{t("landing_page.solution.badge", "The Solution")}</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                {t("landing_page.solution.title", "How EduShield Works")}
              </h2>
              <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: "var(--gray)", fontWeight: 300 }}>
                {t("landing_page.solution.subtitle", "A simple, three-step pipeline — from raw classroom data to timely teacher action.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="reveal text-center" style={{ transitionDelay: `${i * 0.15}s` }}>
                    {/* Number + connector line */}
                    <div className="relative flex justify-center mb-5">
                      {i < steps.length - 1 && (
                        <div className="hidden md:block absolute top-6 left-1/2 w-full h-px" style={{ background: "linear-gradient(90deg, rgba(26,111,181,0.3), transparent)" }} />
                      )}
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-lg"
                        style={{ background: "linear-gradient(135deg, var(--sky-deep), var(--sky))", fontFamily: "var(--font-heading)" }}>
                        {s.num}
                      </div>
                    </div>
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(26,111,181,0.08)" }}>
                      <Icon style={{ color: "var(--sky)", fontSize: "1.1rem" }} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--text)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--gray)", fontWeight: 300 }}>{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ DASHBOARD PREVIEW ═════════════════════════════════════════════ */}
        <section style={{ background: "var(--white)", padding: "6rem 5%" }}>
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>{t("landing_page.preview.badge", "Live Preview")}</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                {t("landing_page.preview.title", "See Risk Intelligence in Action")}
              </h2>
            </div>

            {/* Mock dashboard card */}
            <div className="reveal rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(26,111,181,0.12)" }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-5 py-3" style={{ background: "var(--text)" }}>
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t("landing_page.preview.dashboard_header", "EduShield Dashboard — Class 9B")}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ background: "var(--light)", borderColor: "rgba(26,111,181,0.1)" }}>
                {/* Student risk list */}
                <div className="p-5 col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--gray)" }}>{t("landing_page.preview.risk_overview", "Risk Overview")}</p>
                  {riskStudents.map((s) => (
                    <div key={s.name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(26,111,181,0.07)" }}>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--sky)" }}>
                          {s.name[0]}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{s.name}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full risk-${s.risk.toLowerCase()}`}>{riskLabelMap[s.risk]}</span>
                    </div>
                  ))}
                </div>

                {/* Trend chart mock */}
                <div className="p-5 col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--gray)" }}>{t("landing_page.preview.attendance_trend", "Attendance Trend")}</p>
                  <div className="flex items-end gap-2 h-28">
                    {[72, 65, 58, 60, 45, 48, 38].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t transition-all" style={{
                        height: `${h}%`,
                        background: h < 50 ? "#FCA5A5" : h < 65 ? "#FDE68A" : `rgba(26,111,181,0.6)`,
                      }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {[
                      t("landing_page.preview.weeks.w1", "W1"),
                      t("landing_page.preview.weeks.w2", "W2"),
                      t("landing_page.preview.weeks.w3", "W3"),
                      t("landing_page.preview.weeks.w4", "W4"),
                      t("landing_page.preview.weeks.w5", "W5"),
                      t("landing_page.preview.weeks.w6", "W6"),
                      t("landing_page.preview.weeks.w7", "W7"),
                    ].map(w => (
                      <span key={w} className="text-xs" style={{ color: "var(--gray)" }}>{w}</span>
                    ))}
                  </div>
                </div>

                {/* Alert box */}
                <div className="p-5 col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--gray)" }}>{t("landing_page.preview.active_alerts", "Active Alerts")}</p>
                  {alertMessages.map((a, i) => (
                    <div key={i} className="flex gap-2 p-2.5 rounded-lg mb-2" style={{ background: a.type === "high" ? "rgba(254,202,202,0.5)" : "rgba(253,230,138,0.4)", border: `1px solid ${a.type === "high" ? "rgba(239,68,68,0.2)" : "rgba(240,165,0,0.2)"}` }}>
                      <FaExclamationTriangle className="mt-0.5 flex-shrink-0" style={{ color: a.type === "high" ? "#DC2626" : "#D97706", fontSize: "0.75rem" }} />
                      <p className="text-xs leading-snug" style={{ color: a.type === "high" ? "#7F1D1D" : "#78350F" }}>{a.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══════════════════════════════════════════════════════ */}
        <section style={{ background: "var(--light)", padding: "6rem 5%" }}>
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>{t("landing_page.features.badge", "What We Offer")}</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                {t("landing_page.features.title", "Built for Real Classrooms")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="horizon-card reveal p-6 text-center" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className="mx-auto mb-3 flex items-center justify-center rounded-xl"
                      style={{ background: "rgba(26,111,181,0.09)", width: "52px", height: "52px", borderRadius: "12px" }}>
                      <Icon style={{ color: "var(--sky)", fontSize: "1.2rem" }} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)", color: "var(--text)", fontWeight: 600 }}>{f.title}</h3>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--gray)", fontSize: "0.83rem" }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ IMPACT METRICS ════════════════════════════════════════════════ */}
        <section style={{ background: "var(--white)", padding: "6rem 5%" }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-12">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>{t("landing_page.impact.badge", "Our Impact")}</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                {t("landing_page.impact.title", "Measurable Results")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 reveal">
              {impactMetrics.map((m, i) => (
                <div key={i} className="horizon-card p-8">
                  <AnimCounter target={m.target} suffix={m.suffix} />
                  <p className="mt-3 text-sm font-medium" style={{ color: "var(--gray)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ACCESSIBILITY SECTION ═════════════════════════════════════════ */}
        <section style={{ background: "var(--light)", padding: "4rem 5%" }}>
          <div className="max-w-4xl mx-auto">
            <div className="reveal text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>{t("landing_page.accessibility.badge", "Inclusive Design")}</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                {t("landing_page.accessibility.title", "Built for Real Classrooms")}
              </h2>
              <p className="mt-3 text-sm" style={{ color: "var(--gray)", fontWeight: 300 }}>
                {t("landing_page.accessibility.subtitle", "Designed to work everywhere — from urban schools to the most remote rural areas.")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 reveal">
              {accessibility.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="horizon-card p-6 flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: "rgba(26,111,181,0.08)" }}>
                      <Icon style={{ color: "var(--sky)", fontSize: "1.2rem" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text)", fontWeight: 600 }}>{a.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0e4a80 0%, #1a6fb5 60%, #2d8fd4 100%)", padding: "7rem 5%" }}>
          <div className="blob pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />

          <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
            <span className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(240,165,0,0.2)", border: "1px solid rgba(240,165,0,0.4)", color: "var(--accent)", letterSpacing: "2px" }}>
              {t("landing_page.cta.badge", "Get Started Today")}
            </span>
            <h2 className="text-3xl md:text-5xl mb-5" style={{ fontFamily: "var(--font-heading)", color: "white" }}>
              {t("landing_page.cta.title", "Start Protecting Students Today.")}
            </h2>
            <p className="mb-10 text-lg" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 300 }}>
              {t(
                "landing_page.cta.subtitle",
                "Join hundreds of schools and NGOs using EduShield to keep students in classrooms where they belong."
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegister(true)}
                className="font-semibold rounded-lg transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ background: "var(--accent)", color: "#1e2c3a", padding: "0.95rem 2.2rem", borderRadius: "8px", fontWeight: 700, boxShadow: "0 4px 24px rgba(240,165,0,0.45)", fontSize: "0.97rem" }}
              >
                {t("landing_page.cta.create_account", "Create School Account")}
              </button>
              <button
                onClick={() => { setLoginRedirectPath("/dashboard"); setShowLogin(true); }}
                className="font-semibold rounded-lg transition-all hover:bg-white/10 hover:border-white"
                style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.45)", padding: "0.95rem 2.2rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.97rem" }}
              >
                {t("landing_page.cta.book_demo", "Book Demo")}
              </button>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <footer className="py-6 text-center text-sm" style={{ background: "var(--text)", color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: "0.83rem" }}>
          {t("landing_page.footer", "© 2026 EduShield — Built for Teachers, By Teachers")}
        </footer>

        {/* ══ MODALS (untouched) ════════════════════════════════════════════ */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => { setShowLogin(false); setLoginRedirectPath(null); }}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
          onLoginSuccess={() => { if (loginRedirectPath) { navigate(loginRedirectPath); setLoginRedirectPath(null); } }}
        />

        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      </div>
    </>
  );
}