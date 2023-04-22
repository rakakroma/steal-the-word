import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import React, {
  createContext,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import { db } from '../Background/database';
import PersistentDrawerRight from './components/WordCollection/WordInfoDrawer/WordInfoDrawer';
import { KBarCommandPalette } from './KBarCommandPalette';
import './Options.css';
import { darkThemeStyle, lightThemeStyle } from './theme.style';

export const ContextListContext = createContext([]);
export const DomainAndLinkListContext = createContext([]);
export const WordListContext = createContext([]);
export const WordInfoDrawerContext = createContext({});
export const TagListContext = createContext({});

const MyThemeProvider = (props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = useMemo(
    () => createTheme(isDarkMode ? darkThemeStyle : lightThemeStyle),
    [isDarkMode]
  );
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

const WordDataProvider = (props) => {
  const contextList = useLiveQuery(() =>
    db['contextList'].orderBy('date').reverse().toArray()
  );
  const domainAndLinkList = useLiveQuery(() => db['domainAndLink'].toArray());
  const wordList = useLiveQuery(() => db.wordList.toArray());
  const tagList = useLiveQuery(() => db.tagList.toArray());

  return (
    <ContextListContext.Provider value={contextList}>
      <DomainAndLinkListContext.Provider value={domainAndLinkList}>
        <WordListContext.Provider value={wordList}>
          <TagListContext.Provider value={tagList}>
            {props.children}
          </TagListContext.Provider>
        </WordListContext.Provider>
      </DomainAndLinkListContext.Provider>
    </ContextListContext.Provider>
  );
};

const Options = (props) => {
  const [wordInfoTarget, setWordInfoTarget] = useState(null);

  const changeWordInfoTarget = useCallback((wordAndContextId) => {
    setWordInfoTarget(wordAndContextId);
  }, []);

  const handleWordClick = useCallback(
    (wordAndContextId) => {
      const { wordId, contextId } = wordAndContextId;
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
    <WordDataProvider>
      <WordInfoDrawerContext.Provider value={infoTargetAndSetter}>
        <Box sx={{ display: 'flex' }}>
          <MyThemeProvider>
            <CssBaseline />
            <Suspense fallback={<p>Loading...</p>}>
              <KBarCommandPalette>
                <PersistentDrawerRight>
                  {props.outlet ? props.outlet : <Outlet />}
                </PersistentDrawerRight>
              </KBarCommandPalette>
            </Suspense>
          </MyThemeProvider>
        </Box>
      </WordInfoDrawerContext.Provider>
    </WordDataProvider>
  );
};

export default Options;
