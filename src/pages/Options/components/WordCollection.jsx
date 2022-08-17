import React, { useState } from 'react'
import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import './smallWord.css'
import { Highlighter } from './Highlighter'

export const WordCollection = ({ myList, groupedList, handleSelectPhrase, phraseMode }) => {

    const [showingWord, setShowingWord] = useState(false)
    // console.log(groupedList)

    const handleWordClick = (wordId) => {
        setShowingWord(myList.find(wordObj => wordObj.id === wordId))
    }

    return <Box sx={{ display: 'flex', width: '90vw', flexDirection: 'column', padding: '30px' }}>
        {showingWord ?
            <Box
                sx={{
                    display: 'flex', flexDirection: 'column',
                    padding: "20px", margin: '25px',
                    width: '65vw', height: 'fit-content',
                    backgroundColor: 'background.light',
                    borderRadius: '10px',
                    border: '1px solid grey',
                    boxShadow: theme => `5px 5px ${theme.palette.primary.dark}`,

                }}>
                <Box id={`s-${showingWord.id}`}>
                    <Typography variant='h5' >
                        {showingWord.phrase ?
                            <Highlighter colorStyle={{ color: "#e06666" }}
                                highlightWord={showingWord.word} text={showingWord.phrase} />
                            : showingWord.word}
                    </Typography>
                    <Typography variant='h6' > {showingWord.alias}</Typography>
                    <button onClick={handleSelectPhrase}>句</button>
                </Box>
                <Typography variant='body1' > {showingWord.context}</Typography>
            </Box> :
            null}
        <Box sx={{
            height: showingWord ? "65vh" : "80vh",
            padding: '10px',
            overflow: 'scroll',
            border: '1px solid black'
            //  backgroundColor:"#d1d0d0"
        }}>
            <Masonry spacing={2} columns={phraseMode ? 4 : 6}>
                {
                    Object.entries(groupedList).map(arrayWithDomain => {
                        return <Box sx={{
                            border: '1px solid black',
                            padding: '5px',
                            backgroundColor: 'background.light',
                            borderRadius: '3px'
                        }} key={arrayWithDomain[0]}>
                            <img width='20px' height='20px' loading="lazy"
                                src={arrayWithDomain[0] ?
                                    "https://s2.googleusercontent.com/s2/favicons?domain=" + arrayWithDomain[0] :
                                    "https://findicons.com/files/icons/1504/kidcon_alpine_os/32/local_file_address.png"} alt={"logo of " + arrayWithDomain[0]}
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = "https://" + arrayWithDomain[0] + '/favicon.ico';
                                }} />
                            {arrayWithDomain[1].map(wordObj => {
                                return <Box key={wordObj.id} id={wordObj.id}>
                                    {phraseMode ?
                                        <Box
                                            component='span'
                                            sx={{ color: showingWord?.id === wordObj.id ? 'primary.dark' : "" }}
                                            className='small-word-span'
                                            onClick={() => handleWordClick(wordObj.id)}>
                                            {wordObj.phrase ?
                                                <Highlighter colorStyle={{ color: "#e06666" }}
                                                    highlightWord={wordObj.word} text={wordObj.phrase} />
                                                : wordObj.word}
                                        </Box>
                                        :
                                        <Box
                                            component='span'
                                            sx={{ color: showingWord?.id === wordObj.id ? 'primary.dark' : "" }}
                                            className='small-word-span'
                                            onClick={() => handleWordClick(wordObj.id)}>
                                            {wordObj.word}
                                        </Box>
                                    }
                                </Box>
                            })
                            }
                        </Box>
                    })}
            </Masonry>
        </Box >
    </Box >
}

//{display:'flex', border:'1px solid black', flexDirection:'column', width:'180px', height:'fit-content'}