import { updateWordCount } from '../../Background/handler/updateBadge';
import { getDisplayingWordList } from '../redux/displayingWordListSlice';
import { store } from '../redux/store';
import { getCertainSetting } from '../redux/workingPreferenceSlice';
import { observer } from './observer';
import { renderRuby } from './renderRuby';
import { setMouseUpToolTip } from './setMouseUpToolTip';

const appendSideListWindow = (foundMatchWord) => {
  if (!foundMatchWord) {
    const minimizedWordList = document.createElement(
      'hooli-wordlist-minimized-bar'
    );
    minimizedWordList.mode = 'autoOpen';
    document.body.appendChild(minimizedWordList);
    return;
  }
  const wordListElement = document.createElement('hooli-floating-word-list');
  document.body.appendChild(wordListElement);
};

export const starterFunction = () => {
  let loadEvent = false;

  const startAfterLoaded = () => {
    loadEvent = true;

    chrome.runtime.sendMessage({
      action: updateWordCount,
      count: '0',
    });

    renderRuby(document.body);

    if (getCertainSetting(store.getState(), 'floatingWindow')) {
      appendSideListWindow(getDisplayingWordList(store.getState()).length > 0);
    }
    if (getCertainSetting(store.getState(), 'mouseTool')) {
      setMouseUpToolTip();
    }

    observer.observe(document.body, {
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
