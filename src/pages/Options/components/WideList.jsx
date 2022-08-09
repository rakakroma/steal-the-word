import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { groupBy } from '../utils/groupBy';
import { fullDate } from '../utils/Date';
import { countDate } from '../utils/countDate';
import { Highlighter } from './Highlighter';

export const WideList = ({ myList, hideAlias, handleSelectPhrase, handleDelete, handleEdit }) => {

    const reverseList = myList.sort((a, b) => (+b.date) - (+a.date))

    const groupedList = groupBy(reverseList, 'domain')


    return <Box sx={{ display: 'flex', flexDirection: 'column' }}>

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
                                                            <Typography sx={{
                                                                display: 'inline-block',
                                                                border: theme => `1px solid ${theme.palette.primary.light}`
                                                            }}
                                                                color={hideAlias ? "background.light" : 'black'} variant='subtitle1'>
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
}