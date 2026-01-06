import { useEffect, useState } from 'react';
import i18n from 'i18next';

const options = [
  { value: 'en', label: 'EN' },
  { value: 'hi', label: 'HI' },
  { value: 'mr', label: 'MR' }
];

export default function LanguageSelector({ className = '' }) {
  const [lang, setLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const onChange = (l) => setLang(l);
    i18n.on('languageChanged', onChange);
    return () => i18n.off('languageChanged', onChange);
  }, []);

  const handleChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    try {
      localStorage.removeItem('i18nextLng');
      localStorage.removeItem('appLang');
      localStorage.setItem('i18nextLng', newLang);
    } catch (_e) {}
    i18n.changeLanguage(newLang).then(() => {
      // Force reload to ensure all components update
      window.location.reload();
    });
  };

  return (
    <select
      aria-label="Language"
      value={lang}
      onChange={handleChange}
      className={`px-2 py-1 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
