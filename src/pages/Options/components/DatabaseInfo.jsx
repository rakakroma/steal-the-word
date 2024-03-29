import { styled } from '@mui/system';

import { ArrowRight, Collections, Settings } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  ContextListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../allContext.jsx';
import { useTranslation } from 'react-i18next';

dayjs.extend(utc);

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
  const wordList = useContext(WordListContext);
  const { t } = useTranslation();

  const { handleWordClick } = useContext(WordInfoDrawerContext);

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
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    document.cookie = `todaysWord=${
      generatedTodaysWord.id
    }; expires=${endOfToday.toUTCString()};`;

    setTheTodaysWord(generatedTodaysWord);
  }, [setTheTodaysWord, wordList]);

  if (!theTodaysWord) return null;
  return (
    <CoolInfoBox
      handleClick={() => handleWordClick({ wordId: theTodaysWord.id })}
      title={t('word Of today')}
      content={theTodaysWord.word}
      stopCapitalize={true}
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
    minHeight: '120px',
  })
);

const CoolInfoBox = ({
  title,
  content,
  additionalNumber,
  additionalInfo,
  stopCapitalize,
  handleClick,
}) => {
  return (
    <InfoBlock onClick={handleClick}>
      <Box sx={{ color: 'text.secondary' }}>{title}</Box>
      <Typography
        variant="h5"
        sx={{
          color: 'text.primary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textTransform: stopCapitalize ? 'none' : 'capitalize',
        }}
      >
        {content}
      </Typography>
      {additionalNumber && (
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
      )}
      <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 14 }}>
        {additionalInfo}
      </Box>
    </InfoBlock>
  );
};

export const CountBox = () => {
  const wordList = useContext(WordListContext);
  const contextList = useContext(ContextListContext);

  const { t } = useTranslation();
  return (
    <CoolInfoBox
      title={t('words')}
      content={wordList?.length}
      additionalNumber={contextList?.length}
      additionalInfo={t('contexts')}
    />
  );
};

export const NavToSettingsPage = () => {
  const { t } = useTranslation();
  return (
    <CoolInfoBox
      title={<Settings />}
      content={
        <Link component={RouterLink} to="/home/settings">
          {t('settings')}
          <ArrowRight />
        </Link>
      }
      additionalInfo={t('backup / customize')}
    />
  );
};

export const NavToCollection = () => {
  const { t } = useTranslation();
  return (
    <CoolInfoBox
      title={<Collections />}
      content={
        <Link component={RouterLink} to="/home/collection">
          {t('collection')}
          <ArrowRight />
        </Link>
      }
      additionalInfo={t('browse')}
    />
  );
};
