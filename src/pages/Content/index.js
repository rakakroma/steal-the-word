import {
  renderRuby,
  renderMultipleRuby,
  wordInPageList,
} from './utils/renderRuby';
import './components/customElements/HolliText';
import './components/customElements/wordListMinimizedBar';
import { openAddNewWord } from './components/customElements/HolliText';
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  inline,
} from '@floating-ui/dom';

console.log('Content script works!');

const body = document.body;
const currentURL = window.location.hash
  ? window.location.href.slice(
      0,
      window.location.href.lastIndexOf(window.location.hash)
    )
  : window.location.href;

const updatePosition = (refEle, floatEle) => {
  computePosition(refEle, floatEle, {
    placement: 'top-end',
    middleware: [offset(10), flip(), shift({ padding: 3 })],
  }).then(({ x, y }) => {
    Object.assign(floatEle.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};
const init = () => {
  body.addEventListener('mouseup', (e) => {
    const addingToolOnBody = document.querySelector('hooli-adding-tool');
    if (addingToolOnBody) {
      if (e.composedPath().find((e) => e.tagName === 'HOOLI-ADDING-TOOL')) {
        return;
      }
      addingToolOnBody.remove();
    }
    if (e.button === 2) return; //ignore right click
    setTimeout(() => {
      const selection = document.getSelection();
      const selectedText = selection.toString().trim();
      if (!selectedText || selectedText.length > 60) return;
      if (selection.anchorNode?.children) return; //ignore web component e.g. input, textarea, and my lit element
      const addingTool = document.createElement('hooli-adding-tool');
      updatePosition(window.getSelection().getRangeAt(0), addingTool);
      body.appendChild(addingTool);
    }, 5);
  });
};

let visible = true;
let newAddedNodes = [];
let newRemovedNodes = [];
let runningIntervalId = null;

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    visible = true;
  } else {
    visible = false;
  }
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((addedNode) => {
        newAddedNodes.push(addedNode);
      });
    }

    if (mutation.removedNodes.length > 0) {
      mutation.removedNodes.forEach((removedNode) => {
        newRemovedNodes.push(removedNode);
      });
    }
  });

  if (visible) {
    if (runningIntervalId) return;
    const checkIfNewNodes = setInterval(() => {
      if (!visible || newAddedNodes.length === 0) {
        clearInterval(checkIfNewNodes);
        runningIntervalId = null;
        return;
      }
      const nodesToHandle = newAddedNodes.filter((addedNode) => {
        if (newRemovedNodes.indexOf(addedNode) > -1) {
          return false;
        }
        if (addedNode.tagName?.includes('HOOLI')) return false;
        return true;
      });
      console.log(nodesToHandle);
      if (nodesToHandle.length === 0) {
        clearInterval(checkIfNewNodes);
        runningIntervalId = null;
        newAddedNodes = [];
        newRemovedNodes = [];
        return;
      }
      renderMultipleRuby(nodesToHandle, myList);

      newAddedNodes = [];
      newRemovedNodes = [];
    }, 3000);
    runningIntervalId = checkIfNewNodes;
  }
});

export let myList = [];
export let newList = [];
let whiteList = [];

export const restoreHolliText = (wordId) => {
  let targetEles;
  if (!wordId) {
    targetEles = document.querySelectorAll('holli-text');
  } else {
    targetEles = document.querySelectorAll(`.h-${wordId}`);
  }
  targetEles.forEach((ele) => {
    const fragment = new DocumentFragment();
    fragment.textContent = ele.textContent;
    ele.replaceWith(fragment);
  });
  myList = myList.filter((wordObj) => wordObj.id !== wordId);
};

function startFunction() {
  //test i18n
  chrome.i18n.getAcceptLanguages((result) =>
    console.log('accept lang:', result)
  );
  console.log('ui lang:', chrome.i18n.getUILanguage());

  //
  chrome.storage.local.get(
    ['activate', 'mouseTool', 'floatingWindow'],
    function (allSiteSettings) {
      console.log('all site setting');
      console.log(allSiteSettings);
      if (allSiteSettings.activate === false) {
        chrome.runtime.sendMessage({ action: 'notWorking' });
        return;
      }
      chrome.runtime.sendMessage(
        { action: 'getStart', url: currentURL },
        (res) => {
          console.log('custom setting');
          console.log(res);
          const { wordList, domainData } = res;
          if (domainData?.activate === false) {
            chrome.runtime.sendMessage({ action: 'notWorking' });
            console.log('stop');
            return;
          }

          if (wordList?.length > 0) {
            myList = res.wordList;
            //
            newList = res.newList;
            //
            let loadEvent = false;
            const startAfterLoaded = () => {
              console.log('page loaded');
              loadEvent = true;
              renderRuby(document.body, true);
              if (
                allSiteSettings.floatingWindow &&
                domainData?.floatingWindow !== false
              ) {
                if (wordInPageList.length === 0) {
                  const minimizedWordList = document.createElement(
                    'hooli-wordlist-minimized-bar'
                  );
                  minimizedWordList.mode = 'autoOpen';
                  body.appendChild(minimizedWordList);
                } else {
                  const wordListElement = document.createElement(
                    'hooli-floating-word-list'
                  );
                  body.appendChild(wordListElement);
                }
              }
              observer.observe(body, {
                childList: true,
                subtree: true,
                characterData: true,
              });
              window.removeEventListener('load', startAfterLoaded);
            };
            window.addEventListener('load', startAfterLoaded());
            setTimeout(() => {
              if (!loadEvent) startAfterLoaded();
            }, 2500);
          } else {
            console.log('nothing');
          }
          init();
        }
      );
    }
  );
}
startFunction();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  console.log(sender);
  let thisDomain;
  if (message.action === 'save word') {
    openAddNewWord();
  }
  if (message.tabInfo) {
    thisDomain = message.tabInfo.url.split('//')[1].split('/')[0];
  }
  if (message.action === 'deleteWord') {
  }
  if (message.dynamicRendering) {
    whiteList.push(thisDomain);
    console.log(whiteList);
    chrome.storage.local.set({ whiteDomainList: whiteList }, () => {
      sendResponse({ content: `已加入white list : ${whiteList}` });
      observer.observe(body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
    return true;
  } else if (message.dynamicRendering === false) {
    whiteList = whiteList.filter((domainName) => domainName !== thisDomain);
    console.log(whiteList);
    chrome.storage.local.set({ whiteDomainList: whiteList }, () => {
      observer.disconnect();
      sendResponse({ content: `已移出white list : ${whiteList}` });
    });
    return true;
  } else if (message.showWordList === true) {
    chrome.storage.local.set({ floatingWindow: true }, () => {
      if (body.querySelector('#hooriruby-info-div')) {
        body.querySelector('#hooriruby-info-div').classList.remove('hide');
      }
      renderRuby(document.body);
      // showWordList()
      console.log('open');
      sendResponse({ content: '已顯示wordList' });
    });
    return true;
  } else if (message.showWordList === false) {
    // floatingWindow = false
    chrome.storage.local.set({ floatingWindow: false }, () => {
      if (body.querySelector('#hooriruby-info-div')) {
        // body.removeChild(infoSection)
        body.querySelector('#hooriruby-info-div').classList.add('hide');
      }
      renderRuby(document.body);
      console.log('close');
      sendResponse({ content: '已關閉wordList' });
    });
    return true;
  } else {
    sendResponse({ content: 'content script 已收到訊息' });
  }
});
