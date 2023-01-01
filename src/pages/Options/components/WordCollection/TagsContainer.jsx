import { Box, useTheme } from '@mui/material';
import React, { memo, useContext, useMemo, useRef } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { TagListContext } from '../../Options';
import { EditableTagChip, TagLabelChip } from '../TagChip';
import { IndexQuickRefBox } from './IndexQuickRefBox';
import { ListSubTitle } from './ListSubTitle';
import { WordListInWordCollection } from './WordCollectionPageBox';

export const TagsContainer = memo(
  ({
    // contextList,
    // domainAndLinkList,
    wordList,
    columns,
    height,
    width,
    displayMode,
  }) => {
    const tagList = useContext(TagListContext);

    const tagListAndThereWords = useMemo(
      () =>
        tagList.reduce((accu, curr) => {
          const wordsData = curr.wordDefRefs.reduce((accu, curr) => {
            const wordData = wordList.find(
              (wordObj) => wordObj.id === curr.wordId
            );
            if (wordData) {
              return accu.concat(wordData);
            }
            return accu;
          }, []);
          if (wordsData.length > 0) {
            curr.wordsData = wordsData;
            return accu.concat(curr);
          }
          return accu;
        }, []),
      [tagList, wordList]
    );

    const sortedTagList = useMemo(
      () => tagListAndThereWords.sort((a, b) => a.tag.localeCompare(b.tag)),
      [tagListAndThereWords]
    );

    const theme = useTheme();
    const tagModeVirtuoso = useRef(null);
    const groupCounts = Array(tagListAndThereWords.length).fill(1);

    return (
      <Box>
        <IndexQuickRefBox>
          {sortedTagList.map((tagData, groupIndex) => {
            return (
              <TagLabelChip
                key={tagData.tag}
                tagLabel={tagData.tag}
                onClick={() => {
                  tagModeVirtuoso.current.scrollToIndex({
                    index: groupIndex,
                  });
                }}
              />
            );
          })}
        </IndexQuickRefBox>
        <GroupedVirtuoso
          ref={tagModeVirtuoso}
          groupCounts={groupCounts}
          style={{ height: '65vh', width: width || '100%' }}
          groupContent={(index) => {
            const tagData = tagListAndThereWords[index];
            return (
              <ListSubTitle
                content={
                  <EditableTagChip tagLabel={tagData.tag} tagId={tagData.id} />
                }
                fontSize={'1rem'}
              />
            );
          }}
          itemContent={(index, groupIndex) => {
            const wordObjOfThisTag = tagListAndThereWords[groupIndex].wordsData;

            return (
              <Box sx={{ columnCount: columns, pl: '24px' }}>
                <WordListInWordCollection wordsArray={wordObjOfThisTag} />
              </Box>
            );
          }}
        />
      </Box>
    );
  }
);
