import {
  getShouldDeleteTags,
  getExistedTagDataUpdateInfo,
  createWordRefInTagObj,
  makeTagObj,
  getTagFullDataArray,
  updateDefRef,
} from '../../../../../../utilsForAll/handleTags';
import { updateTags } from '../../../../../Background/handler/updateData';
import { submitAndExecute } from './submitAndExecute';

export const submitTags = (
  wordBlock,
  tagList,
  tagObjs,
  selectedOptions,
  newAddedOptions,
  definitionId
) => {
  const notNewCreatedTags = getTagFullDataArray(
    'tag',
    selectedOptions.filter((tagLabel) => !newAddedOptions.includes(tagLabel)),
    tagList
  );
  const notNewCreatedTagIds = notNewCreatedTags.map((tagObj) => tagObj.id);
  const refData = createWordRefInTagObj(wordBlock.wordObj.id, definitionId);
  const newTagsToTagList = newAddedOptions.map((tagLabel) =>
    makeTagObj(tagLabel, refData)
  );

  const existedTagDataUpdateInfo = getExistedTagDataUpdateInfo(
    notNewCreatedTags,
    refData
  );

  const deletedTagsUpdateInfo = getShouldDeleteTags(
    tagObjs.filter(
      (tagObj) =>
        selectedOptions.findIndex((tagLabel) => tagLabel === tagObj.tag) === -1
    ),
    refData
  );

  const newTagRefOfTheWord = newTagsToTagList
    .map((tagObj) => tagObj.id)
    .concat(notNewCreatedTagIds);

  const newDefinitions = updateDefRef(
    wordBlock.wordObj.definitions,
    definitionId,
    newTagRefOfTheWord
  );
  const shouldUpdateTags = existedTagDataUpdateInfo.concat(
    deletedTagsUpdateInfo.updatedTagObjsOfShouldDeleteRef
  );

  submitAndExecute(wordBlock, {
    action: updateTags,
    refData,
    newDefinitions,
    newTagsToTagList,
    shouldUpdateTags,
    shouldDeleteTagIds: deletedTagsUpdateInfo.shouldDeleteTagIds,
  });
  wordBlock._toLookUpMode();
};
