import { db } from './database';
import { blobToBase64 } from './blobToBase64';
import { successMessage } from './messageTemplate';

const savingDomainData = async (currentDomain, favIconUrl) => {
  if (favIconUrl) {
    let res;
    let blob;
    const domainInDB = await db.domainAndLink.get({ url: currentDomain }); //and the custom url
    if (!domainInDB) {
      res = await fetch(favIconUrl);
      blob = await res.blob();
      const base64Icon = await blobToBase64(blob);
      const newDomain = {
        url: currentDomain,
        activate: null,
        floatingWindow: null,
        mouseTool: null,
        icon: base64Icon,
        tags: null,
        lang: null,
      };
      db.domainAndLink.add(newDomain);
    } else if (!domainInDB.icon) {
      db.domainAndLink.update({ url: currentDomain }, { icon: blob });
    }
  }
};

const updateHandlers = new Map();

//  new word & its context
const saveWordAndContext = 'saveWordAndContext';

updateHandlers.set(
  saveWordAndContext,
  ({ newWord, newContext }, senderTab, sendResponse) => {
    const currentDomain = new URL(newContext.url).hostname;

    const saveTheWord = async () => {
      const sameWordInDB = await db.wordList.get({ word: newWord.word });

      if (sameWordInDB) {
        db.contextList.add(newContext);
        sendResponse({
          status: 'existWord',
          message: `you already have ${newWord.word}`,
        });
        return false;
      }

      db.wordList.add(newWord);
      db.contextList.add(newContext);
      return true;
    };
    (async () => {
      const saveSuccess = await saveTheWord();
      if (!saveSuccess) return;
      await savingDomainData(currentDomain, senderTab.favIconUrl);
      sendResponse(successMessage(`got ${newWord.word}`));
    })();
  }
);

//new context
const addNewContextForSavedWord = 'addNewContextForSavedWord';

updateHandlers.set(
  addNewContextForSavedWord,
  ({ newContext }, senderTab, sendResponse) => {
    const currentDomain = new URL(newContext.url).hostname;

    (async () => {
      await db.contextList.add(newContext);
      await savingDomainData(currentDomain, senderTab.favIconUrl);
      sendResponse(successMessage(`saved ${newContext.context}`));
    })();
  }
);

// new context & new definition
const addNewContextAndDefinitionForSavedWord =
  'addNewContextAndDefinitionForSavedWord';

updateHandlers.set(
  addNewContextAndDefinitionForSavedWord,
  (
    { newContext, updatedDefinitions, definitionCount },
    senderTab,
    sendResponse
  ) => {
    (async () => {
      await db.contextList.add(newContext);
      await db.wordList.update(
        { id: newContext.wordId },
        { definitions: updatedDefinitions, definitionCount }
      );
      sendResponse(successMessage(`saved and update definition`));
    })();
  }
);

//change phrase of context
const changePhraseToContext = 'changePhraseToContext';

updateHandlers.set(
  changePhraseToContext,
  ({ contextId, phrase }, senderTab, sendResponse) => {
    (async () => {
      await db.contextList.update({ id: contextId }, { phrase });
      sendResponse(successMessage());
    })();
  }
);

const editWord = 'editWord';

updateHandlers.set(
  editWord,
  ({ wordId, wordObjToUpdate }, senderTab, sendResponse) => {
    (async () => {
      await db.wordList.update({ id: wordId }, wordObjToUpdate);
      sendResponse(successMessage());
    })();
  }
);

const editContext = 'editContext';

updateHandlers.set(
  editContext,
  ({ context, contextId, definitionRef }, senderId, sendResponse) => {
    (async () => {
      await db.contextList.update(
        { id: contextId },
        { definitionRef, context }
      );
      sendResponse({
        status: 'success',
      });
    })();
  }
);

const updateWordRating = 'updateWordRating';

updateHandlers.set(
  updateWordRating,
  ({ rating, wordId }, senderId, sendResponse) => {
    (async () => {
      await db.wordList.update({ id: wordId }, { stars: rating });
      sendResponse(successMessage());
    })();
  }
);

export {
  updateHandlers,
  saveWordAndContext,
  addNewContextForSavedWord,
  addNewContextAndDefinitionForSavedWord,
  changePhraseToContext,
  editWord,
  editContext,
  updateWordRating,
};
