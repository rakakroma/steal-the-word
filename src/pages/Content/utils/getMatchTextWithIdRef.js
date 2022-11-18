export const getMatchTextWithIdRef = (wordObj) => {
  const wordIdRef = wordObj.id;
  const allVariantsToPush = [wordObj.word];
  if (wordObj.stem) allVariantsToPush.push(wordObj.stem);
  if (wordObj.variants?.length > 0) allVariantsToPush.push(...wordObj.variants);
  const matchTextWithIdRef = allVariantsToPush.map((matchText) => {
    return { matchText, wordIdRef };
  });
  return matchTextWithIdRef;
};
