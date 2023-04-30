import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import React, {
  createContext,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../Background/database';
import PersistentDrawerRight from './components/WordCollection/WordInfoDrawer/WordInfoDrawer';
import { KBarCommandPalette } from './KBarCommandPalette';
import './Options.css';
import { darkThemeStyle, lightThemeStyle } from './theme.style';
import { getHostName } from './utils/transformData';

export const ContextListContext = createContext(null);
export const DomainAndLinkListContext = createContext(null);
export const WordListContext = createContext(null);
export const WordInfoDrawerContext = createContext(null);
export const TagListContext = createContext(null);
export const OrderModeANdSiteTargetContext = createContext(null);

const MyThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = useMemo(
    () => createTheme(isDarkMode ? darkThemeStyle : lightThemeStyle),
    [isDarkMode]
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const WordDataProvider = ({ children }) => {
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
            {children}
          </TagListContext.Provider>
        </WordListContext.Provider>
      </DomainAndLinkListContext.Provider>
    </ContextListContext.Provider>
  );
};

const WordTargetProvider = ({ children }) => {
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
    <WordInfoDrawerContext.Provider value={infoTargetAndSetter}>
      {children}
    </WordInfoDrawerContext.Provider>
  );
};

const OrderModeAndSiteTargetProvider = ({ children }) => {
  const [targetSite, setTargetSite] = useState('');
  const [orderMode, setOrderMode] = useState('time');

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toCertainSite = useCallback(
    (url) => {
      const domainName = getHostName(url);

      if (!pathname.includes('collection')) {
        navigate('/home/collection');
      }
      setOrderMode('timeSite');
      setTargetSite(domainName);
    },
    [navigate, pathname]
  );

  // get order mode cookie
  useEffect(() => {
    const cookies = document.cookie
      ?.split(';')
      .map((cookieString) => cookieString.trim());
    const orderModeCookie = cookies
      .find((cookie) => cookie.startsWith('orderMode='))
      ?.split('=')[1];

    if (
      orderModeCookie &&
      ['tags', 'time', 'timeSite', 'alphabeticalOrder'].includes(
        orderModeCookie
      )
    ) {
      setOrderMode(orderModeCookie);
    }
  }, []);

  return (
    <OrderModeANdSiteTargetContext.Provider
      value={{
        targetSite,
        orderMode,
        setOrderMode,
        toCertainSite,
        setTargetSite,
      }}
    >
      {children}
    </OrderModeANdSiteTargetContext.Provider>
  );
};

const Options = (props) => {
  return (
    <WordDataProvider>
      <WordTargetProvider>
        <OrderModeAndSiteTargetProvider>
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
        </OrderModeAndSiteTargetProvider>
      </WordTargetProvider>
    </WordDataProvider>
  );
};

export default Options;
