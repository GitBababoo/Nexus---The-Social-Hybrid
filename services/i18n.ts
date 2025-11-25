
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { TRANSLATIONS } from './translations';
import { db } from './db';

// Get initial language from DB or default to browser
const savedSettings = db.getSettings();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: TRANSLATIONS.en },
      th: { translation: TRANSLATIONS.th },
      jp: { translation: TRANSLATIONS.jp },
      cn: { translation: TRANSLATIONS.cn },
      es: { translation: TRANSLATIONS.es },
      fr: { translation: TRANSLATIONS.fr }
    },
    lng: savedSettings.language || 'en', // Force startup language from DB settings
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false // Prevent loading issues in this environment
    }
  });

export default i18n;
