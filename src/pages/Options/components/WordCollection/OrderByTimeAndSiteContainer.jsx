import { Box, Chip, Typography, useTheme } from '@mui/material';
import React, { memo, useRef } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { cutUrl, domainPageWords } from '../../utils/transformData';
import { IndexQuickRefBox } from './IndexQuickRefBox';
import { ListSubTitle } from './ListSubTitle';
import { SiteIconAvatar } from './SiteIconButton';
import { WordCollectionPageBox } from './WordCollectionPageBox';

export const OrderByTimeAndSiteContainer = memo(
  ({
    phraseMode,
    contextList,
    domainAndLinkList,
    columns,
    height,
    width,
    displayMode,
    // displayContext,
    // containerWidth,
  }) => {
    const getDomainIcon = (url) => {
      return domainAndLinkList.find(
        (domainAndLinkObj) => domainAndLinkObj.url === url
      )?.icon;
    };
    const wordsByDomain = domainPageWords(contextList);
    const domainAndWordCount = wordsByDomain.map((arrayWithDomain) => {
      const wordCount = arrayWithDomain[1].reduce(
        (accumulatedWordCount, currentUrlData) => {
          return accumulatedWordCount + currentUrlData.words.length;
        },
        0
      );
      return {
        domain: arrayWithDomain[0],
        wordCount,
        icon: getDomainIcon(arrayWithDomain[0]),
      };
    });

    const theme = useTheme();

    const siteModeVirtuoso = useRef(null);
    const groupCounts = Array(domainAndWordCount.length).fill(1);

    // .sort((a, b) => b.wordCount - a.wordCount)

    return (
      <Box>
        <IndexQuickRefBox>
          {domainAndWordCount.map((item, groupIndex) => {
            const domainData = domainAndWordCount[groupIndex];

            return (
              <Chip
                key={groupIndex}
                label={domainData.wordCount}
                size="small"
                sx={{
                  mr: theme.spacing(1),
                  mt: theme.spacing(1),
                  // height: '26px',
                }}
                variant="outlined"
                onClick={(e) => {
                  e.preventDefault();
                  siteModeVirtuoso.current.scrollToIndex({
                    index: groupIndex,
                  });
                }}
                icon={
                  <>
                    <SiteIconAvatar
                      imgSrc={domainData.icon}
                      linkUrl={domainData.domain}
                    />
                    <Typography
                      component="span"
                      sx={{
                        pl: '4px',
                        overflow: 'hidden',
                        maxWidth: '140px',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cutUrl(domainData.domain)}
                    </Typography>
                  </>
                }
              />
            );
          })}
        </IndexQuickRefBox>
        <GroupedVirtuoso
          ref={siteModeVirtuoso}
          groupCounts={groupCounts}
          style={{ height: '65vh', width: width || '100%' }}
          groupContent={(index) => {
            const domainData = domainAndWordCount[index];
            return (
              <ListSubTitle
                content={
                  <>
                    <SiteIconAvatar
                      imgSrc={domainData.icon}
                      linkUrl={domainData.domain}
                    />
                    {cutUrl(domainData.domain)}
                  </>
                }
                fontSize={'1rem'}
              />
            );
          }}
          itemContent={(index, groupIndex) => {
            const wordsByPage = wordsByDomain[groupIndex][1];

            return (
              <Box
                sx={{
                  // columnCount: columns,
                  display: 'flex',
                  flexWrap: 'wrap',
                  pl: '24px',
                }}
              >
                {wordsByPage.map((dataByUrl) => {
                  return (
                    <React.Fragment key={dataByUrl.url}>
                      <WordCollectionPageBox
                        showDate={true}
                        displayMode={displayMode}
                        noIcon={true}
                        arrayWithUrl={dataByUrl}
                        // containerWidth={containerWidth}
                      />
                    </React.Fragment>
                  );
                })}
              </Box>
            );
          }}
        />
      </Box>
    );
  }
);
