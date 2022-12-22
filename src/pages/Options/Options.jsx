import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import './Options.css';
import { darkThemeStyle, lightThemeStyle, themeStyle } from './theme.style';
import { db } from '../Background/database';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import PersistentDrawerRight from './components/WordCollection/WordInfoDrawer/WordInfoDrawer';
import { KBarCommandPalette } from './KBarCommandPalette';

export const ContextListContext = createContext([]);
export const DomainAndLinkListContext = createContext([]);
export const WordListContext = createContext([]);
export const WordInfoDrawerContext = createContext({});
export const ColorModeContext = createContext({});
export const TagListContext = createContext({});

const Options = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = useMemo(
    () => createTheme(isDarkMode ? darkThemeStyle : lightThemeStyle),
    [isDarkMode]
  );

  const contextList = useLiveQuery(() =>
    db['contextList'].orderBy('date').reverse().toArray()
  );
  const domainAndLinkList = useLiveQuery(() => db['domainAndLink'].toArray());
  const wordList = useLiveQuery(() => db.wordList.toArray());
  const tagList = useLiveQuery(() => db.tagList.toArray());

  const [wordInfoTarget, setWordInfoTarget] = useState(null);

  const changeWordInfoTarget = useCallback((wordAndContextId) => {
    setWordInfoTarget(wordAndContextId);
  }, []);

  const handleWordClick = useCallback(
    (wordAndContextId) => {
      const { wordId, contextId } = wordAndContextId;
      console.log(`wordInfoTarget ${wordInfoTarget}`);
      if (wordId === wordInfoTarget?.wordId) {
        if (
          !wordInfoTarget.contextId ||
          wordInfoTarget.contextId === contextId
        ) {
          changeWordInfoTarget(null);
          return;
        }
      }
      changeWordInfoTarget(wordAndContextId);
    },
    [wordInfoTarget, changeWordInfoTarget]
  );

  const infoTargetAndSetter = useMemo(
    () => ({ wordInfoTarget, handleWordClick, changeWordInfoTarget }),
    [wordInfoTarget, handleWordClick, changeWordInfoTarget]
  );

  return (
    <ContextListContext.Provider value={contextList}>
      <DomainAndLinkListContext.Provider value={domainAndLinkList}>
        <WordListContext.Provider value={wordList}>
          <WordInfoDrawerContext.Provider value={infoTargetAndSetter}>
            <TagListContext.Provider value={tagList}>
              <ColorModeContext.Provider value={{ toggleDarkMode }}>
                <Box sx={{ display: 'flex' }}>
                  <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <KBarCommandPalette>
                      {/* <Snackbar
            TransitionComponent={TransitionUp}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={Boolean(showNotification)}
            autoHideDuration="4000"
            onClose={() => setShowNotification(false)}
            message={showNotification.message}
          /> */}
                      <Sidebar />
                      <PersistentDrawerRight>
                        <Outlet />
                      </PersistentDrawerRight>
                    </KBarCommandPalette>
                  </ThemeProvider>
                </Box>
              </ColorModeContext.Provider>
            </TagListContext.Provider>
          </WordInfoDrawerContext.Provider>
        </WordListContext.Provider>
      </DomainAndLinkListContext.Provider>
    </ContextListContext.Provider>
  );
};

export default Options;
