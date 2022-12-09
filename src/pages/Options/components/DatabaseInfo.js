import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../Options.jsx';

const randomNumberByDate = () => {
  const date = new Date();
  return date.getFullYear() * date.getDate() * (date.getMonth() + 3298689309);
};

const wordOfToday = (wordList) => {
  if (!wordList || wordList.length === 0) return 'none';
  const randomIndexByDate = randomNumberByDate() % wordList?.length;
  return wordList[randomIndexByDate];
};

export const DatabaseInfo = () => {
  const contextList = useContext(ContextListContext);
  //   const domainAndLinkList = useContext(DomainAndLinkListContext);
  const wordList = useContext(WordListContext);

  const { handleWordClick } = useContext(WordInfoDrawerContext);
  const todaysWord = wordOfToday(wordList);
  return (
    <Box sx={{ display: 'flex' }}>
      <SimpleInfoBox title="words" content={wordList?.length} />
      <SimpleInfoBox title="contexts" content={contextList?.length} />
      <SimpleInfoBox
        handleClick={() => handleWordClick({ wordId: todaysWord.id })}
        title="word Of today"
        content={todaysWord.word}
      />
    </Box>
  );
};

const SimpleInfoBox = ({ title, content, handleClick }) => {
  return (
    <Box
      sx={{
        border: '1px solid black',
        borderRadius: '7px',
        padding: '8px',
        minWidth: '120px',
        maxWidth: '230px',
        margin: '10px',
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>
      <Typography
        variant="h5"
        sx={{ textAlign: 'center' }}
        onClick={handleClick}
      >
        {content}
      </Typography>
    </Box>
  );
};
