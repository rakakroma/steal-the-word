import { db } from '../database';
import { blobToBase64 } from '../blobToBase64';
import { successMessage } from '../messageTemplate';
import { getCurrentDomain } from '../../../utilsForAll/checkUrl';

const savingDomainData = async (currentUrl, favIconUrl) => {
  const currentDomain = getCurrentDomain(currentUrl);
  /* 
  only save the domain if it got an icon (or when there are preferences)
  do not save local path's html favicon.
 */
  if (favIconUrl && currentDomain !== 'file') {
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
  async ({ newWord, newContext }, senderTab, sendResponse) => {
    try {
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
        await Promise.all([
          db.wordList.add(newWord),
          db.contextList.add(newContext),
        ]);
        return true;
      };
      const saveSuccess = await saveTheWord();
      if (!saveSuccess) return;
      await savingDomainData(newContext.url, senderTab.favIconUrl);
      sendResponse(successMessage(`got ${newWord.word}`));
    } catch (err) {
      console.error(err);
    }
  }
);

//new context
const addNewContextForSavedWord = 'addNewContextForSavedWord';

updateHandlers.set(
  addNewContextForSavedWord,
  async ({ newContext }, senderTab, sendResponse) => {
    try {
      await Promise.all([
        db.contextList.add(newContext),
        savingDomainData(newContext.url, senderTab.favIconUrl),
      ]);

      sendResponse(successMessage(`saved ${newContext.context}`));
    } catch (err) {
      console.error(err);
    }
  }
);

// new context & new definition
const addNewContextAndDefinitionForSavedWord =
  'addNewContextAndDefinitionForSavedWord';

updateHandlers.set(
  addNewContextAndDefinitionForSavedWord,
  async (
    { newContext, updatedDefinitions, definitionCount },
    senderTab,
    sendResponse
  ) => {
    try {
      await Promise.all([
        db.contextList.add(newContext),
        db.wordList.update(
          { id: newContext.wordId },
          { definitions: updatedDefinitions, definitionCount }
        ),
      ]);
      sendResponse(successMessage(`saved and update definition`));
    } catch (err) {
      console.error(err);
    }
  }
);

//change phrase of context
const changePhraseToContext = 'changePhraseToContext';

updateHandlers.set(
  changePhraseToContext,
  async ({ contextId, phrase }, senderTab, sendResponse) => {
    try {
      await db.contextList.update({ id: contextId }, { phrase });
      sendResponse(successMessage());
    } catch (err) {
      console.error(err);
    }
  }
);

const editWord = 'editWord';

updateHandlers.set(
  editWord,
  async ({ wordId, wordObjToUpdate }, senderTab, sendResponse) => {
    try {
      await db.wordList.update({ id: wordId }, wordObjToUpdate);
      sendResponse(successMessage());
    } catch (err) {
      console.error(err);
    }
  }
);

const editContext = 'editContext';

updateHandlers.set(
  editContext,
  async ({ context, contextId, definitionRef }, senderId, sendResponse) => {
    try {
      await db.contextList.update(
        { id: contextId },
        { definitionRef, context }
      );
      sendResponse({
        status: 'success',
      });
    } catch (err) {
      console.error(err);
    }
  }
);

const updateWordRating = 'updateWordRating';

updateHandlers.set(
  updateWordRating,
  async ({ rating, wordId }, senderId, sendResponse) => {
    try {
      await db.wordList.update({ id: wordId }, { stars: rating });
      sendResponse(successMessage());
    } catch (err) {
      console.error(err);
    }
  }
);

const updateTags = 'updateTags';
updateHandlers.set(
  updateTags,
  async (
    {
      refData,
      newDefinitions,
      newTagsToTagList,
      shouldUpdateTags,
      shouldDeleteTagIds,
    },
    senderId,
    sendResponse
  ) => {
    try {
      await Promise.all([
        db.wordList.update(refData.wordId, { definitions: newDefinitions }),
        db.tagList.bulkAdd(newTagsToTagList),
        db.tagList.bulkDelete(shouldDeleteTagIds),
        ...shouldUpdateTags.map(async (tagData) => {
          const { wordDefRefs } = tagData;
          await db.tagList.update(tagData.id, { wordDefRefs });
        }),
      ]);
      sendResponse(successMessage());
    } catch (err) {
      console.error(err);
    }
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
  updateTags,
};
