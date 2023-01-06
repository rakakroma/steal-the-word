import React, { useContext, useMemo } from 'react';
import { Box } from '@mui/system';
import { ResponsivePie } from '@nivo/pie';
import { InfoBlock } from '../DatabaseInfo';
import { ContextListContext, DomainAndLinkListContext } from '../../Options';
import { cutUrl } from '../../utils/transformData';
import { Typography } from '@mui/material';

export const PieChartContainer = () => {
  return (
    <InfoBlock sx={{ width: 'fit-content' }}>
      <Typography>Top Ten Sites</Typography>
      <Box sx={{ width: '380px', height: '280px' }}>
        <PieChart />
      </Box>
    </InfoBlock>
  );
};

const PieChart = () => {
  const contextList = useContext(ContextListContext);

  const domainWordCount = useMemo(() => {
    if (!contextList) return null;
    return contextList
      .reduce((accu, curr) => {
        const domainName = new URL(curr.url).hostname || curr.url;
        const indexOfCurrentDomain = accu.findIndex(
          (domainAndCount) => domainAndCount.id === domainName
        );
        if (indexOfCurrentDomain === -1) {
          accu.push({ id: domainName, label: domainName, value: 1 });
        } else {
          accu[indexOfCurrentDomain].value += 1;
        }
        return accu;
      }, [])
      .sort((a, b) => b.value - a.value);
  }, [contextList]);

  if (!contextList) return null;
  const topTenDomainCount = domainWordCount.slice(0, 10);

  return (
    <ResponsivePie
      data={topTenDomainCount}
      margin={{ top: 20, right: 90, bottom: 20, left: 90 }}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: 'oranges' }}
      innerRadius={0.2}
      //   enableArcLinkLabels={false}
      arcLinkLabel={(datum) => cutUrl(datum.id)}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsDiagonalLength={7}
      arcLinkLabelsStraightLength={5}
    />
  );
};
