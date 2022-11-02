import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { getDomain } from "../utils/transformData";

export const WordCollectionPageBox = ({ imgUri, arrayWithUrl, showingWord, targetWordRef, handleWordClick }) => {

    return <Box sx={{
        border: '1px solid black',
        padding: '5px',
        backgroundColor: 'background.light',
        borderRadius: '3px',
        width: '20%',
        height: 'fit-content'
    }} key={arrayWithUrl[0]}>
        <Box sx={{ display: 'flex' }}>
            <img width='20px' height='20px' loading="lazy"
                src={imgUri}
                alt=''
            // src={getDomain(arrayWithUrl.words[0].url) ?
            //     "https://s2.googleusercontent.com/s2/favicons?domain=" + getDomain(arrayWithUrl.words[0].contextInfos[0].url) :
            //     "https://findicons.com/files/icons/1504/kidcon_alpine_os/32/local_file_address.png"} alt={"logo of " + getDomain(arrayWithUrl.words[0].contextInfos[0].url)}
            // onError={({ currentTarget }) => {
            //     currentTarget.onerror = null;
            //     currentTarget.src = "https://" + getDomain(arrayWithUrl.words[0].contextInfos[0].url) + '/favicon.ico';
            // }} 
            />
            <Typography variant='body2' sx={{
                marginLeft: '2px',
                display: 'inline-block',
                color: 'gray',
                height: '15px',
                overflow: 'hidden',
                textOverflow: "ellipsis"
            }}>{arrayWithUrl.words[0].pageTitle}</Typography>
        </Box>
        {arrayWithUrl.words.map(wordObj => {
            return <Box key={wordObj.id} id={wordObj.id}>
                <Box
                    component='span'
                    ref={showingWord?.id === wordObj.id ? targetWordRef : null}
                    sx={{ color: showingWord?.id === wordObj.id ? 'primary.dark' : "" }}
                    className='small-word-span'
                    onClick={() => handleWordClick(wordObj.id)}>
                    {wordObj.word}
                </Box>
            </Box>
        })}
    </Box>
}
