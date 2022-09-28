import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
// import { groupBy } from '../utils/groupBy';
// import { fullDate } from '../utils/Date';
// import { countDate } from '../utils/countDate';
import { Highlighter } from './Highlighter';
import { WideListPageBlock } from './WideListPageBlock';
import { domainPageWords } from '../utils/transformData';
// import { array } from 'prop-types';



export const WideList = ({ domainAndLinkList, contextList, wordList, setShowNotification, hideAlias, handleSelectPhrase, handleDelete, handleEdit }) => {

    const [editWord, setEditWord] = useState(null)

    // console.log(allWords)


    return <Box sx={{ display: 'flex', flexDirection: 'column', height: '88vh', overflow: 'scroll' }}>

        {contextList && contextList.length > 0 ? "" : "現在還沒有東西，請加入詞彙😶‍🌫️"}

        <List sx={{ width: '100%' }}>
            {domainPageWords(contextList).map(arrayWithDomain => {
                const domainInfo = domainAndLinkList.find(domainAndLinkObj => domainAndLinkObj.url === arrayWithDomain[0]) || ''
                const imgUriInDB = domainInfo.icon ? URL.createObjectURL(domainInfo.icon) : ""

                return (
                    <ListItem sx={{ flexDirection: 'column' }} key={arrayWithDomain[0]}>
                        <Typography variant='h6'>
                            <img
                                width='20px'
                                height='20px'
                                loading="lazy"
                                src={imgUriInDB}
                                alt=''
                            />
                            {/* {arrayWithDomain[0] ?
                                arrayWithDomain[1][0].pageTitle.split('-').length > 1 ?
                                    arrayWithDomain[1][0].pageTitle.split('-')[arrayWithDomain[1][0].pageTitle.split('-').length - 1].trim() :
                                    arrayWithDomain[1][0].pageTitle.split('|').length > 1 ?
                                        arrayWithDomain[1][0].pageTitle.split('|')[arrayWithDomain[1][0].pageTitle.split('|').length - 1].trim() :
                                        arrayWithDomain[1][0].pageTitle.split('/').length > 1 ?
                                            arrayWithDomain[1][0].pageTitle.split('/')[arrayWithDomain[1][0].pageTitle.split('/').length - 1].trim() :
                                            arrayWithDomain[1][0].pageTitle.split(':').length > 1 ?
                                                arrayWithDomain[1][0].pageTitle.split(':')[arrayWithDomain[1][0].pageTitle.split(':').length - 1].trim() :
                                                arrayWithDomain[0] : "Local File"} */}
                        </Typography>
                        {arrayWithDomain[1].map(arrayWithUrl => {
                            const wordsFromThisPage = arrayWithUrl.words.reduce((acc, curr) => {
                                if (acc.some(wordObj => wordObj.id === curr.wordId)) return acc
                                const findWord = wordList.find(wordObj => wordObj.id === curr.wordId)
                                acc.push(findWord)
                                return acc
                            }, [])
                            return (
                                <WideListPageBlock
                                    editWord={editWord}
                                    setEditWord={setEditWord}
                                    key={arrayWithUrl.url}
                                    url={arrayWithUrl.url}
                                    hideAlias={hideAlias}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    handleSelectPhrase={handleSelectPhrase}
                                    wordsFromThisPage={wordsFromThisPage}
                                    contextsFromThisPage={arrayWithUrl.words}
                                    setShowNotification={setShowNotification}
                                />
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
}