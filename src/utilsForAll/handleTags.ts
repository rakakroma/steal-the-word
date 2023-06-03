import { Tag } from './../pages/Background/dataSchema';
import { nanoid } from 'nanoid';
import {
  Word,
  Definition,
  TagId,
  TagList,
  WordDefRef,
} from '../pages/Background/dataSchema';

export const checkSameRef = (
  firstData: WordDefRef,
  secondData: WordDefRef
): boolean => {
  return (
    firstData.wordId === secondData.wordId &&
    firstData.defId === secondData.defId
  );
};

const getFilteredRefs = (
  oldRefs: WordDefRef[],
  shouldDeleteRefData: WordDefRef
): WordDefRef[] => {
  return [...oldRefs].filter((ref) => !checkSameRef(ref, shouldDeleteRefData));
};

export const createWordRefInTagObj = (
  wordId: WordDefRef['wordId'],
  defId: WordDefRef['defId']
) => ({
  wordId,
  defId,
});

export const makeTagObj = (tagLabel: string, refData: WordDefRef) => ({
  id: nanoid(),
  tag: tagLabel,
  wordDefRefs: [refData],
});

export const getTagFullDataArray = (
  currentKeyType: 'tag' | 'id',
  targetTagArray: [],
  fullTagList: TagList
) => {
  return targetTagArray.map((tagValue) =>
    fullTagList.find((tagObj) => tagObj[currentKeyType] === tagValue)
  );
};

export const updateDefRef = (
  definitions: Definition[],
  targetDefId: WordDefRef['defId'],
  newTagRefOfThatDef: Definition['tags']
): Definition[] => {
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

type TagIdAndNewRefs = {
  id: string;
  wordDefRefs: WordDefRef[];
};

export const getExistedTagDataUpdateInfo = (
  oldTags: TagList,
  refData: WordDefRef
): TagIdAndNewRefs[] => {
  const result: TagIdAndNewRefs[] = [];

  oldTags.forEach((tagObj) => {
    if (
      tagObj.wordDefRefs.findIndex((ref) => checkSameRef(ref, refData)) === -1
    ) {
      const newDefRefs: WordDefRef[] = [...tagObj.wordDefRefs, refData];
      const tagIdAndNewRefs: TagIdAndNewRefs = {
        id: tagObj.id,
        wordDefRefs: newDefRefs,
      };
      result.push(tagIdAndNewRefs);
    }
  });

  return result;
};

export const getShouldUpdateTagsFromDeleteDefs = (
  wordId: Word['id'],
  definitions: Definition[],
  tagList: TagList
) => {
  const tagShouldBeDelete: TagId[] = [];
  const tagShouldUpdateItsRefs: TagIdAndNewRefs[] = [];

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
          tagShouldUpdateItsRefs.filter(
            (tagIdAndNewRefs) =>
              tagIdAndNewRefs.id !== tagObjInShouldBeUpdate.id
          );
        } else {
          tagObjInShouldBeUpdate.wordDefRefs = newRefs;
        }
        return;
      }
      const tagObjInTagList = tagList.find((tagObj) => tagObj.id === tagId);
      if (!tagObjInTagList) {
        console.error('not find deleting tag');
        return;
      } else {
        const newRefs = getFilteredRefs(tagObjInTagList.wordDefRefs, refData);
        if (newRefs.length === 0) {
          tagShouldBeDelete.push(tagId);
        } else {
          tagShouldUpdateItsRefs.push({
            id: tagObjInTagList.id,
            wordDefRefs: newRefs,
          });
        }
      }
    });
  });

  return { tagShouldBeDelete, tagShouldUpdateItsRefs };
};

// check if the tag should be fully deleted or just update

export const getShouldDeleteTags = (
  tagObjsRemovedFromCurrentDef: TagList,
  refData: WordDefRef
) => {
  const shouldDeleteTagIds: TagId[] = [];
  const updatedTagObjsOfShouldDeleteRef: TagIdAndNewRefs[] = [];

  tagObjsRemovedFromCurrentDef.forEach((tagObj) => {
    if (
      tagObj.wordDefRefs.length === 1 &&
      checkSameRef(tagObj.wordDefRefs[0], refData)
    ) {
      shouldDeleteTagIds.push(tagObj.id);
    } else {
      const newDefRef = tagObj.wordDefRefs.filter(
        (ref) => !checkSameRef(ref, refData)
      );

      updatedTagObjsOfShouldDeleteRef.push({
        id: tagObj.id,
        wordDefRefs: newDefRef,
      });
    }
  });

  return {
    shouldDeleteTagIds,
    updatedTagObjsOfShouldDeleteRef,
  };
};

export const tagNotExistInTagList = (
  tagValue: Tag['tag'],
  tagList: TagList
): boolean => {
  return tagList.findIndex((tagObj) => tagObj.tag === tagValue) === -1;
};

export const getNewTagsAndOldTags = (
  tagsData: { label: Tag['tag']; value: Tag['id'] }[],
  refData: WordDefRef,
  tagList: TagList
) => {
  const newTagObjs: TagList = [];
  const notNewTagIds: TagId[] = [];
  const tagIdArrayForDef: TagId[] = [];

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
