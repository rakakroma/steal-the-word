import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';
import { DatabaseInfo } from '../DatabaseInfo.js';
import { LineChartContainer } from './LineChart';
import { PieChartContainer } from './PieChart.jsx';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2.js';

export const MainPage = () => {
  // const { wordInfoTarget, setWordInfoTarget } = useContext(
  //   WordInfoDrawerContext
  // );
  return <Outlet />;
};

export const DefaultMainPage = () => {
  return (
    <Grid2 container spacing={1}>
      <Grid2 md={6}>
        <DatabaseInfo />
      </Grid2>
      <Grid2 md={6}>
        <LineChartContainer />
      </Grid2>
      <Grid2 md={4}>
        <PieChartContainer />
      </Grid2>
    </Grid2>
  );
};
