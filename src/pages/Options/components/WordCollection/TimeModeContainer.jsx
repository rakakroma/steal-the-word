import { Box, Portal, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import { arrayWithUrlsByDateType } from '../../utils/transformData';
import { WordCollectionPageBox } from './WordCollectionPageBox';
import { GroupedVirtuoso, Virtuoso } from 'react-virtuoso';
import { ListSubTitle } from './ListSubTitle';
import { getDomainIcon } from './OrderByTimeAndSiteContainer';

export const TimeModeContainer = memo(
  ({
    displayMode,
    phraseMode,
    dateArrangement,
    contextList,
    domainAndLinkList,
    height,
    containerWidth,
    width,
  }) => {
    const OrderedData = arrayWithUrlsByDateType(
      dateArrangement || 'date',
      contextList
    );
    const allYears = Object.keys(OrderedData);
    const dateTitle = (dateArrangement, dateData) => {
      const dateFormatRule = {
        date: 'MMM D',
        week: 'MM/D',
        month: 'MMMM',
      };
      const dateDisplay = dayjs(dateData).format(
        dateFormatRule[dateArrangement]
      );
      const endOfWeek = dayjs(dateData).endOf('week');
      const endOfWeekDisplay = dayjs(dateData).isSame(endOfWeek, 'month')
        ? endOfWeek.format('D')
        : endOfWeek.format('MM/D');
      const masonryDate =
        dateArrangement === 'week'
          ? dateDisplay + '-' + endOfWeekDisplay
          : dateDisplay;
      return masonryDate;
    };
    const theme = useTheme();
    return (
      <Box>
        <GroupedVirtuoso
          groupCounts={Array(allYears.length).fill(1)}
          style={{ height: '84vh', width: width || '100%' }}
          groupContent={(index) => {
            const currentYear = allYears[index];
            const displayYear = currentYear.slice(1);
            return (
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: 'end',
                  backgroundColor: theme.palette.background.default,
                  // borderBottom: '1px solid #ccc',
                }}
              >
                {displayYear}
              </Typography>
            );
          }}
          itemContent={(index, groupIndex) => {
            const currentYear = allYears[groupIndex];
            const currentYearData = OrderedData[currentYear];

            return (
              <Virtuoso
                style={{ height, width: width || '100%' }}
                data={currentYearData}
                itemContent={(index, sortByDateData) => {
                  return (
                    <Box>
                      <ListSubTitle
                        content={dateTitle(
                          dateArrangement,
                          sortByDateData.dateData
                        )}
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
                                // targetWordRef={targetWordRef}
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
            );
          }}
        />
      </Box>
    );
  }
);
