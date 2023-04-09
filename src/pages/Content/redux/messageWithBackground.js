import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getContexts,
  getFaviconThisSite,
  getStart,
} from '../../Background/handler/getData';
import { getCurrentSiteImgSrc, getWordContexts } from './wordBlockSlice';

export const getGlobalPreferencesFromLocalStorage = createAsyncThunk(
  'workingPreference/getLocalStorageData',
  async () => {
    const preferences = await chrome.storage.local.get([
      'activate',
      'mouseTool',
      'floatingWindow',
      'textStyle',
      'apiSetting',
    ]);
    return preferences;
  }
);

export const getInitialDataFromDb = createAsyncThunk(
  'wordData/getInitialData',
  async () => {
    const initialData = await chrome.runtime.sendMessage({
      action: getStart,
    });
    return initialData;
  }
);

export const getContextsDataFromDB = createAsyncThunk(
  'wordBlock/getContextData',
  async (wordIdAndForceStatus) => {
    const { wordId } = wordIdAndForceStatus;
    const response = await chrome.runtime.sendMessage({
      action: getContexts,
      wordId,
    });
    return response;
  },
  {
    condition: (wordIdAndForceStatus, { getState, extra }) => {
      const { force, wordId } = wordIdAndForceStatus;
      if (force) return true;
      const currentContexts = getWordContexts(getState());

      if (currentContexts[0]?.wordId === wordId) return false;
    },
  }
);

export const getFaviconThisSiteFromDB = createAsyncThunk(
  'wordBlock/getFaviconThisSiteFromDB',
  async () => {
    const response = await chrome.runtime.sendMessage({
      action: getFaviconThisSite,
    });
    return response;
  },
  {
    condition: (_, { getState, extra }) => {
      const currentImg = getCurrentSiteImgSrc(getState());
      if (currentImg) return false;
    },
  }
);
