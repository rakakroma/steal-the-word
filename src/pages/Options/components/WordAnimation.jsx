import { Slider, Box, createTheme, CssBaseline, Divider, FormControlLabel, FormGroup, Input, InputAdornment, Link, List, ListItem, ListItemText, Switch, TextField, ThemeProvider, Tooltip, Typography, Button, IconButton } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import React, { useEffect, useState, useRef } from 'react';
import { shuffle } from '../utils/shuffle';
import { PlayArrow, Shuffle, ShuffleOn } from '@mui/icons-material';
import { Highlighter } from './Highlighter';


export const WordAnimation = ({ myList }) => {

    // const [animatingWord, setAnimatingWord] = useState(null)
    const [intervalCounter, setIntervalCounter] = useState(0)
    const [pause, setPause] = useState(false)
    const [shuffleMode, setShuffleMode] = useState(false)
    const [animatingList, setAnimatingList] = useState(myList)
    const [changeSpeed, setChangeSpeed] = useState(5000)
    const [kaomojiStrPosition, setKaomojiStrPosition] = useState(0)
    const [kaomoji, setKaomoji] = useState("☆゜･:*:･｡,★゜･:*:･ヽ(*゜▽゜*)ノ｡･:*:･ﾟ★,｡･:*:･ﾟ☆")


    useEffect(() => {
        const intervalId = startAndPauseInterval()
        return () => clearInterval(intervalId)
    })

    const handleSpeedChange = (e, newValue) => {
        setChangeSpeed(newValue)
    }

    const startAndPauseInterval = () => {
        let intervalId;
        if (pause) {
            if (intervalId) {
                clearInterval(intervalId)
            }
        } else {
            intervalId = setInterval(() => {
                if (pause) {
                    return
                }
                if (kaomojiStrPosition < kaomoji.length - 1) {
                    console.log('set')
                    setKaomojiStrPosition(kaomojiStrPosition + 1)
                } else {
                    console.log('reset')
                    setKaomojiStrPosition(0)
                    intervalCounter < myList.length - 1 ?
                        setIntervalCounter(intervalCounter + 1) :
                        setIntervalCounter(0)

                }
            }, changeSpeed / kaomoji.length)
        }
        return intervalId
    }

    // const animatingList = shuffleMode ? shuffle(myList) : myList

    const lastWord = animatingList[intervalCounter - 1] || animatingList[myList.length - 1]

    const kaomojiAnimation = (kaomoji, frame) => {
        // return star.substring(0, (intervalCounter % star.length) + 1)
        return kaomoji.substring(0, frame)

    }


    return <Box sx={{ height: '80vh', display: 'flex', width: '90vw', flexDirection: 'column', padding: '30px' }}>
        <Box sx={{ backgroundColor: 'white', height: '30vh' }}>
            {/* <Typography variant='h4'>{animatingList[intervalCounter].phrase || animatingList[intervalCounter].word}</Typography> */}
            <Typography variant='h4'>
                <Highlighter
                    highlightWord={animatingList[intervalCounter].word}
                    text={animatingList[intervalCounter].context} />
            </Typography>
            <Typography variant='h5'>{animatingList[intervalCounter].alias}</Typography>

        </Box>

        <Box sx={{ height: '10vh' }}>
            <Typography variant='subtitle1'>{lastWord.phrase || lastWord.word}</Typography>
            <Typography variant='subtitle2'>{lastWord.alias}</Typography>
            <Typography variant='subtitle2'>{lastWord.context}</Typography>
        </Box>
        <Slider
            label='speed'
            sx={{ width: '250px' }}
            valueLabelDisplay="auto"
            valueLabelFormat={`${changeSpeed / 1000} sec`}
            value={changeSpeed}
            min={500} max={60000}
            onChange={handleSpeedChange} />




        <Typography variant='subtitle1'>{kaomojiAnimation(kaomoji, kaomojiStrPosition)}</Typography>

        <Box >
            <IconButton onClick={() => setPause(!pause)}>
                {pause ? <PlayArrow /> : <PauseIcon />}
            </IconButton>
            <IconButton
                onClick={() => {
                    let shuffleStatus = shuffleMode
                    shuffleStatus ? setAnimatingList(myList) : setAnimatingList(shuffle(myList))
                    setShuffleMode(!shuffleMode)
                }} >
                {shuffleMode ? <ShuffleOn /> : <Shuffle />}
            </IconButton>
        </Box>
    </Box>
}