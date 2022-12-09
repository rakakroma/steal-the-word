import { Box, Button } from '@mui/material';
import React, { memo, useRef } from 'react';
import { wordListInAlphabeticalOrder } from '../../utils/transformData';
import { WordListInWordCollection } from './WordCollectionPageBox';
import { GroupedVirtuoso } from 'react-virtuoso';
import { ListSubTitle } from './ListSubTitle';
import { IndexQuickRefBox } from './IndexQuickRefBox';

export const AlphabeticalOrderModeContainer = memo(
  ({ wordList, width, columns, filterKanji }) => {
    const myListInAlphabeticalOrder = wordListInAlphabeticalOrder(wordList);
    const regexHan = new RegExp(/\p{sc=Hani}/gu);

    const allFirstAlphabet = Array.from(
      new Set(myListInAlphabeticalOrder.map((wordObj) => wordObj.word[0]))
    );
    const firstAlphabetArray = filterKanji
      ? allFirstAlphabet
      : allFirstAlphabet.filter(
          (firstAlphabet) => !firstAlphabet.match(regexHan)
        );

    const alphabeticalVirtuoso = useRef(null);

    const groupCounts = Array(firstAlphabetArray.length).fill(1);
    return (
      <Box>
        <IndexQuickRefBox>
          {firstAlphabetArray.map((itemIndex, groupIndex) => (
            <Button
              sx={{ minWidth: 'auto', textTransform: 'none' }}
              key={groupIndex}
              onClick={(e) => {
                e.preventDefault();
                alphabeticalVirtuoso.current.scrollToIndex({
                  index: groupIndex,
                });
              }}
            >
              {firstAlphabetArray[groupIndex]}
            </Button>
          ))}
        </IndexQuickRefBox>
        <GroupedVirtuoso
          ref={alphabeticalVirtuoso}
          groupCounts={groupCounts}
          style={{ height: '60vh', width: width || '100%' }}
          groupContent={(index) => {
            return (
              <ListSubTitle
                content={firstAlphabetArray[index]}
                fontSize={'1.5rem'}
              />
            );
          }}
          itemContent={(index, groupIndex) => {
            const firstAlphabet = firstAlphabetArray[groupIndex];

            return (
              <Box sx={{ columnCount: columns, pl: '24px' }}>
                <WordListInWordCollection
                  wordsArray={myListInAlphabeticalOrder.filter(
                    (wordObj) => wordObj.word[0] === firstAlphabet
                  )}
                />
              </Box>
            );
          }}
        />
      </Box>
    );
  }
);
