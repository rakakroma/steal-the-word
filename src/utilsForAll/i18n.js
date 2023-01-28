import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';
import jaTranslation from '../locales/ja/translation.json';
import zhTWTranslation from '../locales/zh-TW/translation.json';
import { customLangDetector } from './i18nCustomLangDetector';

i18n
  .use(customLangDetector)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  //   .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    returnEmptyString: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      'zh-TW': {
        translation: zhTWTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
    },
  });

export default i18n;
