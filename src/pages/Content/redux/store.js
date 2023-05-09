import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { displayingWordListSlice } from './displayingWordListSlice';
import { wordBlockSlice } from './wordBlockSlice';
import { wordDataSlice } from './wordDataSlice';
import { workingPreferenceSlice } from './workingPreferenceSlice';
import { specialSiteSlice } from './specialSiteSlice';

export const addArrayOfData = (state, action) => {
  state.push([...action.payload]);
};

export const deleteArrayOfDataByIds = (state, action) => {
  const wordIdsToExclude = action.payload.map((wordObj) => wordObj.id);
  const filteredList = state.filter(
    (wordObj) => wordIdsToExclude.indexOf(wordObj.id) === -1
  );
  return filteredList;
};

const rootReducer = {
  wordData: wordDataSlice.reducer,
  workingPreference: workingPreferenceSlice.reducer,
  displayingWordList: displayingWordListSlice.reducer,
  wordBlock: wordBlockSlice.reducer,
  specialSite: specialSiteSlice.reducer,
};

const logger = createLogger();

export const store = configureStore({
  reducer: rootReducer,
  middleware:
    process.env.NODE_ENV === 'production'
      ? (getDefaultMiddleware) => getDefaultMiddleware()
      : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
