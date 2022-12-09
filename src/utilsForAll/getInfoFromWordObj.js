export const getAllMatchTextFromWordObj = (wordObj) => {
  const matchTexts = [wordObj.word];
  if (wordObj.stem) matchTexts.push(wordObj.stem);
  if (wordObj.variants?.length > 0)
    wordObj.variants.forEach((variant) => {
      matchTexts.push(variant);
    });
  matchTexts.sort((a, b) => b.length - a.length);
  return matchTexts;
};
