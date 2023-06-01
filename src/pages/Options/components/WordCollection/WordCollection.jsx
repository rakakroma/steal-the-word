import {
  Box,
  Fade,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ContextListContext,
  DomainAndLinkListContext,
  OrderModeANdSiteTargetContext,
  WordListContext,
} from '../../allContext.jsx';
import { AlphabeticalOrderModeContainer } from './AlphabeticalOrderModeContainer';
import { ControlOrderToggle } from './CollectionControlPanel/ControlOrderToggle.jsx';
import { DateArrangementPicker } from './CollectionControlPanel/DateArrangementPicker.jsx';
import { DisplayModeSelect } from './CollectionControlPanel/DisplayModeSelect.jsx';
import { OptionPopper } from './CollectionControlPanel/OptionPopper';
import { OrderByTimeAndSiteContainer } from './OrderByTimeAndSiteContainer';
import { TagsContainer } from './TagsContainer.jsx';
import { TimeModeContainer } from './TimeModeContainer';
import { useTranslation } from 'react-i18next';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
const FadeMotionWrapper = (props) => {
  return (
    <Fade in={props.in || true}>
      <Box>{props.children}</Box>
    </Fade>
  );
};

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

export const CollectionSettingContext = createContext(null);

export const SinglePageWordCollection = () => {
  const [dateArrangement, setDateArrangement] = useState('date');
  const [displayMode, setDisplayMode] = useState('word');
  const [filterKanji, setFilterKanji] = useState(false);
  const [filterStars, setFilterStars] = useState(0);
  const [showAnnotation, setShowAnnotation] = useState(true);

  const { orderMode, setOrderMode } = useContext(OrderModeANdSiteTargetContext);
  const { t } = useTranslation();

  // get cookie
  useEffect(() => {
    const cookies = document.cookie
      ?.split(';')
      .map((cookieString) => cookieString.trim());
    const displayModeCookie = cookies
      .find((cookie) => cookie.startsWith('displayMode='))
      ?.split('=')[1];
    const showAnnotationCookie = cookies
      .find((cookie) => cookie.startsWith('showAnno='))
      ?.split('=')[1];

    if (
      displayModeCookie &&
      ['word', 'phrase', 'context'].includes(displayModeCookie)
    ) {
      setDisplayMode(displayModeCookie);
    }
    if (['true', 'false'].includes(showAnnotationCookie)) {
      setShowAnnotation(showAnnotationCookie === 'true');
    }
  }, []);

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
        <Box sx={{ display: 'flex', mt: 1 }}>
          <Tooltip title={t('show annotation')} placement="bottom">
            <FormControlLabel
              control={
                <Switch
                  onChange={() => {
                    document.cookie = `showAnno=${!showAnnotation}`;
                    setShowAnnotation(!showAnnotation);
                  }}
                  checked={showAnnotation}
                />
              }
              label={
                <TextSnippetIcon
                  sx={{ color: 'text.secondary', verticalAlign: 'middle' }}
                />
              }
              labelPlacement="end"
            />
          </Tooltip>
          {orderMode === 'time' && (
            <DateArrangementPicker
              allArrangementMode={['date', 'week', 'month']}
              setDateArrangement={setDateArrangement}
              dateArrangement={dateArrangement}
            />
          )}
          {['time', 'timeSite'].includes(orderMode) && (
            <DisplayModeSelect
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />
          )}
          {orderMode === 'alphabeticalOrder' && (
            <Tooltip title={t('include_kanji')} placement="bottom">
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => setFilterKanji(!filterKanji)}
                    checked={filterKanji}
                  />
                }
                label={
                  <Typography sx={{ color: 'text.secondary' }}>漢</Typography>
                }
                labelPlacement="end"
              />
            </Tooltip>
          )}
          <OptionPopper
            filterStarsAndSetter={{
              filterStars,
              setFilterStars,
            }}
          />
        </Box>
      </Box>
      <CollectionSettingContext.Provider
        value={{
          displayMode,
          dateArrangement,
          filterKanji,
          showAnnotation,
        }}
      >
        <WordCollection
          height="80vh"
          filterStars={filterStars}
          orderMode={orderMode}
        />
      </CollectionSettingContext.Provider>
    </Box>
  );
};

export const WordCollection = ({ height, width, filterStars, orderMode }) => {
  // const [containerWidth, containerRef] = useContainerQuery(query);
  const theme = useTheme();

  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);
  const wordList = useContext(WordListContext);
  const { showAnnotation } = useContext(CollectionSettingContext);

  const filteredWordList = useMemo(() => {
    if (filterStars > 0)
      return wordList?.filter((wordObj) => wordObj.stars >= filterStars);
    return wordList;
  }, [wordList, filterStars]);

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

  return (
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
            contextList={filteredContextList}
            domainAndLinkList={domainAndLinkList}
            width={width}
          />
        )}
        {orderMode === 'alphabeticalOrder' && (
          <AlphabeticalOrderModeContainer wordList={filteredWordList} />
        )}
        {orderMode === 'timeSite' && (
          <OrderByTimeAndSiteContainer
            contextList={filteredContextList}
            domainAndLinkList={domainAndLinkList}
            width={width}
          />
        )}
        {orderMode === 'tags' && (
          <TagsContainer wordList={filteredWordList} width={width} />
        )}
      </FadeMotionWrapper>
    </Box>
  );
};
