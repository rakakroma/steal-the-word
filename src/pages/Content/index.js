import { renderRuby } from './utils/renderRuby';
import './components/customElements/HooliText';
import './components/customElements/wordListMinimizedBar';
import './components/customElements/HooliFloatingWordList';
import './components/customElements/WordBlock/HooliHighlighter';
import { openAddNewWord } from './components/customElements/HooliText';

import './content.styles.css';
import { observer, youtubeCaptionObserver } from './utils/observer';
import { setMouseUpToolTip } from './utils/setMouseUpToolTip';
import { store } from './redux/store';
import {
  getGlobalPreferencesFromLocalStorage,
  getInitialDataFromDb,
} from './redux/messageWithBackground';
import { getDisplayingWordList } from './redux/displayingWordListSlice';
import { updateBadgeToNoWork } from '../Background/handler/updateBadge';
import { getCertainSetting } from './redux/workingPreferenceSlice';
import {
  checkAndUpdateNewTagList,
  checkAndUpdateNewWordListAndReRender,
} from './redux/wordDataSlice';
import { myLog } from './utils/customLogger';
import './localize/translate';
import { currentURL } from './utils/currentURL';
import { updateSpecialSiteType } from './redux/specialSiteSlice';

export const body = document.body;

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
  /* TODO: maybe the webNavigation API works and is better, but the api seems like contain iframe, which this have not yet deal with   */
  const localData = await store.dispatch(
    getGlobalPreferencesFromLocalStorage()
  );

  myLog(localData);

  //check localStorage pref
  if (!getCertainSetting(store.getState(), 'activate')) {
    chrome.runtime.sendMessage({ action: updateBadgeToNoWork });
    return;
  }

  await store.dispatch(getInitialDataFromDb());
  if (!getCertainSetting(store.getState(), 'activate')) return;
  await updateSpecialSiteType();

  let loadEvent = false;

  const startAfterLoaded = () => {
    loadEvent = true;
    renderRuby(document.body);

    if (getCertainSetting(store.getState(), 'floatingWindow')) {
      appendSideListWindow(getDisplayingWordList(store.getState()).length > 0);
    }
    if (getCertainSetting(store.getState(), 'mouseTool')) {
      setMouseUpToolTip();
    }
    // if (isYoutube) {
    //   const captionContainer = document.querySelector(
    //     '.ytp-caption-window-container'
    //   );
    //   setTimeout(() => {
    //     if (captionContainer) {
    //       youtubeCaptionObserver.observe(captionContainer, {
    //         childList: true,
    //         subtree: true,
    //         characterData: true,
    //       });
    //     }
    //   }, 10000);
    // } else {

    observer.observe(body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    // }
    window.removeEventListener('load', startAfterLoaded);
  };

  window.addEventListener('load', startAfterLoaded);
  setTimeout(() => {
    if (!loadEvent) startAfterLoaded();
  }, 2500);
};
init();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
});
