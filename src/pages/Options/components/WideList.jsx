import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { groupBy } from '../utils/groupBy';
import { fullDate } from '../utils/Date';
import { countDate } from '../utils/countDate';
import { Highlighter } from './Highlighter';
import { WideListPageBlock } from './WideListPageBlock';



export const WideList = ({ setShowNotification, myList, hideAlias, handleSelectPhrase, handleDelete, handleEdit }) => {

    const reverseList = myList.sort((a, b) => (+b.date) - (+a.date))
    const groupedList = groupBy(reverseList, 'domain')
    const [editWord, setEditWord] = useState(null)


    return <Box sx={{ display: 'flex', flexDirection: 'column', height: '88vh', overflow: 'scroll' }}>

        {myList && myList.length > 0 ? "" : "現在還沒有東西，請加入詞彙😶‍🌫️"}

        <List sx={{ width: '100%' }}>
            {Object.entries(groupedList).map(arrayWithDomain => {
                return (
                    <ListItem sx={{ flexDirection: 'column' }} key={arrayWithDomain[0]}>
                        <Typography variant='h6'>
                            <img
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
                                <WideListPageBlock
                                    editWord={editWord}
                                    setEditWord={setEditWord}
                                    key={arrayWithUrl[0]}
                                    url={arrayWithUrl[0]}
                                    hideAlias={hideAlias}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    handleSelectPhrase={handleSelectPhrase}
                                    wordsFromThisPage={arrayWithUrl[1]}
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