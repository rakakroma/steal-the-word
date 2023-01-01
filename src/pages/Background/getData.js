import { getDataInTableFromIndexedDB } from '../Options/utils/getDataFromDB';
import { db } from './database';
import { setStopBadge } from './updateBadge';

const getHandlers = new Map();

const getFaviconThisSite = 'getFaviconThisSite';

getHandlers.set(getFaviconThisSite, (request, senderTab, sendResponse) => {
  sendResponse({ iconUrl: senderTab.favIconUrl });
});

const getStart = 'getStart';

getHandlers.set(getStart, (request, senderTab, sendResponse) => {
  const tabUrl = senderTab.url;
  (async () => {
    const currentDomain = new URL(tabUrl).hostname;
    const domainData = await db.domainAndLink.get({ url: currentDomain });
    const stopInThisPage =
      domainData?.activate === false && domainData?.customRule === true;
    if (stopInThisPage) {
      // sendResponse({ stop: true });
      sendResponse({ domainData });
      setStopBadge(senderTab.id);
      return;
    }
    const wordList = await getDataInTableFromIndexedDB('wordList');
    const tagList = await getDataInTableFromIndexedDB('tagList');
    sendResponse({ wordList, tagList, domainData });
  })();
});

const getContexts = 'getContexts'; //and icons

getHandlers.set(getContexts, ({ wordId }, senderTab, sendResponse) => {
  (async () => {
    const contexts = await db.contextList
      .filter((contextObj) => {
        return contextObj.wordId === wordId;
      })
      .toArray();
    const allDomains = contexts.map((contextObj) => {
      return new URL(contextObj.url).hostname;
    });
    const domainData = await Promise.all(
      allDomains.map(async (domain) => {
        const gotDomainObj = await db.domainAndLink.get({ url: domain });
        return gotDomainObj;
      })
    );
    sendResponse({ contexts, domainData }); //handle error?
  })();
});

export { getFaviconThisSite, getStart, getContexts, getHandlers };
