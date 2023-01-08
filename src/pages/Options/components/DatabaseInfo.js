import { styled } from '@mui/system';

import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../Options.jsx';
import dayjs from 'dayjs';

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
  const [theTodaysWord, setTheTodaysWord] = useState(null);
  const contextList = useContext(ContextListContext);
  //   const domainAndLinkList = useContext(DomainAndLinkListContext);
  const wordList = useContext(WordListContext);

  const { handleWordClick } = useContext(WordInfoDrawerContext);
  // const todaysWord = wordOfToday(wordList);

  useEffect(() => {
    if (!wordList) return;
    const wordById = (id) => {
      return wordList.find((wordObj) => wordObj.id === id);
    };
    const cookies = document.cookie
      ?.split(';')
      .map((cookieString) => cookieString.trim());
    const todaysWordIdInCookies = cookies
      .find((cookie) => cookie.startsWith('todaysWord='))
      ?.split('=')[1];
    const todaysWord = wordById(todaysWordIdInCookies);
    if (todaysWord) {
      setTheTodaysWord(todaysWord);
      return;
    }
    const generatedTodaysWord = wordOfToday(wordList);
    const endOfToday = dayjs().endOf('day').format();
    document.cookie = `todaysWord=${generatedTodaysWord.id}; expires=${endOfToday}`;

    setTheTodaysWord(generatedTodaysWord);
  }, [setTheTodaysWord, wordList]);

  if (!theTodaysWord) return null;
  return (
    <Box sx={{ display: 'flex' }}>
      <CoolInfoBox
        title="words"
        content={wordList?.length}
        additionalNumber={contextList?.length}
        additionalInfo={'contexts'}
      />
      {/* <CoolInfoBox title="contexts" content={contextList?.length} /> */}
      <CoolInfoBox
        handleClick={() => handleWordClick({ wordId: theTodaysWord.id })}
        title="word Of today"
        content={theTodaysWord.word}
      />
    </Box>
  );
};

export const InfoBlock = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    backgroundColor: 'background.paper',
    boxShadow: 1,
    borderRadius: 2,
    p: 2,
    minWidth: '200px',
  })
);

const CoolInfoBox = ({ title, content, additionalNumber, additionalInfo }) => {
  return (
    <InfoBlock>
      <Box sx={{ color: 'text.secondary' }}>{title}</Box>
      <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
        {content}
      </Box>
      <Box
        sx={{
          color: 'success.dark',
          display: 'inline',
          fontWeight: 'bold',
          mx: 0.5,
          fontSize: 14,
        }}
      >
        {additionalNumber}
      </Box>
      <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
        {additionalInfo}
      </Box>
    </InfoBlock>
  );
};
