import { renderRuby } from './utils/renderRuby';
import './components/customElements/HooliText';
import './components/customElements/wordListMinimizedBar';
import './components/customElements/HooliFloatingWordList';
import './components/customElements/WordBlock/HooliHighlighter';
import { openAddNewWord } from './components/customElements/HooliText';

import './content.styles.css';
import { observer } from './utils/observer';
import { setMouseUpToolTip } from './utils/setMouseUpToolTip';
import { store } from './redux/store';
import {
  getGlobalPreferencesFromLocalStorage,
  getInitialDataFromDb,
} from './redux/messageWithBackground';
import { getDisplayingWordList } from './redux/displayingWordListSlice';
import { updateBadgeToNoWork } from '../Background/updateBadge';
import { getCertainSetting } from './redux/workingPreferenceSlice';
import {
  checkAndUpdateNewTagList,
  checkAndUpdateNewWordListAndReRender,
  checkNewWordListAndReRender,
  replaceWholeList,
} from './redux/wordDataSlice';

export const body = document.body;

// export let myList = [];
// export let newList = [];
// export let tagList = [];
// let whiteList = [];

const appendSideListWindow = (foundMatchWord) => {
  if (!foundMatchWord) {
    const minimizedWordList = document.createElement(
      'hooli-wordlist-minimized-bar'
    );
    minimizedWordList.mode = 'autoOpen';
    body.appendChild(minimizedWordList);
    return;
  }
  const wordListElement = document.createElement('hooli-floating-word-list');
  body.appendChild(wordListElement);
};

const init = async () => {
  await store.dispatch(getGlobalPreferencesFromLocalStorage());

  if (!getCertainSetting(store.getState(), 'activate')) {
    chrome.runtime.sendMessage({ action: updateBadgeToNoWork });
    return;
  }
  await store.dispatch(getInitialDataFromDb());

  if (!getCertainSetting(store.getState(), 'activate')) return;

  let loadEvent = false;

  const startAfterLoaded = () => {
    // console.log('page loaded');
    loadEvent = true;
    renderRuby(document.body, true);

    if (getCertainSetting(store.getState(), 'floatingWindow')) {
      appendSideListWindow(getDisplayingWordList(store.getState()).length > 0);
    }
    if (getCertainSetting(store.getState(), 'mouseTool')) {
      setMouseUpToolTip();
    }
    observer.observe(body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.removeEventListener('load', startAfterLoaded);
  };

  window.addEventListener('load', startAfterLoaded);
  setTimeout(() => {
    if (!loadEvent) startAfterLoaded();
  }, 2500);
};
init();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message);
  if (!getCertainSetting(store.getState(), 'activate')) {
    return;
  }
  if (message.action === 'save word') {
    openAddNewWord();
  }

  if (message.tagList) {
    checkAndUpdateNewTagList(store.getState(), message.tagList);
  }
  if (message.wordList) {
    checkAndUpdateNewWordListAndReRender(store.getState(), message.wordList);
  }
  //  if (message.showWordList === true) {
  //   chrome.storage.local.set({ floatingWindow: true }, () => {
  //     if (body.querySelector('#hooriruby-info-div')) {
  //       body.querySelector('#hooriruby-info-div').classList.remove('hide');
  //     }
  //     renderRuby(document.body);
  //     // showWordList()
  //     // console.log('open');
  //     sendResponse({ content: '已顯示wordList' });
  //   });
  //   return true;
  // } else if (message.showWordList === false) {
  //   // floatingWindow = false
  //   chrome.storage.local.set({ floatingWindow: false }, () => {
  //     if (body.querySelector('#hooriruby-info-div')) {
  //       // body.removeChild(infoSection)
  //       body.querySelector('#hooriruby-info-div').classList.add('hide');
  //     }
  //     renderRuby(document.body);
  //     // console.log('close');
  //     sendResponse({ content: '已關閉wordList' });
  //   });
  //   return true;
  // } else {
  //   sendResponse({ content: 'content script 已收到訊息' });
  // }
});
