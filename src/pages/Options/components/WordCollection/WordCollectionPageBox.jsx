import { Star } from '@mui/icons-material';
import { Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { Fragment, useContext } from 'react';
import '../../../Content/components/customElements/WordBlock/HooliHighlighter';
import {
  OrderModeANdSiteTargetContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../../allContext';
import { CollectionSettingContext } from './WordCollection';
import { HighlightedContext } from './HighlightedContext';
import { PageTitleSection } from './PageTitleSection';

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

export const WordListInWordCollection = ({ wordsArray, showDivider }) => {
  const { wordInfoTarget, handleWordClick } = useContext(WordInfoDrawerContext);
  const wordList = useContext(WordListContext);
  const { showAnnotation, displayMode } = useContext(CollectionSettingContext);
  const { orderMode } = useContext(OrderModeANdSiteTargetContext);

  const showHighlightedContext =
    ['time', 'timeSite'].includes(orderMode) && displayMode === 'context';
  const showPhraseFirst =
    ['time', 'timeSite'].includes(orderMode) && displayMode === 'phrase';

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
          {showHighlightedContext && (
            <HighlightedContext contextObj={dataObj} />
          )}
          {showPhraseFirst ? dataObj.phrase || wordObj.word : wordObj.word}
          {wordObj?.stars > 0 && (
            <>
              {Array(wordObj.stars)
                .fill(0)
                .map((d, i) => (
                  <Star fontSize="13px" key={i} sx={{ color: '#f76583' }} />
                ))}
            </>
          )}
          {showAnnotation &&
            (currentDefId !== null ? (
              <Typography sx={{ color: 'text.secondary' }}>
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
                    <Typography sx={{ color: 'text.secondary' }}>
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

        backgroundColor: 'background.paper',
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
