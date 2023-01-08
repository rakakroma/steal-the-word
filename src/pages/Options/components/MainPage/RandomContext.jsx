import {
  Box,
  ButtonBase,
  Grow,
  IconButton,
  Paper,
  Rating,
  Slide,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useContext } from 'react';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../../Options';
import { InfoBlock } from '../DatabaseInfo';
import React from 'react';
import { WordRating } from '../WordCollection/WordInfoDrawer/WordRating';
import {
  HighlightedContext,
  PageTitleSection,
} from '../WordCollection/WordCollectionPageBox';
import { getDomainIcon } from '../WordCollection/OrderByTimeAndSiteContainer';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { DateOfContext } from '../WordCollection/WordInfoDrawer/DateOfContext';
import { ChevronLeft, Close, Search } from '@mui/icons-material';
import { useRef } from 'react';

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const ContextBlock = ({
  targetContext,
  targetWord,
  targetDef,
  iconSrc,
  relativeIndex,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const { wordInfoTarget, changeWordInfoTarget } = useContext(
    WordInfoDrawerContext
  );
  const handleShowInfo = (boolean) => {
    setShowInfo(boolean);
  };

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
            more info
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

export const RandomContext = () => {
  const [shuffledArray, setShuffledArray] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayingIndices, setDisplayingIndices] = useState(null);

  const wordList = useContext(WordListContext);
  const contextList = useContext(ContextListContext);
  const domainList = useContext(DomainAndLinkListContext);

  const nextIndex = useCallback(
    (targetIndex) =>
      targetIndex === shuffledArray?.length - 1 ? 0 : targetIndex + 1,
    [shuffledArray]
  );
  const lastIndex = useCallback(
    (targetIndex) =>
      targetIndex === 0 ? shuffledArray?.length - 1 : targetIndex - 1,
    [shuffledArray]
  );

  const toNextIndex = () => {
    if (displayingIndices.indexOf(currentIndex) === 4) return;
    const nextCurrentIndex = nextIndex(currentIndex);
    setCurrentIndex(nextCurrentIndex);
    setTimeout(() => {
      setDisplayingIndices(getDisplayingIndices(nextCurrentIndex));
    }, 500);
  };
  const toLastIndex = () => {
    if (displayingIndices.indexOf(currentIndex) === 0) return;
    const lastCurrentIndex = lastIndex(currentIndex);
    setCurrentIndex(lastCurrentIndex);
    setTimeout(() => {
      setDisplayingIndices(getDisplayingIndices(lastCurrentIndex));
    }, 500);
  };

  const getDisplayingIndices = useCallback(
    (targetIndex) => [
      lastIndex(lastIndex(targetIndex)),
      lastIndex(targetIndex),
      targetIndex,
      nextIndex(targetIndex),
      nextIndex(nextIndex(targetIndex)),
    ],
    [nextIndex, lastIndex]
  );
  const getAndSetShuffledList = useCallback(() => {
    if (!wordList || !contextList) return;
    if (shuffledArray && wordList.length > 0 && contextList.length > 0) return;

    const starAndWordIdList = wordList
      .filter((wordObj) => wordObj.stars && wordObj.stars > 0)
      .map((wordObj) => ({ wordId: wordObj.id, stars: wordObj.stars }));
    const weightedContextIdList = contextList.reduce((newList, contextObj) => {
      const stars = starAndWordIdList?.find(
        (data) => data.wordId === contextObj.wordId
      )?.stars;
      if (stars && stars > 0) {
        for (let count = 0; count < stars; count++) {
          newList.push({ contextId: contextObj.id });
        }
      } else {
        newList.push({ contextId: contextObj.id });
      }
      return newList;
    }, []);

    setShuffledArray(shuffle(weightedContextIdList));
  }, [contextList, wordList, shuffledArray]);

  useEffect(() => {
    getAndSetShuffledList();
  }, [getAndSetShuffledList]);

  useEffect(() => {
    if (!shuffledArray) return;
    setDisplayingIndices(getDisplayingIndices(0));
  }, [shuffledArray, getDisplayingIndices, setDisplayingIndices]);

  if (!wordList || !contextList || !shuffledArray || !displayingIndices)
    return null;

  return (
    <Box
      sx={{
        width: '95vw',
        overflow: 'hidden',
        height: '350px',
        position: 'relative',
        paddingX: 3,
      }}
    >
      <IconButton
        sx={{
          backgroundColor: '#80808047',
          position: 'absolute',
          left: '0px',
          bottom: '30px',
          zIndex: 1000,
        }}
        size="large"
        onClick={toLastIndex}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        sx={{
          backgroundColor: '#80808047',
          position: 'absolute',
          right: '0px',
          bottom: '30px',
          zIndex: 1000,
        }}
        size="large"
        onClick={toNextIndex}
      >
        <ChevronRight />
      </IconButton>
      <Box sx={{ width: '88%', overflow: 'hidden', height: '300px' }}></Box>
      {displayingIndices?.map((selectedIndex, arrayIndex) => {
        const contextObjId = shuffledArray[selectedIndex].contextId;
        const contextObj = contextList.find(
          (contextObj) => contextObj.id === contextObjId
        );
        const wordObj = wordList.find(
          (wordObj) => contextObj.wordId === wordObj.id
        );
        const targetDef = wordObj.definitions.find(
          (definition) => definition.definitionId === contextObj.definitionRef
        );
        const iconSrc = getDomainIcon(contextObj.url, domainList);
        const relativeIndex =
          arrayIndex - displayingIndices.indexOf(currentIndex);
        return (
          <ContextBlock
            key={contextObj.id}
            targetContext={contextObj}
            targetWord={wordObj}
            targetDef={targetDef}
            iconSrc={iconSrc}
            selectedIndex={selectedIndex}
            relativeIndex={relativeIndex}
          />
        );
      })}
    </Box>
  );
};
