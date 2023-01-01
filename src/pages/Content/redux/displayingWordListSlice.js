import { createSelector, createSlice } from '@reduxjs/toolkit';
import { updateWordCount } from '../../Background/updateBadge';
import { currentURL } from '../utils/currentURL';
import { transformElementId } from '../utils/renderRuby';
import { addArrayOfData, deleteArrayOfDataByIds, store } from './store';
import { getWordList } from './wordDataSlice';

//FIXME:store ref here only,
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
    deleteOneDisplayingWordById: (state, action) => {
      const wordId = action.payload;
      const indexOfThatWord = state.findIndex(
        (wordInfo) => wordInfo.id === wordId
      );
      state.splice(indexOfThatWord, 1);
    },
    updateWholeDisplayingWordList: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addOnePageWord,
  updateWholeDisplayingWordList,
  updateOneWordCount,
  deleteOneDisplayingWordById,
} = displayingWordListSlice.actions;

export const getDisplayingWordList = (state) => state.displayingWordList;

export const getWordObjsOfDisplayingWordList = createSelector(
  getDisplayingWordList,
  getWordList,
  (displayingWords, wordList) => {
    return displayingWords.reduce((accu, curr) => {
      const theWordObj = {
        ...wordList.find((wordObj) => wordObj.id === curr.id),
      };
      if (!theWordObj) return accu;
      theWordObj.countInCurrentPage = curr.countInCurrentPage;
      return accu.concat(theWordObj);
    }, []);
  }
);

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
  const displayingWords = getDisplayingWordList(store.getState());
  const listFilteredOutNotExistWords = displayingWords.filter((wordInfo) => {
    return Boolean(document.querySelector(`.h-${wordInfo.id}`));
  });
  if (listFilteredOutNotExistWords.length === displayingWords.length) return;
  store.dispatch(updateWholeDisplayingWordList(listFilteredOutNotExistWords));
};

let temporaryStoreUrl = currentURL(); //maybe it should be in state..

const clearListIfUrlChange = () => {
  const newUrl = currentURL();
  if (newUrl === temporaryStoreUrl) return;
  temporaryStoreUrl = newUrl;
  clearNoLongerExistWordInWordInPageList();
};

export const addOrUpdatePageWordAndGetCount = ({ id, countInCurrentPage }) => {
  // const { countInCurrentPage } = wordObjAndCount;
  let currentCount = countInCurrentPage;
  const currentDisplayingList = getDisplayingWordList(store.getState());
  const indexInCurrentList = currentDisplayingList.findIndex(
    (wordInfo) => wordInfo.id === id
  );

  if (indexInCurrentList === -1) {
    store.dispatch(addOnePageWord({ id, countInCurrentPage }));
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
