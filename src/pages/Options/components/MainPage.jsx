import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';

import {
  Box,
  createTheme,
  CssBaseline,
  Divider,
  Switch,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';

import { WordCollection } from './WordCollection/WordCollection';
import { DatabaseInfo } from './DatabaseInfo.js';
import { WordInfoDrawerContext } from '../Options';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

export const MainPage = () => {
  // const { wordInfoTarget, setWordInfoTarget } = useContext(
  //   WordInfoDrawerContext
  // );
  return <Outlet />;
};

export const DefaultMainPage = () => {
  return (
    <Box sx={{ width: '90vw' }}>
      <DatabaseInfo />
      {/* <Typography component={RouterLink} to="contexts">
        Contexts Collection:
      </Typography>
      <LatestContexts /> */}
      <Box>
        <Typography component={RouterLink} to="words">
          Words Collection:
        </Typography>
      </Box>
    </Box>
  );
};