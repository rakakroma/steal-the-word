import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
  getGlobalPreferencesFromLocalStorage,
  getInitialDataFromDb,
} from './messageWithBackground';

const options = ['activate', 'mouseTool', 'floatingWindow'];

export const workingPreferenceSlice = createSlice({
  name: `workingPreference`,
  initialState: {
    activate: { global: false, custom: false },
    mouseTool: { global: false, custom: false },
    floatingWindow: { global: false, custom: false },
    customRule: false,
    textStyle: {
      styleName: 'default',
      styles: { color: 'white', background: 'green' },
    },
    apiSetting: { enabled: false },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getGlobalPreferencesFromLocalStorage.fulfilled,
      (state, action) => {
        const globalPref = action.payload;
        state.textStyle = globalPref.textStyle;
        state.apiSetting = globalPref.apiSetting;
        options.forEach((keyName) => {
          state[keyName].global = globalPref[keyName];
        });
      }
    );
    builder.addCase(getInitialDataFromDb.fulfilled, (state, action) => {
      const customPref = action.payload.domainData;
      if (!customPref) return;
      state.customRule = customPref.customRule;
      options.forEach((keyName) => {
        state[keyName].custom = customPref[keyName];
      });
    });
  },
});

const getAllSetting = (state) => state.workingPreference;
export const getCustomTextStyle = (state) =>
  state.workingPreference.textStyle.styles;

export const getApiSetting = (state) => state.workingPreference.apiSetting;

export const getCertainSetting = createSelector(
  [getAllSetting, (state, optionName) => optionName],
  (allSetting, optionName) => {
    if (!allSetting.activate.global) return false;
    if (!allSetting[optionName].global) return false;
    if (allSetting.customRule && !allSetting[optionName].custom) return false;
    return true;
  }
);
