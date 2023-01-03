import {
  checkSameRef,
  getDeletedTagsUpdateInfo,
  getExistedTagDataUpdateInfo,
  getRefData,
  makeTagObj,
  tagArrayToKeyObjs,
  updateDefRef,
} from '../../../../../../utilsForAll/handleTags';
import { updateTags } from '../../../../../Background/updateData';
import { submitAndExecute } from './submitAndExecute';

export const submitTags = (
  wordBlock,
  tagList,
  tagObjs,
  selectedOptions,
  newAddedOptions,
  definitionId
) => {
  const notNewCreatedTags = tagArrayToKeyObjs(
    'tag',
    selectedOptions.filter((tagLabel) => !newAddedOptions.includes(tagLabel)),
    tagList
  );
  const notNewCreatedTagIds = notNewCreatedTags.map((tagObj) => tagObj.id);
  const refData = getRefData(wordBlock.wordObj.id, definitionId);
  const newTagsToTagList = newAddedOptions.map((tagLabel) => {
    return makeTagObj(tagLabel, refData);
  });

  const existedTagDataUpdateInfo = getExistedTagDataUpdateInfo(
    notNewCreatedTags,
    refData
  );

  const deletedTagsUpdateInfo = getDeletedTagsUpdateInfo(
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
  const shouldUpdateTags = existedTagDataUpdateInfo.shouldAddRef.concat(
    deletedTagsUpdateInfo.shouldDeleteRef
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
