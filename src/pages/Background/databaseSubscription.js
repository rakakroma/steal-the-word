import { liveQuery } from 'dexie';
import { db } from './database';

const sendMessageToAllTab = (messageObj) =>
  chrome.tabs.query({ discarded: false }, (tabs) => {
    tabs.forEach((tab) => {
      const url = new URL(tab.url);
      const ignoreOrigin = ['chrome://', 'chrome-extension://'];
      if (
        ignoreOrigin.findIndex((origin) => url.origin.startsWith(origin)) > -1
      ) {
        return;
      }
      chrome.tabs.sendMessage(tab.id, messageObj);
    });
  });
const wordListObservable = liveQuery(() => db.wordList.toArray());
const tagListObservable = liveQuery(() => db.tagList.toArray());

wordListObservable.subscribe({
  next: (wordList) => {
    sendMessageToAllTab({ wordList });
  },
  error: (error) => console.error(error),
});

tagListObservable.subscribe({
  next: (tagList) => {
    sendMessageToAllTab({ tagList });
  },
  error: (error) => console.error(error),
});
