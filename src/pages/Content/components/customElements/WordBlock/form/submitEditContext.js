import { getContextsDataFromDB } from '../../../../redux/messageWithBackground';
import { store } from '../../../../redux/store';
import { submitAndExecute } from './submitAndExecute';

export const submitEditContext = (wordBlock, context, selectedDefinitionId) => {
  if (
    !wordBlock._formValidation(['context', 'selectedDefinitionId'], {
      context,
      selectedDefinitionId,
    })
  )
    return;
  const contextId = wordBlock._formInputStatus.workingContext;
  submitAndExecute(
    wordBlock,
    {
      action: 'editContext',
      context,
      contextId,
      definitionRef: selectedDefinitionId,
    },
    () => {
      store.dispatch(
        getContextsDataFromDB({ wordId: wordBlock.wordObj.id, force: true })
      );
      wordBlock._toLookUpMode();
    }
  );
};
