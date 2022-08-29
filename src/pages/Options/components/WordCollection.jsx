import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Slider, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import './smallWord.css'
import { Highlighter } from './Highlighter'
import { groupBy } from '../utils/groupBy';
import { sortByDate } from '../utils/Date';
import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime'
import { WordCollectionPageBox } from './WordCollectionPageBox';
// import groupBy from 'lodash/groupBy'

export const WordCollection = ({ myList, groupedList, handleSelectPhrase, phraseMode, timeMode }) => {

    const [showingWord, setShowingWord] = useState(false)
    const [dateArrangement, setDateArrangement] = useState('date')

    const groupedByPageList = (wordList) => groupBy(sortByDate(wordList), 'url')

    const handleWordClick = (wordId) => {
        setShowingWord(myList.find(wordObj => wordObj.id === wordId))
    }

    const arrayWithUrls = Object.entries(groupedByPageList(myList))

    const arrayWithUrlsByDateType = (datetype) => {
        return arrayWithUrls.reduce((acc, currentValue) => {
            const dateData = dayjs(+currentValue[1][0].date).startOf(datetype).format('YYYY/MM/DD')
            if (!acc.some(sortByDateData => sortByDateData.dateData === dateData)) {
                return acc.concat({ dateData: dateData, sortByUrlData: [currentValue] })
            }
            return acc.map(sortByDateData => {
                if (sortByDateData.dateData === dateData) {
                    sortByDateData.sortByUrlData = sortByDateData.sortByUrlData.concat([currentValue])
                }
                return sortByDateData
            })
        }, [])
    }

    const handleDateArrangementChange = (e, newValue) => {
        const sliderValue =
            newValue === 0 ? 'date' :
                newValue === 1 ? 'week' :
                    newValue === 2 ? 'month' : null

        setDateArrangement(sliderValue)
    }

    const wordListInDateOrder = arrayWithUrlsByDateType('date').reduce((acc, currentValue) => {
        const wordListInCurrentValue = currentValue.sortByUrlData.map(arrayWithUrl => {
            return arrayWithUrl[1]
        })
        return acc.concat(wordListInCurrentValue.flat())
    }, [])

    const wordListInGroupedListOrder = Object.values(groupedList).flat()

    const handleToNextWord = useCallback(() => {
        const orderList = timeMode ? wordListInDateOrder : wordListInGroupedListOrder
        if (showingWord) {
            const currentOrderIndex = orderList.findIndex(wordObj => wordObj.id === showingWord.id)
            const nextOrderIndex = currentOrderIndex === orderList.length - 1 ?
                0 : currentOrderIndex + 1
            setShowingWord(orderList[nextOrderIndex])
        } else {
            setShowingWord(orderList[0])
        }
    }, [showingWord, timeMode, wordListInDateOrder, wordListInGroupedListOrder])

    const handleToLastWord = useCallback(() => {
        const orderList = timeMode ? wordListInDateOrder : wordListInGroupedListOrder
        if (showingWord) {
            const currentOrderIndex = orderList.findIndex(wordObj => wordObj.id === showingWord.id)
            const lastOrderIndex = currentOrderIndex === 0 ?
                orderList.length - 1 : currentOrderIndex - 1
            setShowingWord(orderList[lastOrderIndex])
        } else {
            setShowingWord(orderList[0])
        }
    }, [showingWord, timeMode, wordListInDateOrder, wordListInGroupedListOrder])

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowRight') {
            handleToNextWord()
        } else if (e.key === 'ArrowLeft') {
            handleToLastWord()
        } else return
    }, [handleToNextWord, handleToLastWord])


    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const targetWordRef = useRef(null)

    useEffect(() => {
        targetWordRef.current?.scrollIntoView({ block: "center", inline: "nearest" })
    }, [showingWord])


    return <Box sx={{ display: 'flex', height: '90vh', width: '90vw', flexDirection: 'column', px: '25px', py: '10px' }}>
        <Box>

        </Box>
        {showingWord ?
            <Box sx={{ display: 'flex' }}>
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
                        <button onClick={() => handleSelectPhrase(showingWord.id)}>句</button>
                    </Box>
                    <Typography variant='body1' > {showingWord.context}</Typography>
                </Box>
            </Box> :
            null}
        {timeMode ?
            <>
                <Slider
                    sx={{ width: '100px' }}
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => {
                        switch (value) {
                            case 0:
                                return '日'
                            case 1:
                                return '週'
                            case 2:
                                return '月'
                            case 3:
                                return '無'
                            default:
                                return
                        }
                    }}
                    step={1}
                    marks
                    min={0}
                    max={3}
                    onChange={handleDateArrangementChange}
                />
                <Box>
                    <button onClick={handleToLastWord} >上一個</button>
                    <button onClick={handleToNextWord} >下一個</button>
                </Box>
            </> : null
        }
        <Box sx={{
            height: showingWord ? "65vh" : "80vh",
            padding: '10px',
            overflow: 'scroll',
            border: '1px solid black'
            //  backgroundColor:"#d1d0d0"
        }}>

            {timeMode ?
                <Box>
                    {dateArrangement ?
                        arrayWithUrlsByDateType(dateArrangement).map(sortByDateData => {
                            return <Masonry spacing={2} columns={phraseMode ? 4 : 6} key={sortByDateData.dateData}>
                                <Typography variant='h5'>{sortByDateData.dateData.slice(5)}</Typography>
                                {sortByDateData.sortByUrlData.map(arrayWithUrl => {
                                    return <WordCollectionPageBox
                                        targetWordRef={targetWordRef}
                                        key={arrayWithUrl[0]}
                                        arrayWithUrl={arrayWithUrl}
                                        showingWord={showingWord}
                                        handleWordClick={handleWordClick}
                                    />
                                })}
                            </Masonry>
                        }) : <Masonry spacing={2} columns={phraseMode ? 4 : 6} >
                            {arrayWithUrls.map(arrayWithUrl => {
                                return <WordCollectionPageBox
                                    targetWordRef={targetWordRef}
                                    key={arrayWithUrl[0]}
                                    arrayWithUrl={arrayWithUrl}
                                    showingWord={showingWord}
                                    handleWordClick={handleWordClick}
                                />
                            })}
                        </Masonry>
                    }
                </Box>
                :

                <Masonry spacing={2} columns={phraseMode ? 4 : 6}>
                    {Object.entries(groupedList).map(arrayWithDomain => {
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
                            {Object.entries(groupBy(arrayWithDomain[1], "url")).map((arrayWithUrl, i) => {
                                return <Box key={arrayWithUrl[0]}>
                                    {arrayWithUrl[1].map(wordObj => {
                                        return <Box key={wordObj.id} id={wordObj.id}>
                                            {phraseMode ?
                                                <Box
                                                    component='span'
                                                    ref={showingWord?.id === wordObj.id ? targetWordRef : null}
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
                                                    ref={showingWord?.id === wordObj.id ? targetWordRef : null}
                                                    sx={{ color: showingWord?.id === wordObj.id ? 'primary.dark' : "" }}
                                                    className='small-word-span'
                                                    onClick={() => handleWordClick(wordObj.id)}>
                                                    {wordObj.word}
                                                </Box>
                                            }
                                        </Box>
                                    })
                                    }
                                    {i === Object.entries(groupBy(arrayWithDomain[1], "url")).length - 1 ? null : <Divider />}

                                </Box>

                            })

                            }
                        </Box>
                    })
                    }
                </Masonry>
            }
        </Box >
    </Box >
}

