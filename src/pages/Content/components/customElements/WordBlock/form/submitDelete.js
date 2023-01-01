import { getContextsDataFromDB } from '../../../../redux/messageWithBackground';
import { store } from '../../../../redux/store';
import { updateOneWord } from '../../../../redux/wordDataSlice';
import { restoreAndDeleteHooliText } from '../../../../utils/restoreHolliText';
import { submitAndExecute } from './submitAndExecute';

export const submitDelete = (wordBlock, formObj) => {
  const allCheckedName = Object.keys(formObj);

  if (!wordBlock._formValidation(null, { allCheckedName }, ['delete'])) return;

  if (allCheckedName.includes('delete-all')) {
    const wordId = wordBlock.wordObj.id;
    submitAndExecute(
      {
        action: 'deleteThisWordObjAndAllItsContexts',
        wordId,
        contextIdsToDelete: wordBlock.contexts.map((context) => context.id),
      },
      () => {
        wordBlock.remove();
        // restoreAndDeleteHooliText(wordId);
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
    console.log(contextIdsToDelete, definitionsToDelete);

    const request = { contextIdsToDelete };
    if (definitionsToDelete.length > 0) {
      request.newDefinitions = wordBlock.wordObj.definitions.filter(
        (definition) => {
          return !definitionsToDelete.includes(definition.definitionId);
        }
      );
      request.action = 'deleteContextsAndDefinitions';
      request.wordId = wordBlock.wordObj.id;
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
