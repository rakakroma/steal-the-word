export const transformElementId = (eleId, target) => {
  const splittedEleId = eleId.split('-');
  if (target === 'wordId')
    return splittedEleId.slice(1, splittedEleId.length - 1).join('-');
  if (target === 'count') return splittedEleId[splittedEleId.length - 1];
};
