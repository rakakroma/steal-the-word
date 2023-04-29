import { Star } from '@mui/icons-material';
import { Divider, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { Fragment, useContext } from 'react';
import { getAllMatchTextFromWordObj } from '../../../../utilsForAll/getInfoFromWordObj';
import '../../../Content/components/customElements/WordBlock/HooliHighlighter';
import { WordInfoDrawerContext, WordListContext } from '../../Options';
import { SiteIconButton } from './SiteIconButton';
import { CollectionSettingContext } from './WordCollection';

const SmallWord = styled(Box)(({ theme }) => ({
  wordBreak: 'break-word',
  fontWeight: 500,
  ' &:hover': {
    color: 'indianred',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

export const WordCollectionPageBoxContainer = styled(Box)(({ theme }) => ({
  padding: '5px',
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  minWidth: '200px',
  height: 'fit-content',
}));

export const PageTitleSection = ({ pageTitle, imgUri, linkUrl, noIcon }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {!noIcon && (
        <SiteIconButton iconUri={imgUri} linkUrl={linkUrl} iconSize={20} />
      )}
      <Tooltip title={pageTitle} placement="right" arrow disableInteractive>
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
      </Tooltip>
    </Box>
  );
};

export const HighlightedContext = ({ contextObj, wordObj }) => {
  const wordList = useContext(WordListContext);
  const wordObjFromList = wordList?.find(
    (wordObj) => wordObj.id === contextObj.wordId
  );

  let matchWord;
  if (contextObj.phrase) {
    matchWord = contextObj.phrase;
  } else {
    if (!wordObj && !wordObjFromList)
      return (
        <Typography variant="subtitle1" component="div">
          word data missing
        </Typography>
      );

    const allMatchText = getAllMatchTextFromWordObj(wordObj || wordObjFromList);
    matchWord = allMatchText.find(
      (matchText) => contextObj.context.indexOf(matchText) > -1
    );
  }

  return (
    <hooli-highlighter
      text={contextObj.context}
      matchWord={matchWord}
    ></hooli-highlighter>
  );
};

export const WordListInWordCollection = ({ wordsArray, showDivider }) => {
  const { wordInfoTarget, handleWordClick } = useContext(WordInfoDrawerContext);
  const wordList = useContext(WordListContext);
  const { showAnnotation, displayMode } = useContext(CollectionSettingContext);

  const dataType = wordsArray[0]?.wordId ? 'contextObj' : 'wordObj';

  return wordsArray.map((dataObj, index) => {
    const wordObj =
      dataType === 'wordObj'
        ? dataObj
        : wordList?.find((wordObj) => wordObj.id === dataObj.wordId);

    if (!wordObj) {
      console.error('no word!:' + dataObj.wordId);
      //FIXME: maybe i should just delete that data?
      return null;
    }
    const wordClickData = {
      wordId: wordObj.id,
      contextId: dataType === 'contextObj' ? dataObj.id : null,
    };

    const currentDefId =
      dataType === 'contextObj'
        ? dataObj.definitionRef
        : dataObj.targetDefId || null;
    return (
      <Fragment key={dataObj.id}>
        <SmallWord
          id={dataObj.id}
          sx={{
            color: wordInfoTarget?.wordId === wordObj.id && 'primary.dark',
            backgroundColor: wordInfoTarget?.wordId === wordObj.id && '#f9f9f9',
          }}
          onClick={() => handleWordClick(wordClickData)}
        >
          {displayMode === 'context' ? (
            <HighlightedContext contextObj={dataObj} />
          ) : displayMode === 'phrase' ? (
            dataObj.phrase || wordObj.word
          ) : (
            wordObj.word
          )}
          {wordObj?.stars > 0 && (
            <>
              {Array(wordObj.stars)
                .fill(0)
                .map((d, i) => (
                  <Star fontSize="13px" key={i} />
                ))}
            </>
          )}
          {showAnnotation &&
            (currentDefId !== null ? (
              <Typography sx={{ color: 'gray' }}>
                {
                  wordObj.definitions.find(
                    (def) => def.definitionId === currentDefId
                  )?.annotation
                }
              </Typography>
            ) : (
              wordObj.definitions.map((def, i) => {
                return (
                  <Fragment key={def.definitionId}>
                    <Typography sx={{ color: 'gray' }}>
                      {def.annotation}
                    </Typography>
                    {/* {i !== wordObj.definitions.length - 1 && (
                      <Divider sx={{ pt: '2px', mb: '2px' }} />
                    )} */}
                  </Fragment>
                );
              })
            ))}
        </SmallWord>

        {showDivider &&
          displayMode !== 'word' &&
          index !== wordsArray.length - 1 && (
            <Divider sx={{ pt: '5px', mb: '5px' }} />
          )}
      </Fragment>
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
  imgUri,
  arrayWithUrl,
  showDate,
  noIcon,
}) => {
  const theme = useTheme();
  const { displayMode, showAnnotation } = useContext(CollectionSettingContext);
  return (
    <WordCollectionPageBoxContainer
      sx={{
        position: 'relative',
        width: showAnnotation
          ? '350px'
          : displayMode === 'context'
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
      />
    </WordCollectionPageBoxContainer>
  );
};
