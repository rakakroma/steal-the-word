import { createSlice } from '@reduxjs/toolkit';
import { updateWordCount } from '../../Background/updateBadge';
import { currentURL } from '../utils/currentURL';
import { transformElementId } from '../utils/renderRuby';
import { addArrayOfData, deleteArrayOfDataByIds, store } from './store';

export const displayingWordListSlice = createSlice({
  name: `displayingWordList`,
  initialState: [],
  reducers: {
    addOnePageWord: (state, action) => {
      state.push(action.payload);
    },
    updateOneWordCount: (state, action) => {
      const { countInCurrentPage, indexInCurrentList } = action.payload;
      state[indexInCurrentList].countInCurrentPage = countInCurrentPage;
    },
    // addPageWords: addArrayOfData,
    deletePageWords: (state, action) => {
      const wordIdsToExclude = action.payload.map((wordObj) => wordObj.id);
      const filteredList = state.filter(
        (wordObj) => wordIdsToExclude.indexOf(wordObj.id) === -1
      );
      return filteredList;
    },
  },
});

export const { addOnePageWord, deletePageWords, updateOneWordCount } =
  displayingWordListSlice.actions;

export const getDisplayingWordList = (state) => state.displayingWordList;

const handleCountingListUI = () => {
  const wordListEle = document.querySelector('hooli-floating-word-list');
  wordListEle?.requestUpdate();
  const minimizedWordListEle = document.querySelector(
    'hooli-wordlist-minimized-bar'
  );
  if (minimizedWordListEle?.mode === 'autoOpen') {
    const newWordListEle = document.createElement('hooli-floating-word-list');
    document.body.appendChild(newWordListEle);
    minimizedWordListEle.remove();
  } else {
    minimizedWordListEle?.requestUpdate();
  }
};

export const clearNoLongerExistWordInWordInPageList = () => {
  const wordIdOfHooliTextsOnDoc = [];
  document.querySelectorAll('hooli-text').forEach((ele) => {
    const wordId = transformElementId(ele.id, 'wordId');
    if (wordIdOfHooliTextsOnDoc.indexOf(wordId) < 0)
      wordIdOfHooliTextsOnDoc.push(wordId);
  });

  store.dispatch(deletePageWords(wordIdOfHooliTextsOnDoc));
};

let temporaryStoreUrl = currentURL(); //maybe it should be in state..

const clearListIfUrlChange = () => {
  const newUrl = currentURL();
  if (newUrl === temporaryStoreUrl) return;
  temporaryStoreUrl = newUrl;
  clearNoLongerExistWordInWordInPageList();
};

export const addOrUpdatePageWordAndGetCount = (wordObjAndCount) => {
  const { countInCurrentPage } = wordObjAndCount;
  let currentCount = countInCurrentPage;
  const currentDisplayingList = getDisplayingWordList(store.getState());
  const indexInCurrentList = currentDisplayingList.findIndex(
    (wordObj) => wordObj.id === wordObjAndCount.id
  );

  if (indexInCurrentList === -1) {
    store.dispatch(addOnePageWord(wordObjAndCount));
    chrome.runtime.sendMessage({
      action: updateWordCount,
      count: currentDisplayingList.length,
    });
    clearListIfUrlChange();
    handleCountingListUI();
  } else {
    currentCount =
      currentDisplayingList[indexInCurrentList].countInCurrentPage +
      countInCurrentPage;
    store.dispatch(
      updateOneWordCount({
        countInCurrentPage: currentCount,
        indexInCurrentList,
      })
    );
  }
  return currentCount;
};
