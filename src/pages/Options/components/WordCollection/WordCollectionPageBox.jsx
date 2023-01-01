import { Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
// import { getDomain } from '../utils/transformData';
import { styled, useTheme } from '@mui/material/styles';
import { SiteIconButton } from './SiteIconButton';
import { WordInfoDrawerContext, WordListContext } from '../../Options';
import { getAllMatchTextFromWordObj } from '../../../../utilsForAll/getInfoFromWordObj';
import '../../../Content/components/customElements/WordBlock/HooliHighlighter';
import { Star } from '@mui/icons-material';
import dayjs from 'dayjs';

const SmallWord = styled(Box)(({ theme }) => ({
  wordBreak: 'break-word',
  p: '5px',
  ' &:hover': {
    color: 'indianred',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

export const WordCollectionPageBoxContainer = styled(Box)(({ theme }) => ({
  // border: '1px solid #bebebe',
  padding: '5px',
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  // width: '20%',
  minWidth: '200px',
  height: 'fit-content',
}));

const PageTitleSection = ({ pageTitle, imgUri, linkUrl, noIcon }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex' }}>
      {!noIcon && (
        <SiteIconButton iconUri={imgUri} linkUrl={linkUrl} iconSize={20} />
      )}
      <Typography
        variant="body2"
        sx={{
          pl: '2px',
          display: 'inline-block',
          color: 'gray',
          height: '1.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {pageTitle}
      </Typography>
    </Box>
  );
};

const HighlightedContext = ({ contextObj }) => {
  const wordList = useContext(WordListContext);

  let matchWord;
  if (contextObj.phrase) {
    matchWord = contextObj.phrase;
  } else {
    const wordObj = wordList?.find(
      (wordObj) => wordObj.id === contextObj.wordId
    );
    if (!wordObj || !wordObj.word)
      return (
        <Typography variant="subtitle1" component="div">
          word data missing
        </Typography>
      );
    const allMatchText = getAllMatchTextFromWordObj(wordObj);
    matchWord = allMatchText.find(
      (matchText) => contextObj.context.indexOf(matchText) > -1
    );
  }

  return (
    <hooli-highlighter
      text={contextObj.context}
      matchword={matchWord}
    ></hooli-highlighter>
  );
};

export const WordListInWordCollection = ({
  wordsArray,
  displayMode,
  showDivider,
}) => {
  const { wordInfoTarget, handleWordClick } = useContext(WordInfoDrawerContext);
  const wordList = useContext(WordListContext);

  const dataType = wordsArray[0]?.wordId ? 'contextObj' : 'wordObj';

  return wordsArray.map((dataObj, index) => {
    const wordObj =
      dataType === 'wordObj'
        ? dataObj
        : wordList?.find((wordObj) => wordObj.id === dataObj.wordId);

    if (!wordObj) {
      console.error(dataObj.wordId);
      //FIXME: maybe i should just delete that data?
      return null;
    }
    const wordClickData = {
      wordId: wordObj.id,
      contextId: dataType === 'contextObj' ? dataObj.id : null,
    };

    return (
      <React.Fragment key={dataObj.id}>
        <SmallWord
          id={dataObj.id}
          sx={{
            color: wordInfoTarget?.wordId === wordObj.id ? 'primary.dark' : '',
          }}
          onClick={() => handleWordClick(wordClickData)}
        >
          {displayMode === 'context' && (
            <HighlightedContext contextObj={dataObj} />
          )}
          {displayMode === 'phrase'
            ? dataObj.phrase || wordObj.word
            : wordObj.word}
          {wordObj.stars ? (
            <>
              {Array(wordObj.stars)
                .fill(0)
                .map((d, i) => (
                  <Star fontSize="13px" key={i} />
                ))}
            </>
          ) : null}
        </SmallWord>
        {showDivider &&
          displayMode !== 'word' &&
          index !== wordsArray.length - 1 && (
            <Divider sx={{ pt: '5px', mb: '5px' }} />
          )}
      </React.Fragment>
    );
  });
};

const DateInfo = ({ date }) => {
  const dateContent = dayjs(date).isSame(dayjs(), 'year')
    ? dayjs(date).format('MMM D')
    : dayjs(date).format('MMM D,YY');

  return (
    <Typography
      sx={{
        color: '#999999',
        position: 'absolute',
        top: '-12px',
        right: '6px',
        fontSize: '12px',
      }}
    >
      {dateContent}
    </Typography>
  );
};

export const WordCollectionPageBox = ({
  displayMode,
  imgUri,
  arrayWithUrl,
  // containerWidth,
  showDate,
  noIcon,
}) => {
  const theme = useTheme();
  return (
    <WordCollectionPageBoxContainer
      sx={{
        position: 'relative',
        width:
          displayMode === 'context'
            ? '280px'
            : displayMode === 'phrase'
            ? '220px'
            : '180px',
        backgroundColor: theme.palette.background.paper,
      }}
      key={arrayWithUrl[0]}
    >
      {showDate && <DateInfo date={arrayWithUrl.words[0].date} />}
      <PageTitleSection
        noIcon={noIcon}
        linkUrl={arrayWithUrl.words[0].url}
        imgUri={imgUri}
        pageTitle={arrayWithUrl.words[0].pageTitle}
      />
      <WordListInWordCollection
        showDivider={true}
        wordsArray={arrayWithUrl.words}
        displayMode={displayMode}
      />
    </WordCollectionPageBoxContainer>
  );
};
