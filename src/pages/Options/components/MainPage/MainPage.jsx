import React from 'react';

import { Box } from '@mui/material';

import { Outlet } from 'react-router-dom';
import { DatabaseInfo } from '../DatabaseInfo.js';
import { LineChartContainer } from './LineChart';
import { PieChartContainer } from './PieChart.jsx';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2.js';
import { RandomContext } from './RandomContext.jsx';

export const MainPage = () => {
  // const { wordInfoTarget, setWordInfoTarget } = useContext(
  //   WordInfoDrawerContext
  // );
  return <Outlet />;
};

export const DefaultMainPage = () => {
  return (
    <Grid2
      container
      rowSpacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid2 xs={4} sm={8}>
        <DatabaseInfo />
      </Grid2>
      <Grid2 sm={8} md={6}>
        <LineChartContainer />
      </Grid2>
      <Grid2 sm={8} md={6}>
        <PieChartContainer />
      </Grid2>
      <Grid2 md={12}>
        <RandomContext />
      </Grid2>
    </Grid2>
  );
};
