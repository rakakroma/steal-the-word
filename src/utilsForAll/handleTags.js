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

//getExistedTagDataUpdateInfo: the update info for tags that are not newly created by current operation
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
  const tagShouldBeDelete = [];
  const tagShouldUpdateItsRefs = [];

  definitions.forEach((definitionData) => {
    const { definitionId, tags } = definitionData;
    const refData = createWordRefInTagObj(wordId, definitionId);

    tags.forEach((tagId) => {
      const tagObjInShouldBeUpdate = tagShouldUpdateItsRefs.find(
        (idRefInfo) => idRefInfo.id === tagId
      );

      if (tagObjInShouldBeUpdate) {
        const newRefs = getFilteredRefs(
          tagObjInShouldBeUpdate.wordDefRefs,
          refData
        );
        if (newRefs.length === 0) {
          tagShouldBeDelete.push(tagId);
          tagShouldUpdateItsRefs.splice(tagObjInShouldBeUpdate, 1);
        } else {
          tagObjInShouldBeUpdate.wordDefRefs = newRefs;
        }
        return;
      }
      const tagObjInTagList = tagList.find((tagObj) => tagObj.id === tagId);
      if (!tagObjInTagList) {
        console.error('not find deleting tag');
      }
      const newRefs = getFilteredRefs(tagObjInTagList.wordDefRefs, refData);
      if (newRefs.length === 0) {
        tagShouldBeDelete.push(tagId);
      } else {
        tagShouldUpdateItsRefs.push({
          id: tagObjInTagList.id,
          wordDefRefs: newRefs,
        });
      }
    });
  });

  return { tagShouldBeDelete, tagShouldUpdateItsRefs };
};

// check if the tag should be fully deleted or just update
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

export const tagNotExistInTagList = (value, tagList) => {
  return tagList.findIndex((tagObj) => tagObj.tag === value) === -1;
};

export const getNewTagsAndOldTags = (tagsData, refData, tagList) => {
  const newTagObjs = [];
  const notNewTagIds = [];
  const tagIdArrayForDef = [];

  tagsData.forEach(({ label: tag, value: tagId }) => {
    if (tagNotExistInTagList(tag, tagList)) {
      const newTagObj = makeTagObj(tag, refData);
      newTagObjs.push(newTagObj);
      tagIdArrayForDef.push(newTagObj.id);
    } else {
      notNewTagIds.push(tagId);
      tagIdArrayForDef.push(tagId);
    }
  });
  return { newTagObjs, tagIdArrayForDef, notNewTagIds };
};
