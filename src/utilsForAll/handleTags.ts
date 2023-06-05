import { Tag } from './../pages/Background/dataSchema';
import { nanoid } from 'nanoid';
import {
  Word,
  Definition,
  TagId,
  TagList,
  WordDefRef,
} from '../pages/Background/dataSchema';

export const checkTwoWOrdDefRefIsTheSame = (
  firstData: WordDefRef,
  secondData: WordDefRef
): boolean => {
  return (
    firstData.wordId === secondData.wordId &&
    firstData.defId === secondData.defId
  );
};

const getNewRefsWithoutTargetRef = (
  oldRefs: WordDefRef[],
  shouldDeleteRefData: WordDefRef
): WordDefRef[] => {
  return [...oldRefs].filter(
    (ref) => !checkTwoWOrdDefRefIsTheSame(ref, shouldDeleteRefData)
  );
};

export const createWordRefInTagObj = (
  wordId: WordDefRef['wordId'],
  defId: WordDefRef['defId']
): WordDefRef => ({
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
  targetTagArray: Tag['tag'][] | Tag['id'][],
  fullTagList: TagList
): TagList => {
  const tagObjArrayContainedUndefined = targetTagArray.map((value) =>
    fullTagList.find((tagObj) => tagObj[currentKeyType] === value)
  );

  const tagObjIsExist = (tagObj: Tag | undefined): tagObj is Tag =>
    tagObj !== undefined;

  const arrayWithoutUndefined =
    tagObjArrayContainedUndefined.filter(tagObjIsExist);

  return arrayWithoutUndefined;
};

export const updateTagsOfTargetDefinition = (
  definitions: Definition[],
  targetDefId: WordDefRef['defId'],
  newTagReferences: Definition['tags']
): Definition[] => {
  const getUpdatedDefinition = (definition: Definition): Definition => ({
    ...definition,
    tags: newTagReferences,
  });
  const updateTagReferencesIfTargetDefinition = (
    definition: Definition
  ): Definition => {
    if (definition.definitionId === targetDefId) {
      return getUpdatedDefinition(definition);
    }
    return definition;
  };
  return definitions.map(updateTagReferencesIfTargetDefinition);
};

type TagIdAndNewRefs = {
  id: string;
  wordDefRefs: WordDefRef[];
};

export const getExistingTagDataUpdateInfo = (
  tagsNotNewCreated: TagList,
  refData: WordDefRef
): TagIdAndNewRefs[] => {
  const tagNotContainTargetRef = (
    wordDefsInTag: WordDefRef[],
    targetRefData: WordDefRef
  ) =>
    wordDefsInTag.findIndex((ref) =>
      checkTwoWOrdDefRefIsTheSame(ref, targetRefData)
    ) === -1;

  const existingTagsNewlyAddedByTheDefinition = tagsNotNewCreated.filter(
    (tagObj) => tagNotContainTargetRef(tagObj.wordDefRefs, refData)
  );

  const makeTagIdAndNewRefs = (tagObj: Tag, targetRefData: WordDefRef) => {
    const newDefRefs: WordDefRef[] = [...tagObj.wordDefRefs, refData];
    const tagIdAndNewRefs: TagIdAndNewRefs = {
      id: tagObj.id,
      wordDefRefs: newDefRefs,
    };
    return tagIdAndNewRefs;
  };
  const updatedTagsInfo = existingTagsNewlyAddedByTheDefinition.map((tagObj) =>
    makeTagIdAndNewRefs(tagObj, refData)
  );
  return updatedTagsInfo;
};

export const getShouldUpdateTagsFromDeleteDefs = (
  wordId: Word['id'],
  definitions: Definition[],
  tagList: TagList
) => {
  const tagShouldBeDelete: TagId[] = [];
  let tagShouldUpdateItsRefs: TagIdAndNewRefs[] = [];

  definitions.forEach((definitionData) => {
    const { definitionId, tags } = definitionData;
    const refData = createWordRefInTagObj(wordId, definitionId);

    tags.forEach((tagId) => {
      const tagObjInShouldBeUpdate = tagShouldUpdateItsRefs.find(
        (idRefInfo) => idRefInfo.id === tagId
      );
      if (tagObjInShouldBeUpdate) {
        const newRefs = getNewRefsWithoutTargetRef(
          tagObjInShouldBeUpdate.wordDefRefs,
          refData
        );
        const deleteThisTagFromTagList = (targetTagId: TagId) => {
          tagShouldBeDelete.push(targetTagId);
          tagShouldUpdateItsRefs = tagShouldUpdateItsRefs.filter(
            (tagIdAndNewRefs) => tagIdAndNewRefs.id !== targetTagId
          );
        };

        if (newRefs.length === 0) {
          deleteThisTagFromTagList(tagId);
        } else {
          tagObjInShouldBeUpdate.wordDefRefs = newRefs;
        }
      } else {
        const tagObjInTagList = tagList.find((tagObj) => tagObj.id === tagId);
        if (!tagObjInTagList) {
          console.error('not find deleting tag');
        } else {
          const newRefs = getNewRefsWithoutTargetRef(
            tagObjInTagList.wordDefRefs,
            refData
          );
          if (newRefs.length === 0) {
            tagShouldBeDelete.push(tagId);
          } else {
            tagShouldUpdateItsRefs.push({
              id: tagObjInTagList.id,
              wordDefRefs: newRefs,
            });
          }
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
      checkTwoWOrdDefRefIsTheSame(tagObj.wordDefRefs[0], refData)
    ) {
      shouldDeleteTagIds.push(tagObj.id);
    } else {
      const newDefRef = tagObj.wordDefRefs.filter(
        (ref) => !checkTwoWOrdDefRefIsTheSame(ref, refData)
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
