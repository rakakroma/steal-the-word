export const getRegexByMatchRule = (matchWord, matchRule) => {
  matchRule = matchRule.toLowerCase();
  const regexByMatchRule = {
    any: matchWord,
    start: `\\b${matchWord}`,
    end: `${matchWord}\\b`,
    independent: `\\b${matchWord}\\b`,
  };
  return regexByMatchRule[matchRule];
};
