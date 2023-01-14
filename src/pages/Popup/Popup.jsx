import { CollectionsBookmark } from '@mui/icons-material';
import {
  Box,
  createTheme,
  IconButton,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { createContext } from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import './Popup.css';
import { PopupTabs } from './PopupTabs';
import { useCurrentTabData } from './useCurrentTabData';

export const TabDataContext = createContext({});

const Popup = () => {
  const tabData = useCurrentTabData();
  const { currentDomain, favIconUrl, validPlace } = tabData;

  const theme = createTheme({
    typography: {
      fontSize: 12,
      fontFamily: [
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
      ].join(','),
    },
  });

  return (
    <TabDataContext.Provider value={tabData}>
      <ThemeProvider theme={theme}>
        <Box className="App" sx={{ width: '220px' }}>
          <Box sx={{ m: '6px' }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <Typography variant="h6" sx={{ fontSize: '15px' }}>
                  Options
                </Typography>
              </Grid>
              <Grid>
                <IconButton
                  LinkComponent={'a'}
                  href={`${chrome.runtime.getURL('options.html')}#/home`}
                  target="_blank"
                  sx={{ width: '20px', height: '20px' }}
                >
                  <CollectionsBookmark />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container alignItems="center" justifyContent="center">
              <img width="16px" height="16px" src={favIconUrl} alt=""></img>
              <Typography
                variant="body1"
                sx={{ pl: '2px', wordBreak: 'break-all' }}
              >
                {currentDomain}
              </Typography>
            </Grid>
          </Box>

          <Box>
            <PopupTabs />
          </Box>
        </Box>
      </ThemeProvider>
    </TabDataContext.Provider>
  );
};

export default Popup;
