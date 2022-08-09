import React, { useEffect, useState, useRef } from 'react';
import './Options.css';
import ColorThief from '../../../node_modules/colorthief/dist/color-thief.mjs'
import CustomizedDialogs from './components/CustomizedDialogs';
import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { formatDate, fullDate } from './utils/Date'
import { groupBy } from './utils/groupBy'
import { countDate } from './utils/countDate'
import { themeStyle } from './theme.style'
import { WideList } from './components/WideList';
import { SearchBar } from './components/SearchBar';


const Options = () => {

  const [myList, setMyList] = useState([])
  const imgRef = useRef(null)
  const [stolenColor, setStolenColor] = useState([])
  const [searchText, setSearchText] = useState("")
  const [hideAlias, setHideAlias] = useState(true)

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

  const handleDelete = (e) => {
    const updatedList = myList.filter(wordObj => wordObj.id !== e.target.parentElement.id)
    setMyList(updatedList)
    chrome.storage.local.set({ "myWordList": updatedList });
  }

  const handleEdit = (e) => {
    const objToEdit = myList.find(wordObj => wordObj.id === e.target.parentElement.id)
    console.log(objToEdit);
  }

  const handleSelectPhrase = (e) => {
    const objToEdit = myList.find(wordObj => wordObj.id === e.target.parentElement.id)
    objToEdit.phrase = window.getSelection().toString().trim()
    if (!objToEdit.context.includes(objToEdit.phrase) || !objToEdit.phrase.includes(objToEdit.word)) return

    const updatedList = myList.map(wordObj => {
      if (wordObj.id === e.target.parentElement.id) return objToEdit
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

  const reverseList = myList.sort((a, b) => (+b.date) - (+a.date))

  const groupedList = groupBy(reverseList, 'domain')


  // const handleColorThief = (e) => {
  //   const img = e.target.parentElement.querySelector('img');
  //   const colorThief = new ColorThief();
  //   setStolenColor(colorThief.getPalette(img, 3))
  //   console.log(colorThief.getPalette(img, 3)[0]);
  // }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }


  return <div className="OptionsContainer">
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }} backgroundColor="primary.main">
        <Typography variant='h5' sx={{ fontweight: "bold" }}> HolliRuby💫</Typography>

        <SearchBar
          searchText={searchText}
          handleSearch={handleSearch}
          myList={myList}
        />

        <CustomizedDialogs handleExport={handleExport} handleImport={handleImport} />
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '15vw' }}>
        </Box>
        <WideList
          myList={myList}
          hideAlias={hideAlias}
          setHideAlias={setHideAlias}
          handleSelectPhrase={handleSelectPhrase}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <Box sx={{ width: '15vw' }}>
          <Typography variant='h6'>{`已存詞彙 ${myList.length}`}</Typography>

          <FormGroup>
            <FormControlLabel control={<Switch size="small" checked={hideAlias} onChange={() => setHideAlias(!hideAlias)} />} label="註解與背景同色" />
            {/* <FormControlLabel disabled control={<Switch />} label="Disabled" /> */}
          </FormGroup>
        </Box>
      </Box>

    </ThemeProvider>
  </div >
};

export default Options;
