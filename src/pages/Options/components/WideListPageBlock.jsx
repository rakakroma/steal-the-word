import { Divider, Input, Link, List, ListItem, ListItemText, TextareaAutosize, TextField, Tooltip, Typography } from "@mui/material"
import { Box, fontSize } from "@mui/system"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from "@mui/icons-material/Close";
import { countDate } from "../utils/countDate"
import { fullDate } from "../utils/Date"
import { Highlighter } from "./Highlighter"
import React, { useState } from "react"
import { WideListWordBlock } from "./WideListWordBlock";
import { getMatchedContextInfos } from "../utils/transformData";



export const WideListPageBlock = ({ setShowNotification, url, hideAlias, handleDelete, handleEdit, handleSelectPhrase, wordsFromThisPage, editWord, setEditWord }) => {



    return (
        <Box sx={{
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
                    variant='subtitle1' underline='none' href={url} color='primary.light' >
                    {getMatchedContextInfos(wordsFromThisPage[0], url)[0].pageTitle}
                </Link>
                &emsp;
                <Tooltip title={fullDate(Number(wordsFromThisPage[0].date))} placement='top'>
                    <Typography variant='subtitle1' component={'span'}> {countDate(Number(wordsFromThisPage[0].date))} </Typography>
                </Tooltip>
            </Box>
            <List sx={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'secondary.main',
                borderRadius: '15px',
                width: '70vw',
                backgroundColor: "background.light"
            }}>
                {wordsFromThisPage.map((wordObj, index) => {
                    return <WideListWordBlock
                        url={url}
                        key={wordObj.id}
                        wordObj={wordObj}
                        index={index}
                        editWord={editWord}
                        setEditWord={setEditWord}
                        hideAlias={hideAlias}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        handleSelectPhrase={handleSelectPhrase}
                        wordsFromThisPage={wordsFromThisPage}
                        setShowNotification={setShowNotification}
                    />
                })}
            </List>
        </Box>
    )
}