import React, { useEffect, useState, useRef } from 'react';
import { Settings } from './components/Settings';
import './Options.css';
import ColorThief from '../../../node_modules/colorthief/dist/color-thief.mjs'
import CustomizedDialogs from './components/CustomizedDialogs';
import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { fontSize } from '@mui/system';
import { Highlighter } from './components/Highlighter';
import { formatDate, fullDate } from './utils/Date'
import { groupBy } from './utils/groupBy'
import { countDate } from './utils/countDate'
import { themeStyle } from './theme.style'


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
    // if (attr === 'href') return result.uri
    // if (attr === 'download') return result.fileName
    return {
      link: result.uri,
      fileName: result.fileName
    }
  }

  const reverseList = myList.sort((a, b) => (+b.date) - (+a.date))

  const groupedList = groupBy(reverseList, 'domain')


  const handleColorThief = (e) => {
    const img = e.target.parentElement.querySelector('img');
    const colorThief = new ColorThief();
    setStolenColor(colorThief.getPalette(img, 3))
    console.log(colorThief.getPalette(img, 3)[0]);
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  const allTextSearchResult = (str) => {
    if (str.length > 1) {
      const wordResult = myList.filter(wordObj => wordObj.word.toLowerCase().includes(str.trim().toLowerCase()))
      const contextResult = myList.filter(wordObj => wordObj.context.toLowerCase().includes(str.trim().toLowerCase()))
      const aliasResult = myList.filter(wordObj => wordObj.alias.toLowerCase().includes(str.trim().toLowerCase()))
      const meaningResult = myList.filter(wordObj => wordObj.meaning.toLowerCase().includes(str.trim().toLowerCase()))
      const pageTitleResult = myList.filter(wordObj => wordObj.pageTitle.toLowerCase().includes(str.trim().toLowerCase()))
      return { wordResult, contextResult, aliasResult, meaningResult, pageTitleResult };
    }
    return []
  }



  return <div className="OptionsContainer">
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }} backgroundColor="primary.main">
        <Typography variant='h5' sx={{ fontweight: "bold" }}> HolliRuby💫</Typography>
        <div style={{ position: 'relative', width: '50vw' }}>
          <TextField size="small"
            sx={{ input: { backgroundColor: theme => theme.palette.primary.dark } }}
            variant='outlined'
            value={searchText}
            onChange={handleSearch}
            placeholder="搜尋..."
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position='end' >
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <div style={{ position: 'absolute', backgroundColor: 'white' }}>
            {Array.isArray(allTextSearchResult(searchText).contextResult) ?
              allTextSearchResult(searchText).contextResult.map(wordObj =>
                <li key={wordObj.id}>{wordObj.context}</li>
              ) :
              ""}
          </div>
        </div>
        <CustomizedDialogs handleExport={handleExport} handleImport={handleImport} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }}>
        <Typography variant='h6'>{`已存詞彙 ${myList.length}`}</Typography>

        {myList && myList.length > 0 ? "" : "現在還沒有東西，請加入詞彙😶‍🌫️"}

        <FormGroup>
          <FormControlLabel control={<Switch size="small" checked={hideAlias} onChange={() => setHideAlias(!hideAlias)} />} label="註解與背景同色" />
          {/* <FormControlLabel disabled control={<Switch />} label="Disabled" /> */}
        </FormGroup>

        <List sx={{ width: '100%' }}>
          {Object.entries(groupedList).map(arrayWithDomain => {
            return (<ListItem sx={{ "backgroundColor": `rgba(${stolenColor[1]},0.3)`, flexDirection: 'column' }} key={arrayWithDomain[0]}>
              <Typography variant='h6'>
                <img ref={imgRef}
                  width='20px'
                  height='20px'
                  loading="lazy"
                  src={arrayWithDomain[0] ?
                    "https://" + arrayWithDomain[0] + '/favicon.ico' :
                    "https://findicons.com/files/icons/1504/kidcon_alpine_os/32/local_file_address.png"} alt={"logo of " + arrayWithDomain[0]}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "https://s2.googleusercontent.com/s2/favicons?domain=" + arrayWithDomain[0];
                  }} />
                {/* <button onClick={handleColorThief}>偷</button> */}
                {arrayWithDomain[0] ?
                  arrayWithDomain[1][0].pageTitle.split('-').length > 1 ?
                    arrayWithDomain[1][0].pageTitle.split('-')[arrayWithDomain[1][0].pageTitle.split('-').length - 1].trim() :
                    arrayWithDomain[1][0].pageTitle.split('|').length > 1 ?
                      arrayWithDomain[1][0].pageTitle.split('|')[arrayWithDomain[1][0].pageTitle.split('|').length - 1].trim() :
                      arrayWithDomain[1][0].pageTitle.split('/').length > 1 ?
                        arrayWithDomain[1][0].pageTitle.split('/')[arrayWithDomain[1][0].pageTitle.split('/').length - 1].trim() :
                        arrayWithDomain[1][0].pageTitle.split(':').length > 1 ?
                          arrayWithDomain[1][0].pageTitle.split(':')[arrayWithDomain[1][0].pageTitle.split(':').length - 1].trim() :
                          arrayWithDomain[0] : "Local File"}</Typography>
              {Object.entries(groupBy(arrayWithDomain[1], "url")).map(arrayWithUrl => {


                return (
                  <Box key={arrayWithUrl[0]} sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "flex-end",
                    justifyContent: "center"
                  }}>
                    <Box >
                      <Link sx={{
                        display: "inline-block",
                        textOverflow: "ellipsis",
                        width: " auto",
                        maxWidth: '50vw',
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textAlign: 'right',
                        verticalAlign: 'bottom'
                      }}
                        variant='subtitle1' underline='none' href={arrayWithUrl[0]} color='primary.light' >
                        {arrayWithUrl[1][0].pageTitle}
                      </Link>
                      &emsp;
                      <Tooltip title={fullDate(Number(arrayWithUrl[1][0].date))} placement='top'>
                        <Typography variant='subtitle1' component={'span'}> {countDate(Number(arrayWithUrl[1][0].date))} </Typography>
                      </Tooltip>
                    </Box>
                    <List sx={{
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'secondary.main',
                      borderRadius: '15px',
                      width: '65vw',
                      backgroundColor: "background.light"
                    }}>
                      {arrayWithUrl[1].map((wordObj, index) => {
                        return <>
                          <ListItem
                            id={wordObj.id}
                            key={wordObj.id}
                          >
                            <ListItemText
                              disableTypography
                              primary={<>
                                <Typography sx={{ display: 'inline-block' }} variant='h6'>
                                  {wordObj.phrase ?
                                    <Highlighter highlightWord={wordObj.word} text={wordObj.phrase} /> :
                                    wordObj.word
                                  }
                                  {/* {wordObj.phrase || wordObj.word} */}
                                </Typography>
                                &emsp;
                                <Typography sx={{ display: 'inline-block', border: theme => `1px solid ${theme.palette.primary.light}` }} color={hideAlias ? "background.light" : 'black'} variant='subtitle1'>
                                  {wordObj.alias}
                                </Typography>
                              </>
                              }
                              secondary={<Typography component={'div'} >
                                <Typography variant='body1' component={'span'}  >
                                  {/* {wordObj.context} */}
                                  <Highlighter text={wordObj.context} highlightWord={wordObj.phrase || wordObj.word} />
                                </Typography>
                              </Typography>} />
                            {/* <span style={{ "padding": "2px", "margin": "2px", 'border': '1px solid' }}>{wordObj.phrase || wordObj.word}</span>
                          <p style={{ "display": "inline-block" }}>{wordObj.context}</p> */}
                            {wordObj.phrase ? <button>詞</button> : <button onClick={handleSelectPhrase}>句</button>}
                            <button onClick={handleEdit}>📝</button>
                            <button>封</button>
                            <button onClick={handleDelete}>🕳️</button>
                          </ListItem>
                          {index === arrayWithUrl[1].length - 1 ? null : <Divider />}
                        </>
                      })}
                    </List>
                  </Box>
                )
              })
              }
            </ListItem>
            )
          }
          )
          }
        </List>

      </Box >
    </ThemeProvider>
  </div >
};

export default Options;
