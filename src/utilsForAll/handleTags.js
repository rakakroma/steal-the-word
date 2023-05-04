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

export const getExistedTagDataUpdateInfo = (oldTags, refData) =>
  oldTags.reduce((accu, tagObj) => {
    if (
      tagObj.wordDefRefs.findIndex((ref) => checkSameRef(ref, refData)) === -1
    ) {
      const newDefRefs = [...tagObj.wordDefRefs, refData];
      accu.push({
        id: tagObj.id,
        wordDefRefs: newDefRefs,
      });
    }
    return accu;
  }, []);

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

export const getShouldDeleteTags = (tagObjsRemovedFromCurrentDef, refData) => {
  return tagObjsRemovedFromCurrentDef.reduce(
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

        accu.updatedTagObjsOfShouldDeleteRef.push({
          id: curr.id,
          wordDefRefs: newDefRef,
        });
      }
      return accu;
    },
    {
      shouldDeleteTagIds: [],
      updatedTagObjsOfShouldDeleteRef: [],
    }
  );
};

export const isNewTagValue = (value, tagList) => {
  return tagList.findIndex((tagObj) => tagObj.tag === value) === -1;
};

export const getNewTagsAndOldTags = (tagsData, refData, tagList) =>
  tagsData.reduce(
    (accu, curr) => {
      const tag = curr.label;
      const tagId = curr.value;
      if (isNewTagValue(tag, tagList)) {
        const newTagObj = makeTagObj(tag, refData);
        accu.newTagObjs.push(newTagObj);
        accu.tagIdArrayForDef.push(newTagObj.id);
      } else {
        accu.notNewTagIds.push(tagId);
        accu.tagIdArrayForDef.push(tagId);
      }
      return accu;
    },
    {
      newTagObjs: [],
      notNewTagIds: [],
      tagIdArrayForDef: [],
    }
  );
