import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from 'react';
import './Options.css';
import CustomizedDialogs from './components/CustomizedDialogs';
import {
  Checkbox,
  Box,
  createTheme,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  ThemeProvider,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Snackbar,
  Slide,
  alpha,
  Link,
} from '@mui/material';
import { Search, SortByAlpha } from '@mui/icons-material';
import { formatDate, fullDate, sortByDate } from './utils/Date';
// import { groupBy } from './utils/groupBy'
// import { countDate } from './utils/countDate'
import { themeStyle } from './theme.style';
import { WordCollection } from './components/WordCollection/WordCollection';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import {
  checkLocalLanguagePossible,
  checkStringLanguage,
} from './utils/languageDetection';
import { WordAnimation } from './components/WordAnimation';
// import { dataTransform, getDomain } from './utils/transformData';
import { getDataInTableFromIndexedDB } from './utils/getDataFromDB';
import { db } from '../Background/database';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
// import { TestElement } from '../Content/components/testElement';
import { KBarCommandPalette } from './KBarCommandPalette';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { styled } from '@mui/material/styles';
import { useLiveQuery } from 'dexie-react-hooks';
import PersistentDrawerRight from './components/WordCollection/WordInfoDrawer/WordInfoDrawer';
import { useCallback } from 'react';
import { useRegisterActions } from 'kbar';

// function TransitionUp(props) {
//   return <Slide {...props} direction="up" />;
// }

export const ContextListContext = createContext([]);
export const DomainAndLinkListContext = createContext([]);
export const WordListContext = createContext([]);
export const WordInfoDrawerContext = createContext({});

const Options = () => {
  // const [searchText, setSearchText] = useState('');
  // const [hideAlias, setHideAlias] = useState(true);
  // const [viewMode, setViewMode] = useState(false);
  // const [phraseMode, setPhraseMode] = useState(false);
  // const [animationMode, setAnimationMode] = useState(false);
  // const [languageFilter, setLanguageFilter] = useState({
  //   taiwanese: true,
  //   hakka: true,
  //   english: true,
  //   chinese: true,
  //   japanese: true,
  //   korean: true,
  //   all: true,
  // });
  // const [timeMode, setTimeMode] = useState(false);
  // const [showNotification, setShowNotification] = useState(false);
  // const [testMode, setTestMode] = useState(false);
  // const [alphabeticalOrderMode, setAlphabeticalOrderMode] = useState(false);

  const theme = createTheme(themeStyle);

  // const handleDelete = (id) => {
  //   const updatedList = contextList.filter((wordObj) => wordObj.id !== id);
  //   setContextList(updatedList);
  //   // chrome.storage.local.set({ "myWordList": updatedList });
  // };

  // const handleEdit = (id, updatedInfo) => {
  //   const targetId = id;
  //   let objToEdit = contextList.find((wordObj) => wordObj.id === targetId);
  //   objToEdit = { ...objToEdit, ...updatedInfo };

  //   const updatedList = contextList.map((wordObj) => {
  //     if (wordObj.id === id) return objToEdit;
  //     return wordObj;
  //   });
  //   setContextList(updatedList);
  //   // chrome.storage.local.set({ "myWordList": updatedList });
  // };

  // const handleSelectPhrase = (targetId) => {
  //   const objToEdit = contextList.find((wordObj) => wordObj.id === targetId);
  //   objToEdit.phrase = window.getSelection().toString().trim();
  //   if (
  //     !objToEdit.context.includes(objToEdit.phrase) ||
  //     !objToEdit.phrase.includes(objToEdit.word)
  //   )
  //     return;

  //   // const updatedList = contextList.map((wordObj) => {
  //   //   // if (wordObj.id === e.target.parentElement.id) return objToEdit
  //   //   if (wordObj.id === targetId) return objToEdit;
  //   //   return wordObj;
  //   // });
  //   // setContextList(updatedList);
  //   window.getSelection().removeAllRanges();
  //   // chrome.storage.local.set({ "myWordList": updatedList });
  // };

  // const groupedList = (wordList) => groupBy(sortByDate(wordList), 'domain')

  // const getSelectedLanguage = () => {
  //   return Object.entries(languageFilter).reduce((accu, [key, value]) => {
  //     if (value) accu.push(key);
  //     return accu;
  //   }, []);
  // };

  // const getUnselectedLanguage = () => {
  //   return Object.entries(languageFilter).reduce((accu, [key, value]) => {
  //     if (!value) accu.push(key);
  //     return accu;
  //   }, []);
  // };

  // const languageSelectionFilter = (wordList) => {
  //   if (getSelectedLanguage().length === Object.entries(languageFilter).length)
  //     return wordList;
  //   if (getSelectedLanguage().includes('all')) {
  //     return wordList.filter((wordObj) => {
  //       return !getUnselectedLanguage().includes(
  //         checkStringLanguage(
  //           checkLocalLanguagePossible(wordObj.alias)
  //             ? wordObj.alias || wordObj.context
  //             : wordObj.context
  //         )
  //       );
  //     });
  //   } else {
  //     return wordList.filter((wordObj) => {
  //       return getSelectedLanguage().includes(
  //         checkStringLanguage(
  //           checkLocalLanguagePossible(wordObj.alias)
  //             ? wordObj.alias || wordObj.context
  //             : wordObj.context
  //         )
  //       );
  //     });
  //   }
  // };

  // const languages = [
  //   'english',
  //   'japanese',
  //   'korean',
  //   'taiwanese',
  //   'hakka',
  //   'chinese',
  // ];

  const contextList = useLiveQuery(() =>
    db['contextList'].orderBy('date').reverse().toArray()
  );
  const domainAndLinkList = useLiveQuery(() => db['domainAndLink'].toArray());
  const wordList = useLiveQuery(() => db.wordList.toArray());

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

                  {/* <Box sx={{ display: 'flex', margin: '10px' }}> */}
                  {/* <Box sx={{ width: '10vw' }}>
              <Typography
                variant="h6"
                sx={{ margin: '15px' }}
              >{`已存詞彙 ${contextList.length}`}</Typography>

              <MultipleSelectCheckmarks options={languages} />

              <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={viewMode}
                      onChange={() => setViewMode(!viewMode)}
                    />
                  }
                  label="單字顯示模式"
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={hideAlias}
                      onChange={() => setHideAlias(!hideAlias)}
                    />
                  }
                  label="註解與背景同色"
                />

                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 && languageFilter.all
                  }
                  control={
                    <Switch
                      size="small"
                      checked={languageFilter.all}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          all: !languageFilter.all,
                        })
                      }
                    />
                  }
                  label="顯示全部"
                />
                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 && languageFilter.english
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={languageFilter.english}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          english: !languageFilter.english,
                        })
                      }
                    />
                  }
                  label="顯示英文詞"
                />
                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 &&
                    languageFilter.japanese
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={languageFilter.japanese}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          japanese: !languageFilter.japanese,
                        })
                      }
                    />
                  }
                  label="顯示日文"
                />
                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 && languageFilter.korean
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={languageFilter.korean}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          korean: !languageFilter.korean,
                        })
                      }
                    />
                  }
                  label="顯示韓文"
                />
                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 && languageFilter.chinese
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={languageFilter.chinese}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          chinese: !languageFilter.chinese,
                        })
                      }
                    />
                  }
                  label="顯示中文"
                />
                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 &&
                    languageFilter.taiwanese
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={languageFilter.taiwanese}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          taiwanese: !languageFilter.taiwanese,
                        })
                      }
                    />
                  }
                  label="顯示台文"
                />
                <FormControlLabel
                  disabled={
                    getSelectedLanguage().length === 1 && languageFilter.hakka
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={languageFilter.hakka}
                      onChange={() =>
                        setLanguageFilter({
                          ...languageFilter,
                          hakka: !languageFilter.hakka,
                        })
                      }
                    />
                  }
                  label="顯示客語"
                />

                {viewMode === false ? (
                  <>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={phraseMode}
                          onChange={() => setPhraseMode(!phraseMode)}
                        />
                      }
                      label="片語模式"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={timeMode}
                          onChange={() => setTimeMode(!timeMode)}
                        />
                      }
                      label="時間模式"
                    />
                  </>
                ) : null}

              </FormGroup>
              <IconButton
                onClick={() => setAnimationMode(!animationMode)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <PersonalVideoIcon />
              </IconButton>
              <IconButton
                onClick={() => setTestMode(!testMode)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <LaptopChromebookIcon />
              </IconButton>
              <IconButton
                onClick={() => setAlphabeticalOrderMode(!alphabeticalOrderMode)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <SortByAlpha />
              </IconButton>
            </Box> */}
                  {/* <Box sx={{ width: '15vw' }}>

        </Box> */}
                  {/* {animationMode ? (
            <WordAnimation contextList={languageSelectionFilter(contextList)} />
          ) : testMode ? (
            <Box> */}
                  {/* {domainAndLinkList.map((obj, i) => {
                return <img
                  width='20px'
                  height='20px'
                  loading="lazy"
                  src={obj.icon ? URL.createObjectURL(obj.icon) : ''}
                  alt={obj.url}
                />
              })} */}
                  {/* </Box>
          ) : viewMode === true ? (
            <WideList
              wordList={wordList}
              contextList={contextList}
              // allWords={transformedData}
              hideAlias={hideAlias}
              setHideAlias={setHideAlias}
              handleSelectPhrase={handleSelectPhrase}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              setShowNotification={setShowNotification}
              domainAndLinkList={domainAndLinkList}
            />
          ) : (
          )} */}

                  {/* </Box> */}
                </KBarCommandPalette>
              </ThemeProvider>
            </Box>
          </WordInfoDrawerContext.Provider>
        </WordListContext.Provider>
      </DomainAndLinkListContext.Provider>
    </ContextListContext.Provider>
  );
};

export default Options;
