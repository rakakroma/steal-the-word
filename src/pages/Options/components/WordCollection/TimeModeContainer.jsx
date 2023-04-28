import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { arrayWithUrlsByDateType } from '../../utils/transformData';
import { ListSubTitle } from './ListSubTitle';
import { getDomainIcon } from './OrderByTimeAndSiteContainer';
import { WordCollectionPageBox } from './WordCollectionPageBox';

const dateTitle = (dateArrangement, dateData) => {
  const dateFormatRule = {
    date: 'MMM D',
    week: 'MM/D',
    month: 'MMMM',
  };

  const dateDisplay = dayjs(dateData).format(dateFormatRule[dateArrangement]);
  const isCurrentYear = dayjs().isSame(dateData, 'year');

  const yearDisplay = isCurrentYear ? '' : dayjs(dateData).format(', YYYY');

  if (dateArrangement === 'week') {
    const endOfWeek = dayjs(dateData).endOf('week');
    const endOfWeekDisplay = dayjs(dateData).isSame(endOfWeek, 'month')
      ? endOfWeek.format('D')
      : endOfWeek.format('MM/D');
    return dateDisplay + '-' + endOfWeekDisplay + yearDisplay;
  }

  return dateDisplay + yearDisplay;
};

export const TimeModeContainer = memo(
  ({
    displayMode,
    dateArrangement,
    contextList,
    domainAndLinkList,
    containerWidth,
    width,
  }) => {
    const orderedData = arrayWithUrlsByDateType(
      dateArrangement || 'date',
      contextList
    );

    return (
      <Box>
        <Virtuoso
          style={{ height: '84vh', width: width || '100%' }}
          data={orderedData}
          itemContent={(index, sortByDateData) => {
            return (
              <Box>
                <ListSubTitle
                  content={dateTitle(dateArrangement, sortByDateData.dateData)}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {sortByDateData.sortByUrlData
                    .sort((a, b) => a.words.length - b.words.length)
                    .map((arrayWithUrl) => {
                      const iconSrc = getDomainIcon(
                        arrayWithUrl.url,
                        domainAndLinkList
                      );
                      return (
                        <WordCollectionPageBox
                          key={arrayWithUrl.url}
                          imgUri={iconSrc}
                          arrayWithUrl={arrayWithUrl}
                          displayMode={displayMode}
                          containerWidth={containerWidth}
                        />
                      );
                    })}
                </Box>
              </Box>
            );
          }}
        />
      </Box>
    );
  }
);
