import { getDataInTableFromIndexedDB } from '../Options/utils/getDataFromDB';
// import { getDomain } from "../Options/utils/transformData";
import { db } from './database';
import { getMatchList } from '../../utilsForAll/getMatchTextWithIdRef';

const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

chrome.action.setBadgeBackgroundColor({ color: '#4f4f4f' });

chrome.contextMenus.create({
  title: 'Save "%s" to HolliRuby',
  contexts: ['selection'],
  id: 'myContextMenuId',
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'save word' });
});

const saveDomainData = async (currentDomain, favIconUrl) => {
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
        dynamicRendering: true,
        icon: base64Icon,
        showTabWords: null,
        tags: null,
        lang: null,
      };
      db.domainAndLink.add(newDomain);
      console.log(newDomain);
    } else if (!domainInDB.icon) {
      console.log(domainInDB);
      db.domainAndLink.update({ url: currentDomain }, { icon: blob });
      console.log('update icon');
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request, sender.tab.id);
  if (request.action === 'getFaviconThisSite') {
    sendResponse({ iconUrl: sender.tab.favIconUrl });
  }
  if (request.action === 'notWorking') {
    chrome.action.setBadgeText({ text: 'STOP', tabId: sender.tab.id });
  }
  if (request.action === 'updateWordCount' && request.count) {
    chrome.action.setBadgeText({
      text: `${request.count}`,
      tabId: sender.tab.id,
    });
  }
  if (request.action === 'getStart' && request.url) {
    (async () => {
      console.log('get start');
      const currentDomain = new URL(request.url).hostname;
      const domainData = await db.domainAndLink.get({ url: currentDomain });
      if (domainData?.activate === false) {
        sendResponse({ domainData });
        return;
      }
      const wordList = await getDataInTableFromIndexedDB('wordList');

      const newList = getMatchList(wordList);
      if (!domainData) {
        sendResponse({ wordList, newList });
        return;
      }
      sendResponse({ wordList, newList, domainData });
    })();
  }
  if (request.action === 'getImgDataFromUrls' && request.domains) {
    (async () => {
      const domainData = await Promise.all(
        request.domains.map(async (domain) => {
          const gotDomainObj = await db.domainAndLink.get({ url: domain });
          return gotDomainObj;
        })
      );
      sendResponse({ domainData });
    })();
  }
  if (request.wordId && request.action === 'getContexts') {
    (async () => {
      const contexts = await db.contextList
        .filter((contextObj) => {
          return contextObj.wordId === request.wordId;
        })
        .toArray();
      sendResponse({ contexts });
    })();
  }

  if (
    request.action === 'saveWordAndContext' &&
    request.newWord &&
    request.newContext
  ) {
    const theWordObj = { ...request.newWord };
    const theContextObj = { ...request.newContext };
    const currentDomain = new URL(theContextObj.url).hostname;

    const saveTheWord = async () => {
      const sameWordInDB = await db.wordList.get({ word: theWordObj.word });

      if (sameWordInDB) {
        db.contextList.add(theContextObj);
        sendResponse({
          status: 'existWord',
          message: `you already have ${request.newWord.word}`,
        });
        return false;
      }

      db.wordList.add(theWordObj);
      db.contextList.add(theContextObj);
      return true;
    };
    (async () => {
      const saveSuccess = await saveTheWord();
      if (!saveSuccess) return;
      await saveDomainData(currentDomain, sender.tab.favIconUrl);
      sendResponse({
        status: 'success',
        message: `got ${request.newWord.word}`,
      });
    })();
  }
  if (request.action === 'addNewContextForSavedWord' && request.newContext) {
    const theContextObj = { ...request.newContext };
    const currentDomain = new URL(theContextObj.url).hostname;
    (async () => {
      await db.contextList.add(theContextObj);
      await saveDomainData(currentDomain, sender.tab.favIconUrl);
      sendResponse({
        status: 'success',
        message: `saved ${theContextObj.context}`,
      });
    })();
  }
  if (
    request.action === 'addNewContextAndDefinitionForSavedWord' &&
    request.newContext &&
    request.updatedDefinitions &&
    request.definitionCount
  ) {
    const { newContext, updatedDefinitions, definitionCount } = request;
    (async () => {
      await db.contextList.add(newContext);
      await db.wordList.update(
        { id: newContext.wordId },
        { definitions: updatedDefinitions, definitionCount }
      );
      sendResponse({
        status: 'success',
        message: `saved and update definition`,
      });
    })();
  }

  if (
    request.action === 'deleteThisWordObjAndAllItsContexts' &&
    request.wordId &&
    request.contextIdsToDelete
  ) {
    const { wordId, contextIdsToDelete } = request;
    (async () => {
      await db.wordList.delete(wordId);
      await db.contextList.bulkDelete(contextIdsToDelete);
      sendResponse({
        status: 'success',
        message: `delete ${wordId}, contexts ${contextIdsToDelete.join(', ')}`,
      });
    })();
  }
  if (request.action === 'deleteContexts' && request.contextIdsToDelete) {
    const { contextIdsToDelete } = request;
    if (contextIdsToDelete.length === 0) return; //error
    (async () => {
      // const contextDataShouldBeDeleted = db.contextList.bulkGet(contextIdsToDelete)
      await db.contextList.bulkDelete(contextIdsToDelete);
      sendResponse({
        status: 'success',
        message: `delete contexts ${contextIdsToDelete.join(', ')}`,
      });
    })();
  }
  if (
    request.action === 'deleteContextsAndDefinitions' &&
    request.newDefinitions &&
    request.wordId &&
    request.contextIdsToDelete
  ) {
    const { newDefinitions, contextIdsToDelete, wordId } = request;
    if (newDefinitions.length === 0) return; //error
    if (contextIdsToDelete.length === 0) return; //error
    (async () => {
      await db.contextList.bulkDelete(contextIdsToDelete);
      await db.wordList.update({ id: wordId }, { definitions: newDefinitions });
      sendResponse({
        status: 'success',
        message: `delete contexts ${contextIdsToDelete.join(
          ', '
        )} and definition`,
      });
    })();
  }
  if (
    request.action === 'changePhraseToContext' &&
    request.contextId &&
    request.phrase
  ) {
    const { contextId, phrase } = request;
    (async () => {
      await db.contextList.update({ id: contextId }, { phrase });
      sendResponse({
        status: 'success',
      });
    })();
  }
  if (request.action === 'editWord') {
    const { wordId, word, definitions, stem, variants, matchRule } = request;
    const wordObjToUpdate = { word, definitions };
    if (stem) wordObjToUpdate.stem = stem;
    if (variants) wordObjToUpdate.variants = variants;
    if (matchRule) wordObjToUpdate.matchRule = matchRule;
    (async () => {
      await db.wordList.update({ id: wordId }, wordObjToUpdate);
      sendResponse({
        status: 'success',
      });
    })();
  }
  if (request.action === 'editContext') {
    const { context, contextId, definitionRef } = request;
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
  return true;
});
