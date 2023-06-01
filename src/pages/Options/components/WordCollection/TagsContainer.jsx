import { Box, useTheme } from '@mui/material';
import React, { memo, useContext, useMemo, useRef } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { TagListContext } from '../../allContext';
import { EditableTagChip, TagLabelChip } from '../TagChip';
import { IndexQuickRefBox } from './IndexQuickRefBox';
import { ListSubTitle } from './ListSubTitle';
import { WordListInWordCollection } from './WordCollectionPageBox';
import { CollectionSettingContext } from './WordCollection';
import { MultiColumnContainer } from './multiColumnContainer';

export const TagsContainer = memo(({ wordList, width }) => {
  const tagList = useContext(TagListContext);
  const { showAnnotation } = useContext(CollectionSettingContext);

  const tagListAndThereWords = useMemo(
    () =>
      tagList.reduce((accu, currTagObj) => {
        const copiedTagObj = { ...currTagObj };
        const wordsData = copiedTagObj.wordDefRefs.reduce(
          (accuWordData, currWordRef) => {
            const wordData = wordList.find(
              (wordObj) => wordObj.id === currWordRef.wordId
            );

            if (!wordData) return accuWordData;
            const copiedWordData = { ...wordData };
            copiedWordData.targetDefId = currWordRef.defId;

            return accuWordData.concat(copiedWordData);
          },
          []
        );
        if (wordsData.length > 0) {
          copiedTagObj.wordsData = wordsData;
          return accu.concat(copiedTagObj);
        }
        return accu;
      }, []),
    [tagList, wordList]
  );

  const sortedTagList = useMemo(
    () => tagListAndThereWords.sort((a, b) => a.tag.localeCompare(b.tag)),
    [tagListAndThereWords]
  );

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
            <MultiColumnContainer showAnnotation={showAnnotation}>
              <WordListInWordCollection wordsArray={wordObjOfThisTag} />
            </MultiColumnContainer>
          );
        }}
      />
    </Box>
  );
});
