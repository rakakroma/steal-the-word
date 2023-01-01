import { addNewContextAndDefinitionForSavedWord } from '../../../../../Background/updateData';
import { getContextsDataFromDB } from '../../../../redux/messageWithBackground';
import { store } from '../../../../redux/store';
import { currentURL } from '../../../../utils/currentURL';

export const submitNewContext = (
  wordBlock,
  context,
  selectedDefinitionId,
  annotation,
  wordNote,
  submitAndExecute
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
    pageTitle: document.title,
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
    submitAndExecute(request, (response) => {
      wordBlock._toLookUpMode();
    });
  } else {
    newContext.definitionRef = selectedDefinitionId;
    const request = {
      action: 'addNewContextForSavedWord',
      newContext,
    };
    submitAndExecute(request, (response) => {
      store.dispatch(
        getContextsDataFromDB({ wordId: wordBlock.wordObj.id, force: true })
      );
      wordBlock._toLookUpMode();
    });
  }
};
