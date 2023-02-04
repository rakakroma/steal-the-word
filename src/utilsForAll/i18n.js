import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../i18next-locales/en/translation.json';
import jaTranslation from '../i18next-locales/ja/translation.json';
import zhTWTranslation from '../i18next-locales/zh-TW/translation.json';
import { customLangDetector } from './i18nCustomLangDetector';

i18n
  .use(customLangDetector)
  .use(initReactI18next)
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
    react: {
      useSuspense: true,
    },
  });

export default i18n;
