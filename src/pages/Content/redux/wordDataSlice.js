import { createSelector, createSlice } from '@reduxjs/toolkit';
import { getMatchList } from '../../../utilsForAll/getMatchTextWithIdRef';
import {
  getInitialDataFromDb,
  updateOneWordInDb,
  updateWordPartInDb,
} from './messageWithBackground';

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
  },
  extraReducers: (builder) => {
    builder.addCase(getInitialDataFromDb.fulfilled, (state, action) => {
      const { wordList, tagList } = action.payload;
      return { wordList, tagList };
    });
  },
});

export const { addOneWord, deleteOneWord, updateOneWord } =
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
