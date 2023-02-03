export const detectLang = async () => {
  const localLang = await chrome.storage.local.get(['i18nextLang']);
  if (localLang?.i18nextLang) return localLang.i18nextLang;
  const uiLang = chrome.i18n.getUILanguage();
  let matchResult = '';

  const langStartTransform = {
    zh: 'zh-TW',
    ja: 'ja',
    en: 'en',
  };
  matchResult = langStartTransform[uiLang.substring(0, 2)];
  if (matchResult) return matchResult;

  const acceptedLangs = await chrome.i18n.getAcceptLanguages();

  for (let i = 0; i < acceptedLangs.length; i++) {
    matchResult = langStartTransform[acceptedLangs[i].substring(0, 2)];
    if (matchResult) {
      return matchResult;
    }
  }
  return 'en';
};

export const customLangDetector = {
  type: 'languageDetector',
  async: true,
  detect: detectLang,
  cacheUserLanguage: async function (lng) {
    chrome.storage.local.set({ i18nextLang: lng });
  },
};
