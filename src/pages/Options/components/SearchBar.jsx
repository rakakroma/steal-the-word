import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { db } from '../../Background/database.js';

export const SearchBar = ({ contextList }) => {
  const [searchString, setSearchString] = useState('');
  const [result, setResult] = useState('');

  const handleSearch = (e) => {
    setSearchString(e.target.value);
    if (e.target.value.length > 0) handleSearchData(e.target.value);
  };

  const handleSearchData = async (text) => {
    // const mathchedWord = await db.wordList.where('word').startsWith(text).toArray()
    // console.log(mathchedWord)
    const matchedContext = contextList.filter(
      (contextObj) => contextObj.context.indexOf(text) > -1
    );
    console.log(matchedContext);
  };
  return (
    <div style={{ position: 'relative', width: '50vw' }}>
      <TextField
        size="small"
        sx={{
          input: { backgroundColor: (theme) => theme.palette.primary.dark },
        }}
        variant="outlined"
        value={searchString}
        onChange={handleSearch}
        placeholder="搜尋..."
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <button onClick={handleSearchData}> for test</button>
      <div style={{ position: 'absolute', backgroundColor: 'white' }}>
        {/* {allTextSearchResult(searchText, myList)?.wordResult.map((wordObj)=>{
        return <li key={wordObj.id}>{wordObj.context}</li>
      })} */}
        {/* {Array.isArray(allTextSearchResult(searchText, myList).contextResult)
          ? allTextSearchResult(searchText, myList).contextResult.map(
              (wordObj) => <li key={wordObj.id}>{wordObj.context}</li>
            )
          : ''} */}
      </div>
    </div>
  );
};
