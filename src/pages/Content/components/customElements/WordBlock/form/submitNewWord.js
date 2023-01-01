import { nanoid } from 'nanoid';
import { store } from '../../../../redux/store';
import { addOneWord } from '../../../../redux/wordDataSlice';
import { currentURL } from '../../../../utils/currentURL';
import { renderRuby } from '../../../../utils/renderRuby';
import { submitAndExecute } from './submitAndExecute';

export const submitNewWord = (
  wordBlock,
  word,
  annotation,
  context,
  wordNote,
  matchRule,
  stem,
  variants
) => {
  if (
    !wordBlock._formValidation(['word', 'annotation', 'context'], {
      word,
      annotation,
      context,
    })
  )
    return;

  const theNewWord = {
    id: nanoid(),
    word,
    definitionCount: 1,
    definitions: [
      {
        annotation,
        definitionId: '0',
        note: wordNote,
        tags: [],
      },
    ],
    matchRule: matchRule || '',
    stem: stem || '',
    variants: variants || [],
  };

  console.log(theNewWord);

  const theNewContext = {
    context,
    word,
    wordId: theNewWord.id,
    date: Date.now(),
    definitionRef: '0',
    note: '',
    pageTitle: document.title,
    phrase: '',
    url: currentURL(),
  };

  submitAndExecute(
    wordBlock,
    {
      action: 'saveWordAndContext',
      newWord: theNewWord,
      newContext: theNewContext,
    },
    () => {
      // store.dispatch(addOneWord(theNewWord));
      // renderRuby(document.body, true);
      wordBlock.remove();
    },
    (response) => {
      if (response.status === 'existWord') {
        wordBlock._handleUpdateFormStatus(
          'helperText',
          'this word is already exist'
        );
      }
    }
  );
  //   }
};
