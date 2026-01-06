import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaChartLine, FaBell, FaUsers, FaLightbulb, FaShieldAlt, FaMobile, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const features = [
    {
      icon: FaChartLine,
      title: "Risk Prediction",
      description: "AI-powered analytics identify at-risk students before they drop out, giving you time to intervene."
    },
    {
      icon: FaBell,
      title: "Early Alerts",
      description: "Real-time notifications when students show warning signs like declining attendance or grades."
    },
    {
      icon: FaLightbulb,
      title: "Smart Interventions",
      description: "Get personalized intervention recommendations tailored to each student's unique situation."
    },
    {
      icon: FaUsers,
      title: "Collaborative Tools",
      description: "Coordinate with teachers, counselors, and field workers all in one platform."
    },
    {
      icon: FaMobile,
      title: "Works Offline",
      description: "Access critical student data even in areas with poor connectivity. Syncs when online."
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Private",
      description: "Student data is encrypted and protected, complying with education privacy standards."
    }
  ];

  const stats = [
    { number: "85%", label: "Dropout Prevention Rate" },
    { number: "10K+", label: "Students Monitored" },
    { number: "200+", label: "Schools & NGOs" },
    { number: "24/7", label: "Support Available" }
  ];

  const benefits = [
    "Identify struggling students 3-6 months earlier",
    "Reduce dropout rates by up to 85%",
    "Save 70% of administrative time on reporting",
    "Track interventions and measure impact",
    "Generate reports for donors and stakeholders",
    "Access from any device, anywhere"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Proactive <span className="text-blue-600">Education</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <FaCheckCircle />
                <span>Trusted by 200+ Schools & NGOs</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Prevent Student Dropouts <span className="text-blue-600">Before They Happen</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                AI-powered early warning system for teachers, field workers, and NGOs to identify and support at-risk students before it's too late.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <FaArrowRight />
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  View Demo
                </button>
              </div>

              <p className="text-sm text-gray-500">
                No credit card required • Free for first 30 days • Cancel anytime
              </p>
            </div>

            {/* Right: Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Risk Dashboard</h3>
                      <p className="text-sm text-gray-500">Live student monitoring</p>
                    </div>
                  </div>

                  {/* Mock Risk Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">8</div>
                      <div className="text-xs text-red-700 font-medium mt-1">High Risk</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">12</div>
                      <div className="text-xs text-yellow-700 font-medium mt-1">Medium Risk</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">45</div>
                      <div className="text-xs text-green-700 font-medium mt-1">Low Risk</div>
                    </div>
                  </div>

                  {/* Mock Student List */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          i === 1 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {i === 1 ? 'High' : 'Medium'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
                ✓ Real-time Updates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Save Students
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for educators working in challenging environments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Measurable Impact on Student Success
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of schools and NGOs using data-driven insights to prevent dropouts and improve student outcomes.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowRegister(true)}
                className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Get Started Now
                <FaArrowRight />
              </button>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Student: Rajesh Kumar</h3>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    High Risk
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Attendance Trend</div>
                    <div className="flex items-end gap-1 h-16">
                      {[85, 78, 72, 68, 62].map((val, i) => (
                        <div key={i} className="flex-1 bg-red-400 rounded-t" style={{ height: `${val}%` }}></div>
                      ))}
                    </div>
                    <div className="text-xs text-red-600 font-medium mt-1">↓ Declining 23% in 5 weeks</div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <FaLightbulb className="text-yellow-600 mt-1" />
                      <div>
                        <div className="font-semibold text-yellow-900 text-sm mb-1">Recommended Actions</div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Schedule parent meeting</li>
                          <li>• Check for family issues</li>
                          <li>• Peer buddy assignment</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start identifying and supporting at-risk students today. No technical expertise required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              Start Free Trial
              <FaArrowRight />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Sign In
            </button>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            Questions? Contact us at <a href="mailto:support@proactiveeducation.org" className="underline hover:text-white">support@proactiveeducation.org</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FaBook className="text-white text-sm" />
                </div>
                <span className="text-white font-semibold">Proactive Education</span>
              </div>
              <p className="text-sm">
                Empowering educators to prevent student dropouts through data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Proactive Education Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
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
