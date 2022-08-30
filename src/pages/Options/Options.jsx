import React, { useEffect, useState, useRef, createContext } from 'react';
import './Options.css';
import CustomizedDialogs from './components/CustomizedDialogs';
import { Checkbox, Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Snackbar, Slide } from '@mui/material';
import { Search } from '@mui/icons-material';
import { formatDate, fullDate, sortByDate } from './utils/Date'
import { groupBy } from './utils/groupBy'
import { countDate } from './utils/countDate'
import { themeStyle } from './theme.style'
import { WideList } from './components/WideList';
import { SearchBar } from './components/SearchBar';
import { WordCollection } from './components/WordCollection'
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import { checkLocalLanguagePossible, checkStringLanguage } from './utils/languageDetection';
import { WordAnimation } from './components/WordAnimation';
import MultipleSelectCheckmarks from './components/MultiSelectionCheckmarks';
import { dataTransform } from './utils/transformData';



function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}



const Options = () => {

  const [myList, setMyList] = useState([])
  // const imgRef = useRef(null)
  // const [stolenColor, setStolenColor] = useState([])
  const [searchText, setSearchText] = useState("")
  const [hideAlias, setHideAlias] = useState(true)
  const [viewMode, setViewMode] = useState(false)
  const [phraseMode, setPhraseMode] = useState(false)
  const [animationMode, setAnimationMode] = useState(false)
  const [languageFilter, setLanguageFilter] = useState({ taiwanese: true, hakka: true, english: true, chinese: true, japanese: true, korean: true, all: true })
  const [timeMode, setTimeMode] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const transformedData = dataTransform(myList)

  const theme = createTheme(themeStyle)

  useEffect(() => {
    chrome.storage.local.get("myWordList", function (obj) {
      if (obj.myWordList && obj.myWordList.length > 0) {
        setMyList(obj.myWordList)
        // console.log(obj.myWordList, myList);
      } else {
        console.log('沒有');
      }
    })
  }, [])

  const handleDelete = (id) => {
    const updatedList = myList.filter(wordObj => wordObj.id !== id)
    setMyList(updatedList)
    chrome.storage.local.set({ "myWordList": updatedList });
  }

  const handleEdit = (id, updatedInfo) => {
    const targetId = id
    let objToEdit = myList.find(wordObj => wordObj.id === targetId)
    objToEdit = { ...objToEdit, ...updatedInfo }

    const updatedList = myList.map(wordObj => {
      if (wordObj.id === id) return objToEdit
      return wordObj
    })
    setMyList(updatedList)
    chrome.storage.local.set({ "myWordList": updatedList });
  }


  const handleSelectPhrase = (targetId) => {
    const objToEdit = myList.find(wordObj => wordObj.id === targetId)
    objToEdit.phrase = window.getSelection().toString().trim()
    if (!objToEdit.context.includes(objToEdit.phrase) || !objToEdit.phrase.includes(objToEdit.word)) return

    const updatedList = myList.map(wordObj => {
      // if (wordObj.id === e.target.parentElement.id) return objToEdit
      if (wordObj.id === targetId) return objToEdit
      return wordObj
    })
    setMyList(updatedList)
    window.getSelection().removeAllRanges()
    chrome.storage.local.set({ "myWordList": updatedList });
  }

  const logFile = (event) => {
    let str = event.target.result;
    let json = JSON.parse(str);
    // console.log('string', str);
    console.log('json', json);
    setMyList(json)
    chrome.storage.local.set({ "myWordList": json });
  }

  const handleImport = (e) => {
    console.log('import')
    e.preventDefault()
    if (!file.value.length) return;
    let reader = new FileReader()
    reader.onload = logFile;
    reader.readAsText(file.files[0]);
  }

  const exportToJsonFile = (obj) => {
    const dataStr = JSON.stringify(obj);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `HolliRubyList ${formatDate(new Date())}.json`;
    return { uri: dataUri, fileName: exportFileDefaultName }
  }

  const handleExport = () => {
    const result = exportToJsonFile(myList)
    return {
      link: result.uri,
      fileName: result.fileName
    }
  }


  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }


  const groupedList = (wordList) => groupBy(sortByDate(wordList), 'domain')

  const getSelectedLanguage = () => {
    return Object.entries(languageFilter).reduce((accu, [key, value]) => {
      if (value) accu.push(key)
      return accu
    }, [])
  }

  const getUnselectedLanguage = () => {
    return Object.entries(languageFilter).reduce((accu, [key, value]) => {
      if (!value) accu.push(key)
      return accu
    }, [])
  }

  const languageSelectionFilter = (wordList) => {
    if (getSelectedLanguage().length === Object.entries(languageFilter).length) return wordList
    if (getSelectedLanguage().includes('all')) {
      return wordList.filter(wordObj => {
        return !getUnselectedLanguage().includes(checkStringLanguage(checkLocalLanguagePossible(wordObj.alias) ? wordObj.alias || wordObj.context : wordObj.context))
      })
    } else {
      return wordList.filter(wordObj => {
        return getSelectedLanguage().includes(checkStringLanguage(checkLocalLanguagePossible(wordObj.alias) ? wordObj.alias || wordObj.context : wordObj.context))
      })
    }
  }

  const languages = ['english', 'japanese', 'korean', 'taiwanese', 'hakka', 'chinese']


  return <div className="OptionsContainer">
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        TransitionComponent={TransitionUp}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={Boolean(showNotification)}
        autoHideDuration='4000'
        onClose={() => setShowNotification(false)}
        message={showNotification.message}
      />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }} backgroundColor="primary.main">
        <Typography variant='h5' sx={{ fontWeight: "bold" }}> HolliRuby💫</Typography>

        <SearchBar
          searchText={searchText}
          handleSearch={handleSearch}
          myList={myList}
        />

        <CustomizedDialogs handleExport={handleExport} handleImport={handleImport} />
      </Box>


      <Box sx={{ display: 'flex', margin: '10px' }}>
        <Box sx={{ width: '10vw' }}>
          <Typography variant='h6' sx={{ margin: '15px' }}>{`已存詞彙 ${myList.length}`}</Typography>


          <MultipleSelectCheckmarks options={languages} />

          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel control={<Switch size="small" checked={viewMode} onChange={() => setViewMode(!viewMode)} />} label="單字顯示模式" />
            <FormControlLabel control={<Switch size="small" checked={hideAlias} onChange={() => setHideAlias(!hideAlias)} />} label="註解與背景同色" />

            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.all}
              control={<Switch size="small" checked={languageFilter.all} onChange={() => setLanguageFilter({ ...languageFilter, all: !languageFilter.all })} />} label="顯示全部" />
            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.english}
              control={<Checkbox size="small" checked={languageFilter.english} onChange={() => setLanguageFilter({ ...languageFilter, english: !languageFilter.english })} />} label="顯示英文詞" />
            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.japanese}
              control={<Checkbox size="small" checked={languageFilter.japanese} onChange={() => setLanguageFilter({ ...languageFilter, japanese: !languageFilter.japanese })} />} label="顯示日文" />
            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.korean}
              control={<Checkbox size="small" checked={languageFilter.korean} onChange={() => setLanguageFilter({ ...languageFilter, korean: !languageFilter.korean })} />} label="顯示韓文" />
            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.chinese}
              control={<Checkbox size="small" checked={languageFilter.chinese} onChange={() => setLanguageFilter({ ...languageFilter, chinese: !languageFilter.chinese })} />} label="顯示中文" />
            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.taiwanese}
              control={<Checkbox size="small" checked={languageFilter.taiwanese} onChange={() => setLanguageFilter({ ...languageFilter, taiwanese: !languageFilter.taiwanese })} />} label="顯示台文" />
            <FormControlLabel disabled={getSelectedLanguage().length === 1 && languageFilter.hakka}
              control={<Checkbox size="small" checked={languageFilter.hakka} onChange={() => setLanguageFilter({ ...languageFilter, hakka: !languageFilter.hakka })} />} label="顯示客語" />

            {viewMode === false ?
              <>
                <FormControlLabel control={<Switch size="small" checked={phraseMode} onChange={() => setPhraseMode(!phraseMode)} />} label="片語模式" />
                <FormControlLabel control={<Switch size="small" checked={timeMode} onChange={() => setTimeMode(!timeMode)} />} label="時間模式" />
              </> :
              null
            }

            {/* <FormControlLabel disabled control={<Switch />} label="Disabled" /> */}
          </FormGroup>
          <IconButton
            onClick={() => setAnimationMode(!animationMode)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <PersonalVideoIcon />
          </IconButton>
        </Box>
        {/* <Box sx={{ width: '15vw' }}>

        </Box> */}
        {animationMode ?
          <WordAnimation
            myList={languageSelectionFilter(myList)}
          /> :
          viewMode === true ?
            <WideList
              myList={languageSelectionFilter(myList)}
              allWords={transformedData}
              hideAlias={hideAlias}
              setHideAlias={setHideAlias}
              handleSelectPhrase={handleSelectPhrase}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              setShowNotification={setShowNotification}
            />
            : <WordCollection
              allWords={transformedData}
              myList={languageSelectionFilter(myList)}
              groupedList={groupedList(languageSelectionFilter(myList))}
              phraseMode={phraseMode}
              handleSelectPhrase={handleSelectPhrase}
              timeMode={timeMode}
            />
        }

      </Box>
    </ThemeProvider>
  </div >
};

export default Options;
