import {
  createWordRefInTagObj,
  getShouldDeleteTags,
  getExistedTagDataUpdateInfo,
  getNewTagsAndOldTags,
  getTagFullDataArray,
  updateDefRef,
} from '../../../../../utilsForAll/handleTags.js';
import { getDataFromName } from './getDataFromName';

export const getUpdatedTagData = (
  data,
  changingTagsWhenDisplay,
  targetWord,
  tagList
) => {
  const tagsData = data[changingTagsWhenDisplay];
  const refData = createWordRefInTagObj(
    targetWord.id,
    getDataFromName(changingTagsWhenDisplay).id
  );

  const { newTagObjs, notNewTagIds, tagIdArrayForDef } = getNewTagsAndOldTags(
    tagsData,
    refData,
    tagList
  );

  const tagObjsOfShouldUpdateTag = getExistedTagDataUpdateInfo(
    getTagFullDataArray('id', notNewTagIds, tagList),
    refData
  );

  const tagIdsNotInUpdatedDef = targetWord.definitions
    .find((definition) => definition.definitionId === refData.defId)
    .tags.filter((tagId) => !tagIdArrayForDef.includes(tagId));

  const { shouldDeleteTagIds, updatedTagObjsOfShouldDeleteRef } =
    getShouldDeleteTags(
      getTagFullDataArray('id', tagIdsNotInUpdatedDef, tagList),
      refData
    );

  const shouldUpdateTags = tagObjsOfShouldUpdateTag.concat(
    updatedTagObjsOfShouldDeleteRef
  );

  const newDefinitionOfCurrWord = updateDefRef(
    targetWord.definitions,
    refData.defId,
    tagIdArrayForDef
  );

  return {
    refData,
    newDefinitionOfCurrWord,
    newTagObjs,
    shouldDeleteTagIds,
    shouldUpdateTags,
  };
};
