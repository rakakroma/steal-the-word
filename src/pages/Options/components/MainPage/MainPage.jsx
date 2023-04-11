import React, { useContext } from 'react';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2.js';
import { Outlet } from 'react-router-dom';
import { ContextListContext } from '../../Options.jsx';
import {
  CountBox,
  NavToCollection,
  NavToSettingsPage,
  TodaysWordBox,
} from '../DatabaseInfo';
import { LineChartContainer } from './LineChart';
import { NoDataPage } from './NoDataPage';
import { PieChartContainer } from './PieChart.jsx';
import { RandomContext } from './RandomContext.jsx';

export const MainPage = () => {
  return <Outlet />;
};

export const DefaultMainPage = () => {
  const contextList = useContext(ContextListContext);
  if (contextList && contextList.length === 0) return <NoDataPage />;
  return (
    <Grid2
      container
      rowSpacing={2}
      columns={{ xs: 4, sm: 4, md: 12 }}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <Grid2 xs={2} sm={2} md={3}>
        <CountBox />
      </Grid2>
      <Grid2 xs={2} sm={2} md={3}>
        <TodaysWordBox />
      </Grid2>
      <Grid2 xs={2} sm={2} md={3}>
        <NavToSettingsPage />
      </Grid2>
      <Grid2 xs={2} sm={2} md={3}>
        <NavToCollection />
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
