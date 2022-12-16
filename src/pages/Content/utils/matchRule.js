export const getRegexByMatchRule = (matchWord, matchRule) => {
  matchRule = matchRule.toLowerCase();
  const regexSafeStr = matchWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const regexByMatchRule = {
    any: regexSafeStr,
    start: `\\b${regexSafeStr}`,
    end: `${regexSafeStr}\\b`,
    independent: `\\b${regexSafeStr}\\b`,
  };
  return regexByMatchRule[matchRule];
};
