import { styled } from '@mui/system';

import { Box, Link, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../Options.jsx';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, Collections, Settings } from '@mui/icons-material';

const randomNumberByDate = () => {
  const date = new Date();
  return date.getFullYear() * date.getDate() * (date.getMonth() + 3298689309);
};

const wordOfToday = (wordList) => {
  if (!wordList || wordList.length === 0) return 'none';
  const randomIndexByDate = randomNumberByDate() % wordList?.length;
  return wordList[randomIndexByDate];
};

export const TodaysWordBox = () => {
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
    <CoolInfoBox
      handleClick={() => handleWordClick({ wordId: theTodaysWord.id })}
      title="word Of today"
      content={theTodaysWord.word}
    />
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
      <Typography variant="h4" sx={{ color: 'text.primary' }}>
        {content}
      </Typography>
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

export const CountBox = () => {
  const wordList = useContext(WordListContext);
  const contextList = useContext(ContextListContext);
  return (
    <CoolInfoBox
      title="words"
      content={wordList?.length}
      additionalNumber={contextList?.length}
      additionalInfo={'contexts'}
    />
  );
};

export const NavToSettingsPage = () => {
  return (
    <CoolInfoBox
      title={<Settings />}
      content={
        <Link component={RouterLink} to="/home/settings">
          Settings
          <ArrowRight />
        </Link>
      }
      additionalInfo={'backup / customize'}
    />
  );
};

export const NavToCollection = () => {
  return (
    <CoolInfoBox
      title={<Collections />}
      content={
        <Link component={RouterLink} to="/home/collection">
          Collection
          <ArrowRight />
        </Link>
      }
      additionalInfo={'browse'}
    />
  );
};
