import { CollectionsBookmark, Edit } from '@mui/icons-material';
import {
  Box,
  Chip,
  createTheme,
  Divider,
  IconButton,
  Link,
  Stack,
  Switch,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { createContext, useEffect, useState } from 'react';
// import { getDomain } from '../Options/utils/transformData';
import Grid from '@mui/material/Unstable_Grid2';

import './Popup.css';
import { ToggleOptions } from './ToggleOptions';
import { PopupTabs } from './PopupTabs';
import { db } from '../Background/database.js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCurrentTabData } from './useDataHook';

export const TabDataContext = createContext({});

const Popup = () => {
  const tabData = useCurrentTabData();
  const { currentUrl, currentDomain, favIconUrl, validPlace } = tabData;

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

  if (!validPlace) {
    return (
      <div className="App">
        <header className="App-header">
          <h4>擴充程式外才可使用</h4>
          <h2>
            <ruby>
              hōo lí<rt>予你</rt>Ruby
            </ruby>
          </h2>
        </header>
      </div>
    );
  }

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
              <Typography variant="body1" sx={{ pl: '2px' }}>
                {currentDomain}
              </Typography>
            </Grid>

            {/* <Grid container alignItems="center" justifyContent="center">
            <Chip label="Tech" size="small" />
            <Chip label="news" size="small" />
            <Chip label="SNS" size="small" />
            <Chip label="sports" size="small" />
          </Grid> */}
          </Box>
          <Box>
            {/* <PopupTabs
            activate={activate}
            setActivate={setActivate}
            openMouseTool={openMouseTool}
            setOpenMouseTool={setOpenMouseTool}
            openFloatingWindow={openFloatingWindow}
            setOpenFloatingWindow={setOpenFloatingWindow}
            customSettingToggle={customSettingToggle}
            setCustomSettingToggle={setCustomSettingToggle}
            currentDomain={currentDomain}
            domainData={domainData}
            setDomainData={setDomainData}
          /> */}
            <PopupTabs />
          </Box>
        </Box>
      </ThemeProvider>
    </TabDataContext.Provider>
  );
};

export default Popup;
