import { createSlice } from '@reduxjs/toolkit';
import {
  getContextsDataFromDB,
  getFaviconThisSiteFromDB,
} from './messageWithBackground';

export const wordBlockSlice = createSlice({
  name: 'wordBlock',
  initialState: {
    currentWordContexts: [],
    currentWordImgSrcs: [],
    currentSiteImgSrc: null,
  },
  reducers: {
    // deleteCurrentWordData: (state, action) => {
    //   return {
    //     currentWordContexts: [],
    //     currentWordImgSrcs: [],
    //     currentSiteImgSrc: state.currentSiteImgSrc,
    //   };
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getContextsDataFromDB.fulfilled, (state, action) => {
      const { contexts, domainData } = action.payload;

      state.currentWordContexts = contexts;
      state.currentWordImgSrcs = domainData;
    });
    builder.addCase(getFaviconThisSiteFromDB.fulfilled, (state, action) => {
      const { iconUrl } = action.payload;
      if (iconUrl) {
        state.currentSiteImgSrc = iconUrl;
      }
    });
  },
});

export const { deleteCurrentWordData } = wordBlockSlice.actions;

const getWordBlockData = (state) => state.wordBlock;
export const getWordContexts = (state) =>
  getWordBlockData(state).currentWordContexts;
export const getWordImgSrcs = (state) =>
  getWordBlockData(state).currentWordImgSrcs;
export const getCurrentSiteImgSrc = (state) =>
  getWordBlockData(state).currentSiteImgSrc;
