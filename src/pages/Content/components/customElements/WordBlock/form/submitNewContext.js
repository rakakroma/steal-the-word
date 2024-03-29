import { addNewContextAndDefinitionForSavedWord } from '../../../../../Background/handler/updateData';
import { getContextsDataFromDB } from '../../../../redux/messageWithBackground';
import { store } from '../../../../redux/store';
import { currentURL } from '../../../../utils/currentURL';
import { submitAndExecute } from './submitAndExecute';
import { getPageTitle } from './getPageTitle';

export const submitNewContext = (
  wordBlock,
  context,
  selectedDefinitionId,
  annotation,
  wordNote
) => {
  if (
    !wordBlock._formValidation(
      ['context'],
      { context, selectedDefinitionId, annotation },
      ['selectedDefinitionIdOrAnnotation']
    )
  )
    return;

  const newContext = {
    context,
    wordId: wordBlock.wordObj.id,
    date: Date.now(),
    definitionRef: null,
    note: '',
    pageTitle: getPageTitle(),
    phrase: '',
    url: currentURL(),
  };

  const isNewDefinition = !selectedDefinitionId && annotation;

  if (isNewDefinition) {
    const newDefinitionId = `${wordBlock.wordObj.definitionCount || 1}`;
    const newDefinition = {
      annotation,
      definitionId: newDefinitionId,
      note: wordNote,
      tags: [],
    };
    newContext.definitionRef = newDefinitionId;

    const request = {
      action: addNewContextAndDefinitionForSavedWord,
      updatedDefinitions: [...wordBlock.wordObj.definitions, newDefinition],
      definitionCount: +newDefinitionId + 1,
      newContext,
    };
    submitAndExecute(wordBlock, request, (response) => {
      store.dispatch(
        getContextsDataFromDB({ wordId: wordBlock.wordObj.id, force: true })
      );
      wordBlock._toLookUpMode();
    });
  } else {
    newContext.definitionRef = selectedDefinitionId;
    const request = {
      action: 'addNewContextForSavedWord',
      newContext,
    };
    submitAndExecute(wordBlock, request, (response) => {
      store.dispatch(
        getContextsDataFromDB({ wordId: wordBlock.wordObj.id, force: true })
      );
      wordBlock._toLookUpMode();
    });
  }
};
