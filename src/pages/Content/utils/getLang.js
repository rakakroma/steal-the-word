const detectLanguages = async (textString) => {
  const { languages } = await chrome.i18n.detectLanguage(textString);
  return languages;
};
const checkKanji = (textString) => {
  const regexKanji = new RegExp(/\p{sc=Hani}/gu);
  return regexKanji.test(textString);
};
const japaneseInLangs = (langs) => {
  return langs.findIndex((lang) => lang.language === 'ja') > -1;
};
const checkEnglishAlphabet = (textString) => {
  return new RegExp(/[a-z]/i).test(textString);
};
export const getLang = async (targetWord, contextHere, langOptions) => {
  const langs = await detectLanguages(contextHere || targetWord);
  const haveKanji = checkKanji(targetWord);
  if ((langOptions.japanese || langOptions.chinese) && haveKanji) {
    if (langOptions.japanese && japaneseInLangs(langs)) {
      return 'ja';
    } else {
      return langOptions.chinese;
    }
  }
  if (langOptions.english && checkEnglishAlphabet(targetWord)) {
    return 'en';
  }
};
