import { TextField, InputAdornment } from "@mui/material"
import { Search } from "@mui/icons-material"
import React from "react"


export const SearchBar = ({ searchText, handleSearch, myList }) => {

    const allTextSearchResult = (str, list) => {
        console.log(Array.isArray(list))
        if (str.length > 1) {
            const wordResult = list.filter(wordObj => wordObj.word.toLowerCase().includes(str.trim().toLowerCase()))
            const contextResult = list.filter(wordObj => wordObj.context.toLowerCase().includes(str.trim().toLowerCase()))
            const aliasResult = list.filter(wordObj => wordObj.alias.toLowerCase().includes(str.trim().toLowerCase()))
            const meaningResult = list.filter(wordObj => wordObj.meaning.toLowerCase().includes(str.trim().toLowerCase()))
            const pageTitleResult = list.filter(wordObj => wordObj.pageTitle.toLowerCase().includes(str.trim().toLowerCase()))
            return { wordResult, contextResult, aliasResult, meaningResult, pageTitleResult };
        }
        return []
    }

    return <div style={{ position: 'relative', width: '50vw' }}>
        <TextField size="small"
            sx={{ input: { backgroundColor: theme => theme.palette.primary.dark } }}
            variant='outlined'
            value={searchText}
            onChange={handleSearch}
            placeholder="搜尋..."
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end' >
                        <Search />
                    </InputAdornment>
                ),
            }}
        />
        <div style={{ position: 'absolute', backgroundColor: 'white' }}>
            {Array.isArray(allTextSearchResult(searchText, myList).contextResult) ?
                allTextSearchResult(searchText, myList).contextResult.map(wordObj =>
                    <li key={wordObj.id}>{wordObj.context}</li>
                ) :
                ""}
        </div>
    </div>
}