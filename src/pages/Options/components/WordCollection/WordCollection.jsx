import { Box, Fade, FormControlLabel, Switch, useTheme } from '@mui/material';
import React, { forwardRef, useContext, useMemo, useState } from 'react';
// import relativeTime from 'dayjs/plugin/relativeTime'

import { useContainerQuery } from 'react-container-query';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordListContext,
} from '../../Options.jsx';
import { AlphabeticalOrderModeContainer } from './AlphabeticalOrderModeContainer';
import { ControlOrderToggle } from './CollectionControlPanel/ControlOrderToggle.jsx';
import { DateArrangementPicker } from './CollectionControlPanel/DateArrangementPicker.jsx';
import { DisplayModeSelect } from './CollectionControlPanel/DisplayModeSelect.jsx';
import { OptionPopper } from './CollectionControlPanel/OptionPopper';
import { OrderByTimeAndSiteContainer } from './OrderByTimeAndSiteContainer';
import { TagsContainer } from './TagsContainer.jsx';
import { TimeModeContainer } from './TimeModeContainer';

const FadeMotionWrapper = (props) => {
  return (
    <Fade in={props.in || true}>
      <Box>{props.children}</Box>
    </Fade>
  );
};

export const ContainerQueryWrapper = forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

export const WordCollection = ({
  filterOption,
  filterKanji,
  displayMode,
  dateArrangement,
  orderMode,
  height,
  width,
}) => {
  const query = {
    300: {
      minWidth: 300,
    },
    450: {
      minWidth: 450,
    },
    600: {
      minWidth: 600,
    },
    720: {
      minWidth: 720,
    },
    900: {
      minWidth: 900,
    },
  };
  const [containerWidth, containerRef] = useContainerQuery(query);
  const theme = useTheme();

  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);
  const wordList = useContext(WordListContext);

  const filteredWordList = useMemo(() => {
    const { filterStars } = filterOption;
    if (filterStars > 0)
      return wordList?.filter((wordObj) => wordObj.stars >= filterStars);
    return wordList;
  }, [wordList, filterOption]);

  const filteredContextList = useMemo(() => {
    if (filteredWordList?.length !== wordList?.length) {
      return contextList.filter((contextObj) => {
        return (
          filteredWordList.findIndex(
            (wordObj) => wordObj.id === contextObj.wordId
          ) > -1
        );
      });
    }
    return contextList;
  }, [wordList, filteredWordList, contextList]);

  if (!contextList || !domainAndLinkList) return <h1>nothing</h1>;

  const columnCount = containerWidth['720']
    ? 5
    : containerWidth['600']
    ? 4
    : containerWidth['450']
    ? 3
    : containerWidth['300']
    ? 2
    : 1;

  const contextColumnCount = containerWidth['900'] ? 2 : 1;

  return (
    <ContainerQueryWrapper ref={containerRef}>
      <Box
        id="word-collection"
        sx={{
          height: height || '75vh',
          width: width || '100%',
          padding: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <FadeMotionWrapper>
          {(orderMode === 'time' || !orderMode) && (
            <TimeModeContainer
              dateArrangement={dateArrangement}
              contextList={filteredContextList}
              domainAndLinkList={domainAndLinkList}
              displayMode={displayMode}
              height={height}
              width={width}
            />
          )}
          {orderMode === 'alphabeticalOrder' && (
            <AlphabeticalOrderModeContainer
              wordList={filteredWordList}
              height={height}
              columns={columnCount}
              filterKanji={filterKanji}
            />
          )}
          {orderMode === 'timeSite' && (
            <OrderByTimeAndSiteContainer
              displayMode={displayMode}
              contextList={filteredContextList}
              domainAndLinkList={domainAndLinkList}
              columns={
                displayMode === 'context' ? contextColumnCount : columnCount
              }
              height={height}
              width={width}
            />
          )}
          {orderMode === 'tags' && (
            <TagsContainer
              displayMode={displayMode}
              wordList={filteredWordList}
              columns={columnCount}
              height={height}
              width={width}
            />
          )}
        </FadeMotionWrapper>
      </Box>
    </ContainerQueryWrapper>
  );
};

export const SinglePageWordCollection = ({ defaultOrderMode }) => {
  const [orderMode, setOrderMode] = useState(defaultOrderMode || 'time');
  const [dateArrangement, setDateArrangement] = useState('date');
  const [displayMode, setDisplayMode] = useState('word');

  const [filterKanji, setFilterKanji] = useState(false);
  const [filterStars, setFilterStars] = useState(0);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <ControlOrderToggle orderMode={orderMode} setOrderMode={setOrderMode} />
        <Box sx={{ display: 'flex' }}>
          {orderMode === 'time' && (
            <DateArrangementPicker
              allArrangementMode={['date', 'week', 'month']}
              setDateArrangement={setDateArrangement}
              dateArrangement={dateArrangement}
            />
          )}
          {['time', 'timeSite', 'tags'].includes(orderMode) && (
            <DisplayModeSelect
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />
          )}
          {orderMode === 'alphabeticalOrder' && (
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  onChange={() => setFilterKanji(!filterKanji)}
                  checked={filterKanji}
                />
              }
              label="include 漢字"
              labelPlacement="start"
            />
          )}
          <OptionPopper
            filterStarsAndSetter={{
              filterStars,
              setFilterStars,
            }}
          />
        </Box>
      </Box>
      <WordCollection
        filterOption={{ filterStars }}
        displayMode={displayMode}
        dateArrangement={dateArrangement}
        orderMode={orderMode}
        height="80vh"
        filterKanji={filterKanji}
      />
    </Box>
  );
};
