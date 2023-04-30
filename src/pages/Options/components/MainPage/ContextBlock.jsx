import {
  Box,
  ButtonBase,
  Grow,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useContext } from 'react';
import { WordInfoDrawerContext } from '../../Options';
import { InfoBlock } from '../DatabaseInfo';
import React from 'react';
import { WordRating } from '../WordCollection/WordInfoDrawer/WordRating';
import { PageTitleSection } from '../WordCollection/PageTitleSection';
import { HighlightedContext } from '../WordCollection/HighlightedContext';
import { DateOfContext } from '../WordCollection/WordInfoDrawer/DateOfContext';
import { Close, Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export const ContextBlock = ({
  targetContext,
  targetWord,
  targetDef,
  iconSrc,
  relativeIndex,
  autoplayProgress,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const { wordInfoTarget, changeWordInfoTarget } = useContext(
    WordInfoDrawerContext
  );
  const handleShowInfo = (boolean) => {
    setShowInfo(boolean);
  };
  const { t } = useTranslation();

  return (
    <InfoBlock
      sx={{
        width: '88%',
        overflow: 'hidden',
        height: '300px',
        alignItems: 'center',
        position: 'absolute',
        transform: `translate(${
          relativeIndex * 100 + relativeIndex + 3
        }%, -100%)`,
        transition: 'transform 0.4s ease-in-out 0s',
        display: 'flex',
      }}
    >
      {relativeIndex === 0 && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            '.MuiLinearProgress-bar': {
              transition: 'transform .2s linear',
            },
          }}
          variant="determinate"
          value={autoplayProgress}
        />
      )}
      <Box sx={{ p: 2 }}>
        <WordRating targetWord={targetWord} />
        <Typography variant={'h6'}>
          <HighlightedContext contextObj={targetContext} wordObj={targetWord} />
          <DateOfContext date={targetContext.date} />
        </Typography>
        <Typography variant="h6">
          <PageTitleSection
            noIcon={false}
            linkUrl={targetContext.url}
            imgUri={iconSrc}
            pageTitle={targetContext.pageTitle}
          />
        </Typography>
      </Box>
      {relativeIndex === 0 && (
        <>
          {' '}
          <ButtonBase
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '5px',
              boxShadow: 2,
              borderRadius: 2,
              padding: 1,
              backgroundColor: '#f9f5f0',
              display: showInfo ? 'none' : 'inline-flex',
            }}
            onClick={() => {
              handleShowInfo(true);
            }}
          >
            {t('more info')}
          </ButtonBase>
          <Grow
            in={showInfo}
            mountOnEnter
            unmountOnExit
            style={{ transformOrigin: 'bottom' }}
          >
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                bottom: '0px',
                width: '100%',
                left: '0',
                minHeight: '100px',
                padding: '9px',
                backgroundColor: 'background.default',
                borderRadius: '10%  10% 0 0',
              }}
            >
              <Typography variant="h6">{targetWord.word}</Typography>
              <Typography variant="subtitle2">
                {targetDef.annotation}
              </Typography>
              <Typography variant="subtitle2">{targetDef.note}</Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '5px',
                }}
              >
                <IconButton
                  onClick={() => {
                    if (
                      wordInfoTarget &&
                      wordInfoTarget.wordId === targetWord.id
                    ) {
                      changeWordInfoTarget(null);
                      return;
                    }
                    changeWordInfoTarget({ wordId: targetWord.id });
                  }}
                >
                  <Search />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleShowInfo(false);
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Paper>
          </Grow>
        </>
      )}
    </InfoBlock>
  );
};
