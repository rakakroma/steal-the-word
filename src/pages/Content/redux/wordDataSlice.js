import { createSelector, createSlice } from '@reduxjs/toolkit';
import { getMatchList } from '../../../utilsForAll/getMatchTextWithIdRef';
import { renderRuby } from '../utils/renderRuby';
import { restoreAndDeleteHooliText } from '../utils/restoreHolliText';
import {
  clearNoLongerExistWordInWordInPageList,
  deleteOneDisplayingWordById,
  deletePageWordsByIds,
  getDisplayingWordList,
} from './displayingWordListSlice';
import {
  getInitialDataFromDb,
  updateOneWordInDb,
  updateWordPartInDb,
} from './messageWithBackground';
import { store } from './store';

export const wordDataSlice = createSlice({
  name: 'wordData',
  initialState: {
    wordList: [],
    tagList: [],
  },
  reducers: {
    addOneWord: (state, action) => {
      state.wordList.push(action.payload);
      //todo: handle match ref list
    },
    deleteOneWord: (state, action) => {
      const wordId = action.payload;
      const index = state.wordList.indexOf((wordObj) => wordObj.id === wordId);
      if (index >= 0) {
        state.wordList.splice(index, 1);
      }
    },
    updateOneWord: (state, action) => {
      const newWordObj = action.payload;
      const wordToUpgradeIndex = state.wordList.findIndex(
        (wordObj) => wordObj.id === newWordObj.id
      );
      state.wordList[wordToUpgradeIndex] = { ...newWordObj };
    },
    replaceWholeList: (state, action) => {
      const { wordList, tagList } = action.payload;
      const newWordList = wordList || [...state.wordList];
      const newTagList = tagList || [...state.tagList];
      return { wordList: newWordList, tagList: newTagList };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInitialDataFromDb.fulfilled, (state, action) => {
      const { wordList, tagList } = action.payload;
      return { wordList, tagList };
    });
  },
});

export const { addOneWord, deleteOneWord, updateOneWord, replaceWholeList } =
  wordDataSlice.actions;

const getWordData = (state) => state.wordData;
export const getWordList = (state) => getWordData(state).wordList;
export const getMatchRefList = createSelector(getWordList, (wordList) =>
  getMatchList(wordList)
);
export const getTagList = (state) => getWordData(state).tagList;

export const findDuplicateWord = (string, storeState) => {
  return (
    getMatchRefList(storeState).findIndex((info) => info.matchText === string) >
    -1
  );
};

export const getWordById = (state, wordId) =>
  getWordList(state).find((wordObj) => wordObj.id === wordId);

export const checkAndUpdateNewTagList = (state, newTagList) => {
  const tagList = getTagList(state);
  if (tagList.length === newTagList) {
    return;
  }
  store.dispatch(replaceWholeList({ tagList: newTagList }));
};

export const checkAndUpdateNewWordListAndReRender = (state, newWordList) => {
  //for performance concern, it is not updating data if the length did not change (add or delete),
  //because background would send the non-update data sometimes.

  const wordList = getWordList(state);
  if (wordList.length < newWordList.length) {
    store.dispatch(replaceWholeList({ wordList: newWordList }));
    renderRuby(document.body, true);
  }
  if (wordList.length > newWordList.length) {
    store.dispatch(replaceWholeList({ wordList: newWordList }));
    const currentDisplayingList = getDisplayingWordList(state);
    //only one word change when listening to new list
    const deletedDisplayingWordId = currentDisplayingList.find((wordInfo) => {
      return (
        newWordList.findIndex((wordObj) => wordObj.id === wordInfo.id) === -1
      );
    })?.id;

    if (deletedDisplayingWordId) {
      restoreAndDeleteHooliText(deletedDisplayingWordId);
      store.dispatch(deleteOneDisplayingWordById(deletedDisplayingWordId));
    }
  }
};
