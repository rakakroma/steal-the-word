import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import { getAllMatchTextFromWordObj } from '../../../../utilsForAll/getInfoFromWordObj';
import { WordListContext } from '../../allContext';

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
          ⁉️word data missing
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
