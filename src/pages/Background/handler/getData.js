import { getDataInTableFromIndexedDB } from '../../Options/utils/getDataFromDB';
import { db } from '../database';
import { setStopBadge } from './updateBadge';

const getHandlers = new Map();

const getFaviconThisSite = 'getFaviconThisSite';

getHandlers.set(getFaviconThisSite, (request, senderTab, sendResponse) => {
  sendResponse({ iconUrl: senderTab.favIconUrl });
});

const getStart = 'getStart';

getHandlers.set(getStart, async (request, senderTab, sendResponse) => {
  try {
    const tabUrl = senderTab.url;
    const currentDomain = new URL(tabUrl).hostname;
    const domainData = await db.domainAndLink.get({ url: currentDomain });
    const stopInThisPage =
      domainData?.activate === false && domainData?.customRule === true;
    if (stopInThisPage) {
      sendResponse({ domainData });
      setStopBadge(senderTab.id);
      return;
    }

    const [wordList, tagList] = await Promise.all([
      getDataInTableFromIndexedDB('wordList'),
      getDataInTableFromIndexedDB('tagList'),
    ]);

    sendResponse({ wordList, tagList, domainData });
  } catch (err) {
    console.error(err);
  }
});

const getContexts = 'getContexts'; //and icons

getHandlers.set(getContexts, async ({ wordId }, senderTab, sendResponse) => {
  try {
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
    sendResponse({ contexts, domainData });
  } catch (err) {
    console.error(err);
  }
});

export { getFaviconThisSite, getStart, getContexts, getHandlers };
