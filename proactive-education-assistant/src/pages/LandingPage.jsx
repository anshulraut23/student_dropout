import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";

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
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);

  useReveal();

  const features = [
    { icon: FaChartLine, title: "Risk Analytics",    desc: "Instant visual risk scoring for every student" },
    { icon: FaUsers,     title: "Class Management",  desc: "Organize classes, subjects, and student data" },
    { icon: FaBrain,     title: "Smart Insights",    desc: "AI-style alerts for attendance drops and score dips" },
    { icon: FaMobileAlt, title: "Offline First",     desc: "Works without internet, syncs when online" },
  ];

  const problems = [
    { icon: FaExclamationTriangle, title: "Dropout signals are missed",         desc: "Teachers can't manually track 40+ students daily. Early warning signs go unnoticed until it's too late." },
    { icon: FaDatabase,            title: "Data scattered in registers & sheets", desc: "Attendance, marks, and behavior data live in separate places with no unified view or trend analysis." },
    { icon: FaLightbulb,           title: "No early intervention system",        desc: "Without actionable alerts, well-meaning teachers have no structured process to intervene before a student drops out." },
  ];

  const steps = [
    { num: "01", icon: FaDatabase,   title: "Collect Data",       desc: "Attendance, marks, and behavior inputs — even offline via mobile." },
    { num: "02", icon: FaBrain,      title: "AI Analyzes Trends", desc: "Our explainable AI engine scores each student's dropout risk in real time." },
    { num: "03", icon: FaCheckCircle,title: "Teachers Act Early", desc: "Receive targeted intervention recommendations before it's too late." },
  ];

  const accessibility = [
    { icon: FaWifi,            label: "Offline First" },
    { icon: FaGlobe,           label: "Multilingual" },
    { icon: FaUniversalAccess, label: "Accessible" },
    { icon: FaTachometerAlt,   label: "Low Data Mode" },
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
                ES
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>EduShield</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:text-blue-600"
                style={{ color: "var(--slate)", fontWeight: 500 }}
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="text-white text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                style={{ background: "var(--sky)", padding: "0.5rem 1.3rem", borderRadius: "6px", fontWeight: 600 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sky-deep)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sky)")}
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
          style={{ paddingTop: "100px", background: "linear-gradient(135deg, #1a6fb5 0%, #2d8fd4 50%, #7ec8e3 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="blob pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)" }} />
          <div className="blob2 pointer-events-none absolute bottom-10 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #f0a500, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-0 opacity-5"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div className="relative z-10 max-w-4xl mx-auto text-center anim-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.5)", color: "white", fontSize: "0.76rem", letterSpacing: "2px", fontWeight: 700 }}>
              <FaShieldAlt />
              EXPLAINABLE AI RISK ENGINE
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "white", textShadow: "0 2px 12px rgba(14,74,128,0.15)" }}>
              Predict Dropouts{" "}
              <span className="gradient-text">Before</span>{" "}
              They Happen.
            </h1>

            <p className="text-lg max-w-2xl mx-auto mb-4"
              style={{ color: "rgba(255,255,255,0.92)", fontWeight: 400 }}>
              AI-powered early warning system for schools, NGOs, and rural education programs.
            </p>

            {/* Bullet highlights */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
              {["Real-time Risk Prediction", "Offline-First for Rural Areas", "Actionable Intervention Insights"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.95)", fontWeight: 500 }}>
                  <FaCheckCircle style={{ color: "#f0a500" }} /> {b}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegister(true)}
                className="flex items-center gap-2 font-semibold rounded-lg transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ background: "var(--accent)", color: "#1e2c3a", padding: "0.9rem 2rem", borderRadius: "8px", fontWeight: 700, boxShadow: "0 4px 24px rgba(240,165,0,0.4)", fontSize: "0.95rem" }}
              >
                Start Free <FaArrowRight className="text-xs" />
              </button>
              <button
                onClick={() => { setLoginRedirectPath("/dashboard"); setShowLogin(true); }}
                className="font-semibold rounded-lg transition-all hover:bg-white/10 hover:border-white active:scale-95"
                style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.45)", padding: "0.9rem 2rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.95rem" }}
              >
                Sign In
              </button>
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "3px" }}>The Challenge</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "white" }}>
                The Problem Schools Face
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>The Solution</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                How EduShield Works
              </h2>
              <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: "var(--gray)", fontWeight: 300 }}>
                A simple, three-step pipeline — from raw classroom data to timely teacher action.
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>Live Preview</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                See Risk Intelligence in Action
              </h2>
            </div>

            {/* Mock dashboard card */}
            <div className="reveal rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(26,111,181,0.12)" }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-5 py-3" style={{ background: "var(--text)" }}>
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>EduShield Dashboard — Class 9B</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ background: "var(--light)", borderColor: "rgba(26,111,181,0.1)" }}>
                {/* Student risk list */}
                <div className="p-5 col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--gray)" }}>Risk Overview</p>
                  {[
                    { name: "Aarav Shah",   risk: "High",   score: 87 },
                    { name: "Priya Nair",   risk: "Medium", score: 54 },
                    { name: "Rahul Verma",  risk: "High",   score: 91 },
                    { name: "Sana Sheikh",  risk: "Low",    score: 18 },
                    { name: "Dev Patil",    risk: "Medium", score: 63 },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(26,111,181,0.07)" }}>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--sky)" }}>
                          {s.name[0]}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{s.name}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full risk-${s.risk.toLowerCase()}`}>{s.risk}</span>
                    </div>
                  ))}
                </div>

                {/* Trend chart mock */}
                <div className="p-5 col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--gray)" }}>Attendance Trend</p>
                  <div className="flex items-end gap-2 h-28">
                    {[72, 65, 58, 60, 45, 48, 38].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t transition-all" style={{
                        height: `${h}%`,
                        background: h < 50 ? "#FCA5A5" : h < 65 ? "#FDE68A" : `rgba(26,111,181,0.6)`,
                      }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {["W1","W2","W3","W4","W5","W6","W7"].map(w => (
                      <span key={w} className="text-xs" style={{ color: "var(--gray)" }}>{w}</span>
                    ))}
                  </div>
                </div>

                {/* Alert box */}
                <div className="p-5 col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--gray)" }}>Active Alerts</p>
                  {[
                    { msg: "Aarav missed 8 of last 10 classes", type: "high" },
                    { msg: "Rahul's math score dropped 22pts", type: "high" },
                    { msg: "Dev showing disengagement pattern", type: "medium" },
                  ].map((a, i) => (
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>What We Offer</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                Built for Real Classrooms
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>Our Impact</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                Measurable Results
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 reveal">
              {[
                { target: 30, suffix: "%", label: "Earlier Risk Detection" },
                { target: 60, suffix: "%", label: "Faster Intervention Response" },
                { target: 100, suffix: "%", label: "Offline Compatibility" },
              ].map((m, i) => (
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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--sky)", letterSpacing: "3px" }}>Inclusive Design</span>
              <h2 className="mt-2 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                Built for Real Classrooms
              </h2>
              <p className="mt-3 text-sm" style={{ color: "var(--gray)", fontWeight: 300 }}>
                Designed to work everywhere — from urban schools to the most remote rural areas.
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
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-5xl mb-5" style={{ fontFamily: "var(--font-heading)", color: "white" }}>
              Start Protecting Students Today.
            </h2>
            <p className="mb-10 text-lg" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 300 }}>
              Join hundreds of schools and NGOs using EduShield to keep students in classrooms where they belong.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowRegister(true)}
                className="font-semibold rounded-lg transition-all hover:-translate-y-1 active:translate-y-0"
                style={{ background: "var(--accent)", color: "#1e2c3a", padding: "0.95rem 2.2rem", borderRadius: "8px", fontWeight: 700, boxShadow: "0 4px 24px rgba(240,165,0,0.45)", fontSize: "0.97rem" }}
              >
                Create School Account
              </button>
              <button
                onClick={() => { setLoginRedirectPath("/dashboard"); setShowLogin(true); }}
                className="font-semibold rounded-lg transition-all hover:bg-white/10 hover:border-white"
                style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.45)", padding: "0.95rem 2.2rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.97rem" }}
              >
                Book Demo
              </button>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <footer className="py-6 text-center text-sm" style={{ background: "var(--text)", color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: "0.83rem" }}>
          © 2026 EduShield — Built for Teachers, By Teachers
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