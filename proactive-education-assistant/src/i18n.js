import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';
import { translateText } from './utils/googleTranslate';

const supportedLangs = ['en', 'hi', 'mr'];

function getInitialLanguage() {
  const saved = localStorage.getItem('i18nextLng') || localStorage.getItem('appLang');
  if (saved && supportedLangs.includes(saved)) return saved;
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // enable missing key handling so we can auto-translate
    saveMissing: true,
    updateMissing: true,
    missingKeyHandler: async (lngs, ns, key) => {
      const current = Array.isArray(lngs) ? lngs[0] : lngs;
      if (!current || current === 'en') return;

      const exists = i18n.exists(key, { lng: current, ns, fallbackLng: false });
      if (exists) return;

      const baseText = i18n.getResource('en', ns, key) || key;
      try {
        const translated = await translateText(baseText, current, 'en');
        if (translated && typeof translated === 'string') {
          i18n.addResource(current, ns, key, translated);
          // trigger re-render in react-i18next consumers
          const active = i18n.language;
          if (active === current) {
            i18n.emit('languageChanged', current);
          }
        }
      } catch (_e) {
        // ignore translate errors; fallback to English handled by i18next
      }
    },
  });

// keep localStorage in sync when language changes
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('i18nextLng', lng);
  } catch (_e) {
    // ignore storage failures
  }
});

export default i18n;
