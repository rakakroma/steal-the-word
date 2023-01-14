import { myLog } from '../pages/Content/utils/customLogger';

const getMatchTextsFromWordObj = (wordObj) => {
  const allVariantsToPush = [wordObj.word];
  if (wordObj.stem) allVariantsToPush.push(wordObj.stem);
  if (wordObj.variants?.length > 0) allVariantsToPush.push(...wordObj.variants);
  return allVariantsToPush;
};

export const getMatchTextWithIdRef = (wordObj) => {
  const allVariants = getMatchTextsFromWordObj(wordObj);
  const wordIdRef = wordObj.id;
  const matchTextWithIdRef = allVariants.map((matchText) => {
    return {
      matchText,
      wordIdRef,
      wordMatchRule:
        matchText === wordObj.stem ? 'start' : wordObj.matchRule || 'start',
    };
  });

  return matchTextWithIdRef;
};

export const getMatchList = (wordList) => {
  const start = performance.now();
  let matchList = [];
  wordList.forEach((wordObj) => {
    matchList.push(...getMatchTextWithIdRef(wordObj));
  });
  matchList = matchList.sort((a, b) => b.matchText.length - a.matchText.length);
  const end = performance.now();
  myLog(end - start);
  return matchList;
};

export const getFlatList = (wordList) => {
  let flatList = [];
  wordList.forEach((wordObj) => {
    flatList.push(...getMatchTextsFromWordObj(wordObj));
  });
  return flatList;
};
