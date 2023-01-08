import React, { useContext } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { Link, Outlet } from 'react-router-dom';
import { DatabaseInfo } from '../DatabaseInfo.js';
import { LineChartContainer } from './LineChart';
import { PieChartContainer } from './PieChart.jsx';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2.js';
import { RandomContext } from './RandomContext.jsx';
import { ContextListContext } from '../../Options.jsx';

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

const NoDataPage = () => {
  const imgPath = chrome.runtime.getURL('flame-welcome.png');
  return (
    <Box
      sx={{
        height: '84vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2">
        Illustration by{' '}
        <Link href="https://icons8.com/illustrations/author/oZpGJx8ts63Q">
          Thierry Fousse
        </Link>{' '}
        from <Link href="https://icons8.com/illustrations">Ouch!</Link>
      </Typography>
      <img
        src={imgPath}
        alt="just a welcome image"
        style={{ width: '300px', height: '300px' }}
      />
      <Typography variant="h3">You Haven't add any data yet</Typography>
      <Typography variant="h6">
        add some word and come back to see the changes 🤗
      </Typography>
      <Typography>
        If you don't know how to do, how about watch the <Link>Tutorial</Link>,
        or <Button variant="outlined">use the demo data</Button>
      </Typography>
    </Box>
  );
};
