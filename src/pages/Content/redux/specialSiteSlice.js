import { createSlice } from '@reduxjs/toolkit';
import { store } from './store';

export const specialSiteSlice = createSlice({
  name: 'speacialSite',
  initialState: {
    specialSiteType: '',
  },
  reducers: {
    updateOneProp: (state, action) => {
      const { keyName, newValue } = action.payload;
      state[keyName] = newValue;
    },
  },
});

export const { updateOneProp } = specialSiteSlice.actions;

export const getSpecialSiteType = (state) => state.specialSite.specialSiteType;

export const updateSpecialSiteType = () => {
  const isYoutube = document.location.hostname.includes('youtube');
  const isPdf2htmlEX = Boolean(
    document.head.querySelector("meta[content='pdf2htmlEX']")
  );
  const targetType = isYoutube ? 'youtube' : isPdf2htmlEX ? 'pdf2htmlEX' : '';
  store.dispatch(
    updateOneProp({ keyName: 'specialSiteType', newValue: targetType })
  );
};
