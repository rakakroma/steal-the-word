import { Box, Chip, Typography, useTheme } from '@mui/material';
import React, { Fragment, memo, useContext, useEffect, useRef } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import {
  cutUrl,
  domainPageWords,
  getHostName,
} from '../../utils/transformData';
import { IndexQuickRefBox } from './IndexQuickRefBox';
import { ListSubTitle } from './ListSubTitle';
import { SiteIconButton } from './SiteIconButton';
import { WordCollectionPageBox } from './WordCollectionPageBox';
import { OrderModeANdSiteTargetContext } from '../../Options';

export const getDomainIcon = (url, domainList, isDomain) => {
  if (!url || !domainList) return '';
  let hostname;
  if (!isDomain) {
    hostname = new URL(url).hostname;
  }
  const domainData = domainList.find(
    (domainAndLinkObj) => domainAndLinkObj.url === (hostname || url)
  );
  return domainData?.icon;
};

export const OrderByTimeAndSiteContainer = memo(
  ({ contextList, domainAndLinkList, width }) => {
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
        icon: getDomainIcon(arrayWithDomain[0], domainAndLinkList, true),
      };
    });

    const theme = useTheme();

    const { targetSite, setTargetSite } = useContext(
      OrderModeANdSiteTargetContext
    );
    const siteModeVirtuoso = useRef(null);
    const groupCounts = Array(domainAndWordCount.length).fill(1);

    useEffect(() => {
      const targetIndex = targetSite
        ? domainAndWordCount.findIndex(
            (domainData) => domainData.domain === targetSite
          )
        : null;
      if (targetIndex) {
        setTimeout(() => {
          if (siteModeVirtuoso.current) {
            siteModeVirtuoso.current.scrollToIndex({
              index: targetIndex,
            });
          }
        }, 300);
      }
      setTargetSite(null);
    }, [domainAndWordCount, targetSite, setTargetSite]);

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
                    <SiteIconButton
                      iconUri={domainData.icon}
                      linkUrl={domainData.domain}
                      iconSize={20}
                      isCircle={true}
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
                    <SiteIconButton
                      iconUri={domainData.icon}
                      linkUrl={`https://${domainData.domain}`}
                      iconSize={25}
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
                  display: 'flex',
                  flexWrap: 'wrap',
                  pl: '24px',
                }}
              >
                {wordsByPage
                  .sort((a, b) => a.words.length - b.words.length)
                  .map((dataByUrl) => {
                    return (
                      <Fragment key={dataByUrl.url}>
                        <WordCollectionPageBox
                          showDate={true}
                          noIcon={true}
                          arrayWithUrl={dataByUrl}
                        />
                      </Fragment>
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
