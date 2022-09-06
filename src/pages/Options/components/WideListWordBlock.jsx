import { Chip, Divider, Input, Link, List, ListItem, ListItemText, Slide, TextareaAutosize, TextField, Tooltip, Typography } from "@mui/material"
import { Box, fontSize } from "@mui/system"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from "@mui/icons-material/Close";
import { Highlighter } from "./Highlighter"
import React, { useState } from "react"
import { getAllPhrasesInThisContext, getMatchedContextInfos } from "../utils/transformData";
import AddCircleIcon from '@mui/icons-material/AddCircle';


export const WideListWordBlock = ({ url, setShowNotification, wordObj, index, editWord, setEditWord, hideAlias, handleDelete, handleEdit, handleSelectPhrase, wordsFromThisPage }) => {

    const [stem, setStem] = useState(wordObj.stem || '')
    const [word, setWord] = useState(wordObj.word)
    const [definitionGroups, setDefinitionGroups] = useState(wordObj.definitionGroups)
    const [contextInfos, setContextInfos] = useState(wordObj.contextInfos)
    const [chips, setChips] = useState([{ label: 'hello', id: '1' }, { label: 'cool', id: '2' }])


    const handleTagDelete = (e) => {
        console.log(e.target.parentElement)
    }
    // const handleEditSubmit = (wordId) => {
    //     console.log({
    //         word: word,
    //         alias: alias,
    //         context: context
    //     })
    // }

    const handleEditAlias = (e, id, index) => {
        const result = JSON.parse(JSON.stringify(definitionGroups))
        result.find(definitionGroup => definitionGroup.definitionId === id).aliases[index] = e.target.value
        setDefinitionGroups(result)
    }

    const handleEditContext = (e, date) => {
        const result = JSON.parse(JSON.stringify(contextInfos))
        result.find(definitionGroup => definitionGroup.date === date).context = e.target.value
        setContextInfos(result)
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
                        {definitionGroups.map((definitionGroup, groupsIndex) => {
                            return <React.Fragment key={definitionGroup.definitionId}>
                                <Box>
                                    {definitionGroup.aliases.map((alias, aliasesIndex) => {
                                        return <React.Fragment key={aliasesIndex}>
                                            <TextField
                                                sx={{ margin: '4px' }}
                                                InputProps={{
                                                    style: {
                                                        fontSize: '1.0rem',
                                                    }
                                                }}

                                                variant="standard"
                                                value={alias}
                                                onChange={(e) => handleEditAlias(e, definitionGroup.definitionId, aliasesIndex)}
                                            />
                                            {aliasesIndex === definitionGroup.aliases.length - 1 ? <AddCircleIcon /> : null}
                                        </React.Fragment>
                                    })
                                    }
                                </Box>
                                {groupsIndex === definitionGroups.length - 1 ? <AddCircleIcon /> : null}
                            </React.Fragment>
                        })}
                    </Box>
                    {contextInfos.map((contextInfo, i) => {
                        return <Box key={contextInfo.date + i}>
                            <TextareaAutosize
                                style={{
                                    fontFamily: 'inherit',
                                    margin: '4px',
                                    width: '100%',
                                    resize: 'none',
                                    backgroundColor: 'transparent'
                                }}

                                variant="standard"
                                value={contextInfo.context}
                                onChange={(e) => handleEditContext(e, contextInfo.date)}
                            />
                        </Box>
                    })}

                    {stem ?
                        <TextField
                            sx={{
                                margin: '4px',
                            }}
                            InputProps={{
                                style: {
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                }
                            }}
                            label='stem'
                            variant="standard"
                            value={stem}
                            onChange={(e) => setStem(e.target.value)}
                        />
                        : null}
                    {/* <button onClick={() => handleEdit(wordObj.id)}><DoneIcon /></button> */}
                </Box>
            </Box>
            <Box>
                <button onClick={() => setStem(wordObj.word)}>幹</button>
                <button onClick={() => {
                    const editedResult = {}
                    const properties =
                        [{ name: 'stem', text: stem.trim() },
                        { name: 'word', text: word.trim() },
                        { name: 'alias', text: alias.trim() },
                        { name: 'context', text: context.trim() }]
                    properties.forEach(property => {
                        if (property.text && property.text !== wordObj[property.name]) editedResult[property.name] = property.text
                        else if (!property.text && wordObj[property.name]) editedResult[property.name] = ''
                    })
                    handleEdit(wordObj.id, editedResult)
                    setEditWord(null)
                    setShowNotification({ message: `已修改 ${wordObj.word}` })
                }}><DoneIcon /></button>
                <button onClick={() => {
                    setEditWord(null)
                    setWord(wordObj.word)
                    // setAlias(wordObj.alias)
                    setDefinitionGroups(wordObj.definitionGroups)
                    // setContext(wordObj.context)
                    setContextInfos(wordObj.contextInfos)
                    setStem(wordObj.stem || '')
                    setShowNotification({ message: `${wordObj.word} 的修改已經取消` })
                }}><CloseIcon /></button>
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
                        {getAllPhrasesInThisContext(wordObj, url) ?
                            <Highlighter highlightWord={wordObj.word} text={getAllPhrasesInThisContext(wordObj, url)[0]} /> :
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
                        {wordObj.definitionGroups.find(group => group.definitionId === getMatchedContextInfos(wordObj, url)[0].definitionRef).aliases[0]}
                    </Typography>
                </>
                }
                secondary={<Typography component={'div'} >
                    <Typography variant='body1' component={'span'}  >
                        {/* {wordObj.context} */}
                        <Highlighter text={getMatchedContextInfos(wordObj, url)[0].context} highlightWord={getAllPhrasesInThisContext(wordObj, url) ? getAllPhrasesInThisContext(wordObj, url)[0] : wordObj.word} />
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