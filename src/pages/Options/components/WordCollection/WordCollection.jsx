import {
  Box,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  Fade,
  useTheme,
  Switch,
  ButtonGroup,
  FormControlLabel,
  Portal,
  Popper,
  IconButton,
  Checkbox,
} from '@mui/material';
import React, { useContext, useState, useMemo, forwardRef } from 'react';
// import relativeTime from 'dayjs/plugin/relativeTime'

import {
  ContextListContext,
  DomainAndLinkListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../../Options.jsx';
import { useContainerQuery } from 'react-container-query';
import { themeStyle } from '../../theme.style';
import styled from '@emotion/styled';
import { TimeModeContainer } from './TimeModeContainer';
import { AlphabeticalOrderModeContainer } from './AlphabeticalOrderModeContainer';
import { OrderByTimeAndSiteContainer } from './OrderByTimeAndSiteContainer';
import { bgcolor } from '@mui/system';
import { DateArrangementPicker } from './DateArrangementPicker';
import { useRef } from 'react';
import { FilterAlt, Star } from '@mui/icons-material';
import { useEffect } from 'react';
import { useCallback } from 'react';

const FadeMotionWrapper = (props) => {
  return (
    <Fade in={props.in || true}>
      <Box>{props.children}</Box>
    </Fade>
  );
};

const ContainerQueryWrapper = forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

export const WordCollection = ({
  filterOption,
  filterKanji,
  displayContext,
  dateArrangement,
  orderMode,
  height,
  width,
  portalRef,
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

  const phraseMode = false;

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
          padding: '10px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <FadeMotionWrapper>
          {(orderMode === 'time' || !orderMode) && (
            <TimeModeContainer
              phraseMode={phraseMode}
              dateArrangement={dateArrangement}
              contextList={filteredContextList}
              domainAndLinkList={domainAndLinkList}
              displayContext={displayContext}
              height={height}
              width={width}
              // containerWidth={containerWidth}
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
              phraseMode={phraseMode}
              contextList={filteredContextList}
              domainAndLinkList={domainAndLinkList}
              columns={displayContext ? contextColumnCount : columnCount}
              height={height}
              width={width}
              displayContext={displayContext}
              // containerWidth={containerWidth}
            />
          )}
        </FadeMotionWrapper>
      </Box>
    </ContainerQueryWrapper>
  );
};

const TimeModeControlPanel = ({
  dateArrangement,
  setDateArrangement,
  displayContext,
  setDisplayContext,
}) => {
  const allArrangementMode = ['date', 'week', 'month'];

  const handleUpdateDateArrangement = (position) => {
    const currentModePosition = allArrangementMode.indexOf(dateArrangement);
    if (position === 'forward') {
      if (currentModePosition === allArrangementMode.length - 1) {
        setDateArrangement(allArrangementMode[0]);
        return;
      }
      setDateArrangement(allArrangementMode[currentModePosition + 1]);
      return;
    }
    if (position === 'backward') {
      if (currentModePosition === 0) {
        setDateArrangement(allArrangementMode[allArrangementMode.length - 1]);
        return;
      }
      setDateArrangement(allArrangementMode[currentModePosition - 1]);
    }
  };

  return (
    <>
      <DateArrangementPicker
        handleUpdateDateArrangement={handleUpdateDateArrangement}
        dateArrangement={dateArrangement}
      />
      <FormControlLabel
        control={
          <Switch
            size="small"
            onChange={() => setDisplayContext(!displayContext)}
            checked={displayContext}
          />
        }
        label="display context"
        labelPlacement="start"
      />
    </>
  );
};

const AlphabeticalControlPanel = ({ filterKanji, setFilterKanji }) => {
  return (
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
  );
};

const ControlPanel = forwardRef((props, ref) => {
  return (
    <Box ref={ref} sx={{ display: 'flex' }}>
      initial
    </Box>
  );
});

// const CheckboxGroup = ({ labelArray, mainLabel, checked, setChecked }) => {

//   const handleCheckParent = (e) => {
//     setChecked(Array(checked.length).fill(e.target.checked));
//   };

//   const handleCheckOne = (value, position) => {
//     const allChecked = [...checked];
//     allChecked[position] = value;
//     setChecked(allChecked);
//   };

//   const children = (
//     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
//       {labelArray.map((label, index) => (
//         <FormControlLabel
//           key={label}
//           label={label}
//           control={
//             <Checkbox
//               checked={checked[index]}
//               onChange={(e) => handleCheckOne(e.target.checked, index)}
//             />
//           }
//         />
//       ))}
//     </Box>
//   );

//   return (
//     <div>
//       <FormControlLabel
//         label={mainLabel}
//         control={
//           <Checkbox
//             checked={checked.findIndex((label) => label === false) === -1}
//             // indeterminate={checked[0] !== checked[1]}
//             onChange={handleCheckParent}
//           />
//         }
//       />
//       {children}
//     </div>
//   );
// };

const TransitionsPopper = ({ filterStarsAndSetter }) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <FilterAlt />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} transition placement="bottom-end">
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box
              sx={{
                border: 1,
                p: 1,
                bgcolor: 'background.paper',
                minWidth: '190px',
              }}
            >
              {/* <CheckboxGroup
                mainLabel="All Stars"
                labelArray={Object.keys(filterStarsAndSetter.filterStars)}
                checked={Object.values(filterStarsAndSetter.filterStars)}
                setChecked={(booleanArray) => {
                  filterStarsAndSetter.setFilterStars({
                    threeStars: booleanArray[0],
                    twoStars: booleanArray[1],
                    oneStar: booleanArray[2],
                  });
                }}
              /> */}
              <Slider
                value={filterStarsAndSetter.filterStars}
                onChange={(e) =>
                  filterStarsAndSetter.setFilterStars(e.target.value)
                }
                defaultValue={0}
                // valueLabelFormat={}
                step={1}
                valueLabelDisplay="auto"
                min={0}
                max={3}
                marks={[
                  {
                    value: 0,
                    label: 'all',
                  },
                  {
                    value: 1,
                    label: <Star />,
                  },
                  {
                    value: 2,
                    label: (
                      <>
                        <Star />
                        <Star />
                      </>
                    ),
                  },
                  {
                    value: 3,
                    label: (
                      <>
                        <Star />
                        <Star />
                        <Star />
                      </>
                    ),
                  },
                ]}
              />
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export const SinglePageWordCollection = ({
  defaultOrderMode,
  defaultDisplayContext,
}) => {
  const [orderMode, setOrderMode] = useState(defaultOrderMode || 'time');
  const [dateArrangement, setDateArrangement] = useState('date');
  const [displayContext, setDisplayContext] = useState(
    defaultDisplayContext || false
  );
  const [filterKanji, setFilterKanji] = useState(false);
  const [filterStars, setFilterStars] = useState(0);

  const handleChange = (event, newOrderMode) => {
    if (!newOrderMode) return;
    setOrderMode(newOrderMode);
  };
  const ControlOrderToggle = () => {
    const theme = useTheme();
    return (
      <ToggleButtonGroup
        size="small"
        color="primary"
        value={orderMode}
        exclusive
        onChange={handleChange}
        sx={{ bgcolor: theme.palette.background.paper }}
      >
        <ToggleButton value="time">time</ToggleButton>
        <ToggleButton value="timeSite">Site</ToggleButton>
        <ToggleButton value="alphabeticalOrder">alphabetical</ToggleButton>
      </ToggleButtonGroup>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ControlOrderToggle />
        <Box sx={{ display: 'flex' }}>
          {orderMode === 'time' && (
            <TimeModeControlPanel
              dateArrangement={dateArrangement}
              setDateArrangement={setDateArrangement}
              displayContext={displayContext}
              setDisplayContext={setDisplayContext}
            />
          )}
          {orderMode === 'alphabeticalOrder' && (
            <AlphabeticalControlPanel
              filterKanji={filterKanji}
              setFilterKanji={setFilterKanji}
            />
          )}
          <TransitionsPopper
            filterStarsAndSetter={{
              filterStars,
              setFilterStars,
            }}
          />
        </Box>
      </Box>
      <WordCollection
        filterOption={{ filterStars }}
        displayContext={displayContext}
        dateArrangement={dateArrangement}
        orderMode={orderMode}
        height="80vh"
        filterKanji={filterKanji}
      />
    </Box>
  );
};
