import React, { useContext } from 'react';

import { Outlet } from 'react-router-dom';
import {
  CountBox,
  DatabaseInfo,
  NavToCollection,
  NavToSettingsPage,
  TodaysWordBox,
} from '../DatabaseInfo.js';
import { LineChartContainer } from './LineChart';
import { PieChartContainer } from './PieChart.jsx';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2.js';
import { RandomContext } from './RandomContext.jsx';
import { ContextListContext } from '../../Options.jsx';
import { NoDataPage } from './NoDataPage';

export const MainPage = () => {
  // const { wordInfoTarget, setWordInfoTarget } = useContext(
  //   WordInfoDrawerContext
  // );
  return <Outlet />;
};

export const DefaultMainPage = () => {
  const contextList = useContext(ContextListContext);
  if (contextList && contextList.length === 0) return <NoDataPage />;
  return (
    <Grid2
      container
      rowSpacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}
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
