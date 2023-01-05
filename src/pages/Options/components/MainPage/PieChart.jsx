import React from 'react';
import { Box } from '@mui/system';
import { ResponsivePie } from '@nivo/pie';
import { InfoBlock } from '../DatabaseInfo';

export const PieChartContainer = () => {
  return (
    <InfoBlock sx={{ width: 'fit-content' }}>
      <Box sx={{ width: '300px', height: '300px' }}>
        <PieChart />
      </Box>
    </InfoBlock>
  );
};
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const pieChartData = [
  {
    id: 'make',
    label: 'make',
    value: 215,
    color: 'hsl(302, 70%, 50%)',
  },
  {
    id: 'lisp',
    label: 'lisp',
    value: 579,
    color: 'hsl(173, 70%, 50%)',
  },
  {
    id: 'java',
    label: 'java',
    value: 79,
    color: 'hsl(32, 70%, 50%)',
  },
  {
    id: 'erlang',
    label: 'erlang',
    value: 25,
    color: 'hsl(221, 70%, 50%)',
  },
  {
    id: 'php',
    label: 'php',
    value: 310,
    color: 'hsl(72, 70%, 50%)',
  },
];

const PieChart = () => (
  <ResponsivePie
    data={pieChartData}
    margin={{ top: 20, right: 40, bottom: 60, left: 40 }}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]],
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [['darker', 2]],
    }}
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: 'ruby',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'c',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'go',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'python',
        },
        id: 'dots',
      },
      {
        match: {
          id: 'scala',
        },
        id: 'lines',
      },
      {
        match: {
          id: 'lisp',
        },
        id: 'lines',
      },
      {
        match: {
          id: 'elixir',
        },
        id: 'lines',
      },
      {
        match: {
          id: 'javascript',
        },
        id: 'lines',
      },
    ]}
    legends={[
      {
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: 56,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: '#999',
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000',
            },
          },
        ],
      },
    ]}
  />
);
