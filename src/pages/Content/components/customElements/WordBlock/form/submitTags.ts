import {
  getShouldDeleteTags,
  getExistingTagDataUpdateInfo,
  createWordRefInTagObj,
  makeTagObj,
  getTagFullDataArray,
  updateTagsOfTargetDefinition,
} from '../../../../../../utilsForAll/handleTags';
import { Tag, Definition, TagList } from '../../../../../Background/dataSchema';
import { updateTags } from '../../../../../Background/handler/updateData';
import { submitAndExecute } from './submitAndExecute';

export const submitTags = (
  wordBlock: any, //LitElement
  tagList: TagList,
  tagObjs: TagList,
  selectedOptions: Tag['tag'][],
  newAddedOptions: Tag['tag'][],
  definitionId: Definition['definitionId']
) => {
  const existingTagsFromSelectedOptions = selectedOptions.filter(
    (tagLabel) => !newAddedOptions.includes(tagLabel)
  );

  const notNewCreatedTags = getTagFullDataArray(
    'tag',
    existingTagsFromSelectedOptions,
    tagList
  );

  const notNewCreatedTagIds = notNewCreatedTags.map((tagObj) => tagObj.id);

  const refData = createWordRefInTagObj(wordBlock.wordObj.id, definitionId);
  const newTagsToTagList = newAddedOptions.map((tagLabel) =>
    makeTagObj(tagLabel, refData)
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

  const newDefinitions = updateTagsOfTargetDefinition(
    wordBlock.wordObj.definitions,
    definitionId,
    newTagRefOfTheWord
  );

  const existedTagDataUpdateInfo = getExistingTagDataUpdateInfo(
    notNewCreatedTags,
    refData
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
