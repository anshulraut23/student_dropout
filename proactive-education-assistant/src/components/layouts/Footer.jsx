import { FaGraduationCap, FaHeart, FaEnvelope, FaPhone, FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-linear-to-r from-gray-800 to-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaGraduationCap className="text-teal-400 text-xl" />
              <h3 className="text-white font-semibold text-lg">Proactive Education Assistant</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering educators and NGO workers to identify at-risk students early and
              prevent school dropouts through data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-teal-400 transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="/students" className="hover:text-teal-400 transition-colors">Student List</a>
              </li>
              <li>
                <a href="/help" className="hover:text-teal-400 transition-colors">Help & Support</a>
              </li>
              <li>
                <a href="/about" className="hover:text-teal-400 transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-teal-400" />
                <a href="mailto:support@edupro.org" className="hover:text-teal-400 transition-colors">
                  support@edupro.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-teal-400" />
                <a href="tel:+919876543210" className="hover:text-teal-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 mt-3">
                <a href="https://github.com" className="hover:text-teal-400 transition-colors" aria-label="GitHub">
                  <FaGithub size={18} />
                </a>
                <a href="https://linkedin.com" className="hover:text-teal-400 transition-colors" aria-label="LinkedIn">
                  <FaLinkedin size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1 flex-wrap">
            <span>© 2026 Proactive Education Assistant.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <FaHeart className="text-red-500 text-xs" /> for educators and students
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;