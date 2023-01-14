import { getShouldUpdateTagsFromDeleteDefs } from '../../../../../../utilsForAll/handleTags';
import { getContextsDataFromDB } from '../../../../redux/messageWithBackground';
import { store } from '../../../../redux/store';
import { myLog } from '../../../../utils/customLogger';
import { submitAndExecute } from './submitAndExecute';

export const submitDelete = (wordBlock, formObj) => {
  const allCheckedName = Object.keys(formObj);

  if (!wordBlock._formValidation(null, { allCheckedName }, ['delete'])) return;

  if (allCheckedName.includes('delete-all')) {
    const { tagShouldBeDelete, tagShouldUpdateItsRefs } =
      getShouldUpdateTagsFromDeleteDefs(
        wordBlock.wordObj.id,
        wordBlock.wordObj.definitions,
        wordBlock.tagList
      );

    const wordId = wordBlock.wordObj.id;
    submitAndExecute(
      wordBlock,
      {
        action: 'deleteThisWordObjAndAllItsContexts',
        wordId,
        contextIdsToDelete: wordBlock.contexts.map((context) => context.id),
        tagShouldBeDelete,
        tagShouldUpdateItsRefs,
      },
      () => {
        wordBlock.remove();
      }
    );
    return;
  }

  const contextIdsToDelete = allCheckedName.map((contextId) => +contextId);
  const allDefinitionRefs = {};
  if (contextIdsToDelete.length > 0) {
    wordBlock.contexts.forEach((contextObj) => {
      allDefinitionRefs[contextObj.definitionRef]
        ? allDefinitionRefs[contextObj.definitionRef]++
        : (allDefinitionRefs[contextObj.definitionRef] = 1);
      if (contextIdsToDelete.includes(contextObj.id)) {
        allDefinitionRefs[contextObj.definitionRef]--;
      }
    });
    const definitionsToDelete = [];
    Object.entries(allDefinitionRefs).forEach((keyPair) => {
      if (keyPair[1] === 0) definitionsToDelete.push(keyPair[0]);
    });
    myLog(contextIdsToDelete, definitionsToDelete);

    const request = { contextIdsToDelete };
    if (definitionsToDelete.length > 0) {
      request.newDefinitions = wordBlock.wordObj.definitions.filter(
        (definition) => {
          return !definitionsToDelete.includes(definition.definitionId);
        }
      );
      request.action = 'deleteContextsAndDefinitions';
      request.wordId = wordBlock.wordObj.id;

      const { tagShouldBeDelete, tagShouldUpdateItsRefs } =
        getShouldUpdateTagsFromDeleteDefs(
          wordBlock.wordObj.id,
          wordBlock.wordObj.definitions.filter((definition) =>
            definitionsToDelete.includes(definition.definitionId)
          ),
          wordBlock.tagList
        );
      request.tagShouldBeDelete = tagShouldBeDelete;
      request.tagShouldUpdateItsRefs = tagShouldUpdateItsRefs;
    } else {
      request.action = 'deleteContexts';
    }
    submitAndExecute(wordBlock, request, () => {
      // store.dispatch(
      //   updateOneWord({
      //     ...wordBlock.wordObj,
      //     definitions: request.newDefinitions,
      //   })
      // );
      store.dispatch(
        getContextsDataFromDB({ wordId: wordBlock.wordObj.id, force: true })
      );
      wordBlock._toLookUpMode();
    });
    return;
  }
};
