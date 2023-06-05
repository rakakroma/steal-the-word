import {
  createWordRefInTagObj,
  getShouldDeleteTags,
  getExistingTagDataUpdateInfo,
  getNewTagsAndOldTags,
  getTagFullDataArray,
  updateTagsOfTargetDefinition,
} from '../../../../../utilsForAll/handleTags';
import { TagList, Word } from '../../../../Background/dataSchema';
import { DefinitionName, getDataFromName } from './getDataFromName';

interface WordEditingFormData {
  [key: string]: any;
  DefinitionName?: any;
}

export const getUpdatedTagData = (
  data: WordEditingFormData,
  changingTagsWhenDisplay: DefinitionName,
  targetWord: Word,
  tagList: TagList
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

  const tagObjsOfShouldUpdateTag = getExistingTagDataUpdateInfo(
    getTagFullDataArray('id', notNewTagIds, tagList),
    refData
  );

  const targetDefinition = targetWord.definitions.find(
    (definition) => definition.definitionId === refData.defId
  );

  if (!targetDefinition) {
    console.error(`lost definition ${targetWord.id}: defId${refData.defId}`);
    return;
  }
  const tagIdsNotInUpdatedDef = targetDefinition.tags.filter(
    (tagId) => !tagIdArrayForDef.includes(tagId)
  );

  const { shouldDeleteTagIds, updatedTagObjsOfShouldDeleteRef } =
    getShouldDeleteTags(
      getTagFullDataArray('id', tagIdsNotInUpdatedDef, tagList),
      refData
    );

  const shouldUpdateTags = tagObjsOfShouldUpdateTag.concat(
    updatedTagObjsOfShouldDeleteRef
  );

  const newDefinitionOfCurrWord = updateTagsOfTargetDefinition(
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
