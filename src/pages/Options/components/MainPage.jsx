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

import { WordCollection } from './WordCollection';

export const MainPage = ({ test }) => {
  return (
    <Box>
      {test}
      <WordCollection />
    </Box>
  );
};
