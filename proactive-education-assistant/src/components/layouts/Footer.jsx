import { FaGraduationCap, FaHeart, FaEnvelope, FaPhone, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-950 dark:to-gray-900 text-gray-300 dark:text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaGraduationCap className="text-teal-400 dark:text-teal-300 text-xl" />
              <h3 className="text-white dark:text-gray-100 font-semibold text-lg">{t('app.brand_full')}</h3>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
              {t('landing.subheadline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white dark:text-gray-100 font-semibold mb-3">{t('footer.quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">{t('footer.dashboard')}</a>
              </li>
              <li>
                <a href="/students" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">{t('footer.student_list')}</a>
              </li>
              <li>
                <a href="/help" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">{t('footer.help_support')}</a>
              </li>
              <li>
                <a href="/about" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">{t('footer.about_us')}</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white dark:text-gray-100 font-semibold mb-3">{t('footer.contact_us')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-teal-400 dark:text-teal-300" />
                <a href="mailto:support@edupro.org" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">
                  support@edupro.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-teal-400 dark:text-teal-300" />
                <a href="tel:+919876543210" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 mt-3">
                <a href="https://github.com" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors" aria-label="GitHub">
                  <FaGithub size={18} />
                </a>
                <a href="https://linkedin.com" className="hover:text-teal-400 dark:hover:text-teal-300 transition-colors" aria-label="LinkedIn">
                  <FaLinkedin size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1 flex-wrap">
            <span>{t('footer.copyright_short')}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <FaHeart className="text-red-500 dark:text-red-400 text-xs" /> {t('footer.built_with_love')}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;