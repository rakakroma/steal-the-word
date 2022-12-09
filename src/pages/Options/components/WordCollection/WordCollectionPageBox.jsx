import { Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
// import { getDomain } from '../utils/transformData';
import { styled, useTheme } from '@mui/material/styles';
import { SiteIconButton } from './SiteIconButton';
import { WordInfoDrawerContext, WordListContext } from '../../Options';
import { getAllMatchTextFromWordObj } from '../../../../utilsForAll/getInfoFromWordObj';
import '../../../Content/components/customElements/HooliHighlighter';
import { Star } from '@mui/icons-material';

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
          {contextObj.word} word data missing
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

export const WordListInWordCollection = ({ wordsArray, displayContext }) => {
  const { wordInfoTarget, handleWordClick } = useContext(WordInfoDrawerContext);
  const wordList = useContext(WordListContext);

  const dataType = wordsArray[0].wordId ? 'contextObj' : 'wordObj';

  return wordsArray.map((dataObj, index) => {
    const dataWordId = dataType === 'contextObj' ? dataObj.wordId : dataObj.id;
    const wordClickData = {
      wordId: dataWordId,
      contextId: dataType === 'contextObj' ? dataObj.id : null,
    };

    let stars = 0;
    if (dataType === 'contextObj') {
      const wordObj = wordList?.find((wordObj) => wordObj.id === dataWordId);
      if (wordObj?.stars) {
        stars = wordObj.stars;
      }
    } else {
      stars = dataObj.stars;
    }

    return (
      <React.Fragment key={dataObj.id}>
        <SmallWord
          id={dataObj.id}
          // ref={wordInfoTarget?.wordId === contextObj.wordId ? targetWordRef : null}
          sx={{
            color: wordInfoTarget?.wordId === dataWordId ? 'primary.dark' : '',
          }}
          onClick={() => handleWordClick(wordClickData)}
        >
          {displayContext ? (
            <HighlightedContext contextObj={dataObj} />
          ) : (
            dataObj.word
          )}
          {stars ? (
            <>
              {Array(stars)
                .fill(0)
                .map((d, i) => (
                  <Star fontSize="13px" key={i} />
                ))}
            </>
          ) : null}
        </SmallWord>
        {displayContext && index !== wordsArray.length - 1 && (
          <Divider sx={{ pt: '5px', mb: '5px' }} />
        )}
      </React.Fragment>
    );
  });
};

export const WordCollectionPageBox = ({
  displayContext,
  imgUri,
  arrayWithUrl,
  containerWidth,
  noIcon,
}) => {
  const pageBoxWidth = (containerWidth, displayContext) => {
    if (displayContext) {
      if (!containerWidth || containerWidth['600']) return '280px';
      return '100%';
    } else {
      if (!containerWidth || containerWidth['450']) return '180px';
      return '100%';
    }
  };
  const theme = useTheme();
  return (
    <WordCollectionPageBoxContainer
      sx={{
        width: pageBoxWidth(containerWidth, displayContext),
        backgroundColor: theme.palette.background.paper,
      }}
      key={arrayWithUrl[0]}
    >
      <PageTitleSection
        noIcon={noIcon}
        linkUrl={arrayWithUrl.words[0].url}
        imgUri={imgUri}
        pageTitle={arrayWithUrl.words[0].pageTitle}
      />
      <WordListInWordCollection
        wordsArray={arrayWithUrl.words}
        displayContext={displayContext}
      />
    </WordCollectionPageBoxContainer>
  );
};
