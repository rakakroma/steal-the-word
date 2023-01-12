// let kanjiLearningLangs = [
//   'ja',
//   'bopomofo',
//   'pinyin',
//   'nan-tw',
//   'hak-sixian',
//   'hak-hailu',
//   'hak-dabu',
//   'hak-raoping',
//   'hak-zhaoan',
//   'hak-nansixian',
// ];

const langOptions = {
  english: true,
  japanese: true,
  chinese: 'nan-tw',
  hakkaOptions: [
    'hak-sixian',
    'hak-hailu',
    'hak-dabu',
    'hak-raoping',
    'hak-zhaoan',
    'hak-nansixian',
  ],
};

const gooHiraganaAPI = 'https://labs.goo.ne.jp/api/hiragana';

const gooAppId =
  '8732e9655ce0d9734507d59dc5f08c6243192ae556b82e233b8d7394b6517223';

const getMoedictAPI = (word, lang) => {
  return `https://www.moedict.tw/${lang}/${word}.json`;
};

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

const getHiragana = async (textString) => {
  // let hiraganaResult = '';
  let urlencoded = new URLSearchParams();
  urlencoded.append('app_id', gooAppId);
  urlencoded.append('sentence', textString);
  urlencoded.append('output_type', 'hiragana');

  const hiraganaResult = await fetch(gooHiraganaAPI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlencoded,
  })
    .then((response) => response.json())
    .then((result) => {
      return result.converted;
    });

  return hiraganaResult || '';
};

const fetchMoeApi = async (text, lang) => {
  const fetchedData = await fetch(getMoedictAPI(text, lang))
    .then((response) => response.json())
    .catch((err) => console.error(err));
  console.log(fetchedData);
  return fetchedData;
};
const getTaiLo = async (targetWord) => {
  const fetchedData = await fetchMoeApi(targetWord, 't');
  if (!fetchedData) return '';
  const allProns = fetchedData.h.map((group) => group.T);
  return allProns
    .map((pron, index) =>
      allProns.length > 1 ? `(${index + 1}) ${pron}` : pron
    )
    .join(', ')
    .toString();
};

const abbrPair = {
  'hak-sixian': '四',
  'hak-hailu': '海',
  'hak-dabu': '大',
  'hak-raoping': '平',
  'hak-zhaoan': '安',
  'hak-nan': '南',
};
const getHakka = async (targetWord) => {
  const selectedHakkaDialects = langOptions.hakkaOptions.map(
    (engAbbr) => abbrPair[engAbbr]
  );
  const fetchedData = await fetchMoeApi(targetWord, 'h');
  if (!fetchedData) return '';
  const allGroupedProns = fetchedData.h.map((group) =>
    Object.fromEntries(group)
      .split(' ')
      .map((text) => [text[0], text.slice(2)])
  );

  return allGroupedProns
    .map((groupedProns, index) => {
      const selectedResult = groupedProns
        .filter((dialectPronPair) =>
          selectedHakkaDialects.includes(dialectPronPair[0])
        )
        .map((arrayPair) => `${arrayPair[0]}：${arrayPair[1]}`)
        .join(', ');
      if (allGroupedProns.length > 1) {
        return `(${index + 1})${selectedResult}`;
      }
      return selectedResult;
    })
    .join(' ');
};

const getBopomofoOrPinyin = async (targetWord, lang) => {
  const fetchedData = await fetchMoeApi(targetWord, 'raw');
  if (!fetchedData) return '';
  const allProns = fetchedData['heteronyms'].map((group) => group[lang]);

  return allProns
    .map((pron, index) =>
      allProns.length > 1 ? `(${index + 1}) ${pron}` : pron
    )
    .join(', ')
    .toString();
};
const getEngDictApi = (word) =>
  `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
const getEnglishDefinition = async (targetWord) => {
  const fetchedData = await fetch(getEngDictApi(targetWord)).then((response) =>
    response.json()
  );
  if (!fetchedData) return '';
  console.log(fetchedData);
  const pron = fetchedData[0].phonetic || '';

  //too many definitions so pick first one only, maybe a selectable list would be great
  const definition = fetchedData[0].meanings[0].definitions[0].definition;
  return `${pron ? pron + ' ' : ''}${definition}`;
};

export const fetchPronInfo = async (targetWord, contextHere) => {
  let lang;
  const langs = await detectLanguages(contextHere || targetWord);
  const haveKanji = checkKanji(targetWord);
  console.log(langs);
  if ((langOptions.japanese || langOptions.chinese) && haveKanji) {
    if (langOptions.japanese && japaneseInLangs(langs)) {
      lang = 'ja';
    } else {
      lang = langOptions.chinese;
    }
  }
  if (!lang && langOptions.english && checkEnglishAlphabet(targetWord)) {
    lang = 'en';
  }
  if (lang === 'en') {
    const pronAndDefData = await getEnglishDefinition(targetWord);
    return pronAndDefData;
  }
  if (lang === 'ja') {
    const pronData = await getHiragana(targetWord);
    return pronData;
  }
  if (lang === 'nan-tw') {
    const pronData = await getTaiLo(targetWord);
    return pronData;
  }
  if (lang === 'hak') {
    const pronData = await getHakka(targetWord);
    return pronData;
  }
  if (['bopomofo', 'pinyin'].includes(lang)) {
    const pronData = await getBopomofoOrPinyin(targetWord, lang);
    return pronData;
  }
};
