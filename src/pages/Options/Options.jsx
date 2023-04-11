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
export const ColorModeContext = createContext({});
export const TagListContext = createContext({});

const Options = (props) => {
  // const [isDarkMode, setIsDarkMode] = useState(false);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // const theme = useMemo(
  //   () => createTheme(isDarkMode ? darkThemeStyle : lightThemeStyle),
  //   [isDarkMode]
  // );
  const theme = createTheme(lightThemeStyle);

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
              {/* <ColorModeContext.Provider value={{ toggleDarkMode }}> */}
              <Box sx={{ display: 'flex' }}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Suspense fallback={<p>Loading...</p>}>
                    <KBarCommandPalette>
                      <PersistentDrawerRight>
                        {props.outlet ? props.outlet : <Outlet />}
                      </PersistentDrawerRight>
                    </KBarCommandPalette>
                  </Suspense>
                </ThemeProvider>
              </Box>
              {/* </ColorModeContext.Provider> */}
            </TagListContext.Provider>
          </WordInfoDrawerContext.Provider>
        </WordListContext.Provider>
      </DomainAndLinkListContext.Provider>
    </ContextListContext.Provider>
  );
};

export default Options;
