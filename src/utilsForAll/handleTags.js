import { nanoid } from 'nanoid';

export const checkSameRef = (firstData, secondData) => {
  return (
    firstData.wordId === secondData.wordId &&
    firstData.defId === secondData.defId
  );
};

export const createWordRefInTagObj = (wordId, defId) => ({
  wordId,
  defId,
});

export const makeTagObj = (tagLabel, refData) => ({
  id: nanoid(),
  tag: tagLabel,
  wordDefRefs: [refData],
});

export const getTagFullDataArray = (
  currentKeyType,
  targetTagArray,
  fullTagList
) => {
  //currentKeyType: 'tag', 'id'
  return targetTagArray.map((tagValue) =>
    fullTagList.find((tagObj) => tagObj[currentKeyType] === tagValue)
  );
};

export const updateDefRef = (definitions, targetDefId, newTagRefOfThatDef) => {
  return [...definitions].map((definition) => {
    if (definition.definitionId === targetDefId) {
      return {
        ...definition,
        tags: newTagRefOfThatDef,
      };
    }
    return definition;
  });
};

export const getExistedTagDataUpdateInfo = (notNewCreatedTags, refData) =>
  notNewCreatedTags.reduce(
    (accu, curr) => {
      const tagObjOfThisTag = curr;
      if (
        tagObjOfThisTag.wordDefRefs.findIndex((ref) =>
          checkSameRef(ref, refData)
        ) === -1
      ) {
        const newDefRefs = [...tagObjOfThisTag.wordDefRefs, refData];
        accu.shouldAddRef.push({
          id: tagObjOfThisTag.id,
          wordDefRefs: newDefRefs,
        });
      }
      return accu;
    },
    { shouldAddRef: [] }
  );

const getFilteredRefs = (oldRefs, shouldDeleteRefData) => {
  return [...oldRefs].filter((ref) => !checkSameRef(ref, shouldDeleteRefData));
};

export const getShouldUpdateTagsFromDeleteDefs = (
  wordId,
  definitions,
  tagList
) => {
  const definitionsAndTheirTagsToDelete = definitions.map((definition) => {
    const { definitionId, tags } = definition;
    return { definitionId, tags };
  });

  return definitionsAndTheirTagsToDelete.reduce(
    (accu, curr) => {
      const refData = {
        wordId,
        defId: curr.definitionId,
      };
      curr.tags.forEach((tagId) => {
        const tagObjInTagList = tagList.find((tagObj) => tagObj.id === tagId);
        const tagObjIndexInAccu = accu.tagShouldUpdateItsRefs.findIndex(
          (idRefInfo) => idRefInfo.id === tagId
        );

        if (tagObjIndexInAccu > -1) {
          const tagObjInAccu = accu.tagShouldUpdateItsRefs[tagObjIndexInAccu];

          const newRefs = getFilteredRefs(tagObjInAccu.wordDefRefs, refData);
          if (newRefs.length === 0) {
            accu.tagShouldBeDelete.push(tagObjInAccu.id);
            accu.tagShouldUpdateItsRefs.splice(tagObjIndexInAccu, 1);
          } else {
            accu.tagShouldUpdateItsRefs[tagObjIndexInAccu].wordDefRefs =
              newRefs;
          }
        } else if (tagObjInTagList) {
          const newRefs = getFilteredRefs(tagObjInTagList.wordDefRefs, refData);
          if (newRefs.length === 0) {
            accu.tagShouldBeDelete.push(tagObjInTagList.id);
          } else {
            accu.tagShouldUpdateItsRefs.push({
              id: tagObjInTagList.id,
              wordDefRefs: newRefs,
            });
          }
        }
      });
      return accu;
    },
    {
      tagShouldBeDelete: [],
      tagShouldUpdateItsRefs: [],
    }
  );
};

export const getDeletedTagsUpdateInfo = (deletedTagObjs, refData) => {
  return deletedTagObjs.reduce(
    (accu, curr) => {
      if (
        curr.wordDefRefs.length === 1 &&
        checkSameRef(curr.wordDefRefs[0], refData)
      ) {
        accu.shouldDeleteTagIds.push(curr.id);
      } else {
        const newDefRef = curr.wordDefRefs.filter(
          (ref) => !checkSameRef(ref, refData)
        );

        accu.shouldDeleteRef.push({ id: curr.id, wordDefRefs: newDefRef });
      }
      return accu;
    },
    {
      shouldDeleteTagIds: [],
      shouldDeleteRef: [],
    }
  );
};
