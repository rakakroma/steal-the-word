import { convertValueToFitCreatableInput } from './inputs/CreatableSelectInput';

export const getName = (inputName, idInfo, isInDefinition) => {
  if (isInDefinition) {
    return `def**${inputName}**${idInfo}`;
  } else {
    return `context**${inputName}**${idInfo}`;
  }
};

export const getDataFromName = (name) => {
  const splitted = name.split('**');
  return {
    id: splitted[2],
    inputName: splitted[1],
    section: splitted[0],
  };
};
export const getDefaultValueFromData = (wordObj, contextObjs) => {
  const values = {
    word: wordObj.word,
    variants: convertValueToFitCreatableInput(wordObj.variants),
    stem: wordObj.stem,
    matchRule: wordObj.matchRule,
  };

  wordObj.definitions.forEach((def) => {
    const defId = def.definitionId;
    values[getName('note', defId, true)] = def.note;
    values[getName('annotation', defId, true)] = def.annotation;
    values[getName('tags', defId, true)] = def.tags || [];
  });

  contextObjs.forEach((contextObj) => {
    values[getName('context', contextObj.id, false)] = contextObj.context;
  });
  return values;
};
