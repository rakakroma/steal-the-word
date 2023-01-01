import { getContextsDataFromDB } from '../../../../redux/messageWithBackground';
import { store } from '../../../../redux/store';
import { submitAndExecute } from './submitAndExecute';

export const submitNewHighlight = (wordBlock) => {
  const { phraseSelection, workingContext } = wordBlock._formInputStatus;

  submitAndExecute(
    wordBlock,
    {
      action: 'changePhraseToContext',
      phrase: phraseSelection,
      contextId: workingContext,
    },
    () => {
      store.dispatch(
        getContextsDataFromDB({ wordId: wordBlock.wordObj.id, force: true })
      );
      wordBlock._toLookUpMode();
    }
  );
};
