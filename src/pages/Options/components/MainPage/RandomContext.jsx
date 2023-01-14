import { ChevronLeft, Pause, PlayArrow } from '@mui/icons-material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordListContext,
} from '../../Options';
import { useInterval, useVisible } from '../../utils/customHook';
import { getDomainIcon } from '../WordCollection/OrderByTimeAndSiteContainer';
import { ContextBlock } from './ContextBlock';

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

export const RandomContext = () => {
  const [shuffledArray, setShuffledArray] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayingIndices, setDisplayingIndices] = useState(null);
  const [autoUpdateDelay, setAutoUpdateDelay] = useState(4500);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoplayProgress, setAutoPlayProgress] = useState(0);

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
    if (shuffledArray.length > 5) {
      setTimeout(() => {
        setDisplayingIndices(getDisplayingIndices(nextCurrentIndex));
      }, 500);
    }
    setAutoPlayProgress(0);
  };
  const toLastIndex = () => {
    if (displayingIndices.indexOf(currentIndex) === 0) return;
    const lastCurrentIndex = lastIndex(currentIndex);
    setCurrentIndex(lastCurrentIndex);
    if (shuffledArray.length > 5) {
      setTimeout(() => {
        setDisplayingIndices(getDisplayingIndices(lastCurrentIndex));
      }, 500);
    }
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
    if (!wordList || !contextList || contextList.length === 0) return;
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
    if (shuffledArray.length < 5) {
      setDisplayingIndices(
        Array(shuffledArray.length)
          .fill()
          .map((_, i) => i)
      );
      return;
    }
    setDisplayingIndices(getDisplayingIndices(0));
  }, [shuffledArray, getDisplayingIndices, setDisplayingIndices]);

  //FIXME:it did not work well when the context length is under 5
  const keyDownHandler = (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    let noTextInput = true;
    document.querySelectorAll('input').forEach((ele) => {
      if (ele.type === 'text') {
        noTextInput = false;
        return;
      }
    });
    if (!noTextInput) return;
    if (e.key === 'ArrowLeft') {
      toLastIndex();
    } else if (e.key === 'ArrowRight') {
      toNextIndex();
    }
  };
  useEffect(() => {
    document.addEventListener('keyup', keyDownHandler);
    return () => {
      document.removeEventListener('keyup', keyDownHandler);
    };
  });

  const handleAutoUpdate = () => {
    setAutoPlayProgress(0);
    setIsAutoPlaying((value) => !value);
  };

  useInterval(
    () => {
      toNextIndex();
    },
    isAutoPlaying ? autoUpdateDelay : null
  );

  useInterval(
    () => {
      setAutoPlayProgress((oldValue) => oldValue + 4.15);
    },
    isAutoPlaying ? autoUpdateDelay / 25 : null
  );

  useVisible(
    () => {},
    () => {
      setIsAutoPlaying(false);
      setAutoPlayProgress(0);
    }
  );

  if (!wordList || !contextList || !shuffledArray || !displayingIndices)
    return null;

  if (contextList.length === 0) return <div>cool</div>;
  return (
    <Box
      sx={{
        width: '95vw',
        overflow: 'hidden',
        height: '450px',
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

      <Typography variant="h5">Random Context</Typography>
      <LinearProgress
        sx={{
          width: '93.5%',
          ml: '3%',
          '.MuiLinearProgress-bar': {
            transition: 'transform .2s linear',
          },
        }}
        variant="determinate"
        value={autoplayProgress}
      />
      <Button
        variant="contained"
        sx={{
          //   backgroundColor: '#80808047',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          left: '50%',
          bottom: '30px',
          zIndex: 1000,
        }}
        onClick={handleAutoUpdate}
      >
        {isAutoPlaying ? <Pause /> : <PlayArrow />}
      </Button>
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
