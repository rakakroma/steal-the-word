import { Chip, Divider, Input, Link, List, ListItem, ListItemText, TextareaAutosize, TextField, Tooltip, Typography } from "@mui/material"
import { Box, fontSize } from "@mui/system"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from "@mui/icons-material/Close";
import { Highlighter } from "./Highlighter"
import React, { useState } from "react"


export const WideListWordBlock = ({ wordObj, index, editWord, setEditWord, hideAlias, handleDelete, handleEdit, handleSelectPhrase, wordsFromThisPage }) => {

    const [word, setWord] = useState(wordObj.word)
    const [alias, setAlias] = useState(wordObj.alias)
    const [context, setContext] = useState(wordObj.context)
    const [chips, setChips] = useState([{ label: 'hello', id: '1' }, { label: 'cool', id: '2' }])


    const handleTagDelete = (e) => {
        console.log(e.target.parentElement)
    }
    const handleEditSubmit = (wordId) => {
        console.log({
            word: word,
            alias: alias,
            context: context
        })
    }

    if (editWord === wordObj.id) return <React.Fragment>
        <ListItem>
            <Box sx={{ display: 'flex', width: '80%' }}>
                <Box sx={{ width: '100%' }}>
                    <Box>
                        <TextField
                            sx={{
                                margin: '4px',
                            }}
                            InputProps={{
                                style: {
                                    fontWeight: 500,
                                    fontSize: '1.1rem',
                                }
                            }}
                            required
                            variant="standard"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}

                        />
                        <TextField
                            sx={{ margin: '4px' }}
                            InputProps={{
                                style: {
                                    fontSize: '1.1rem',
                                }
                            }}
                            required
                            variant="standard"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                    </Box>
                    <TextareaAutosize
                        style={{
                            fontFamily: 'inherit',
                            margin: '4px',
                            width: '100%',
                            resize: 'none',
                            backgroundColor: 'transparent'
                        }}
                        required
                        variant="standard"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                    // defaultValue={wordObj.context}
                    />
                    {/* <button onClick={() => handleEdit(wordObj.id)}><DoneIcon /></button> */}
                </Box>
            </Box>
            <Box>
                <button onClick={() => handleEditSubmit(wordObj.id)}><DoneIcon /></button>
                <button onClick={() => setEditWord(null)}><CloseIcon /></button>
            </Box>
        </ListItem>
        {index === wordsFromThisPage.length - 1 ? null : <Divider />}
    </React.Fragment>

    return <React.Fragment >
        <ListItem><Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>

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
        </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>
                    {chips ?
                        chips.map(chip => {
                            return <Chip key={chip.id} size="small" label={chip.label} onDelete={handleTagDelete} />
                        })
                        : null
                    }
                </Box>
            </Box>

            <button onClick={() => handleSelectPhrase(wordObj.id)}>句</button>
            <button onClick={() => setEditWord(wordObj.id)}>📝</button>
            <button>封</button>
            <button onClick={() => handleDelete(wordObj.id)}>🕳️</button>

        </ListItem>

        {index === wordsFromThisPage.length - 1 ? null : <Divider />}
    </React.Fragment>

}