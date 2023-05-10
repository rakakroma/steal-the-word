import { renderRuby } from './utils/renderRuby'; //don't delete this until find out its relationship with redux store
import './components/customElements/HooliText';
import './components/customElements/wordListMinimizedBar';
import './components/customElements/HooliFloatingWordList';
import './components/customElements/WordBlock/HooliHighlighter';
import { openAddNewWord } from './components/customElements/HooliText';
import './content.styles.css';
import {
  getGlobalPreferencesFromLocalStorage,
  getInitialDataFromDb,
} from './redux/messageWithBackground';
import { store } from './redux/store';

import { updateBadgeToNoWork } from '../Background/handler/updateBadge';
import { getCertainSetting } from './redux/workingPreferenceSlice';
import {
  checkAndUpdateNewTagList,
  checkAndUpdateNewWordListAndReRender,
} from './redux/wordDataSlice';
import { myLog } from './utils/customLogger';
import './localize/translate';
import { updateSpecialSiteType } from './redux/specialSiteSlice';
import { starterFunction } from './utils/startExec';

const init = async () => {
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

  if (!getCertainSetting(store.getState(), 'activate')) {
    chrome.runtime.sendMessage({ action: updateBadgeToNoWork });
    return;
  }

  await updateSpecialSiteType();
  starterFunction();
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
