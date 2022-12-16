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
import { fontFamily } from '@mui/system';
import React, { useEffect, useState } from 'react';
// import { getDomain } from '../Options/utils/transformData';
import Grid from '@mui/material/Unstable_Grid2';

import './Popup.css';
import { ToggleOptions } from './ToggleOptions';
import { PopupTabs } from './PopupTabs';
import { db } from '../Background/database.js';

const Popup = () => {
  const [currentDomain, setCurrentDomain] = useState('');
  const [validPlace, setValidPlace] = useState(true);
  const [favIconUrl, setFavIconUrl] = useState('');
  const [domainData, setDomainData] = useState(null);

  const [customSettingToggle, setCustomSettingToggle] = useState(false);

  const [activate, setActivate] = useState(false);
  const [openMouseTool, setOpenMouseTool] = useState(false);
  const [openFloatingWindow, setOpenFloatingWindow] = useState(false);

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

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const thisDomain = new URL(tabs[0].url).hostname;
      setFavIconUrl(tabs[0].favIconUrl);
      if (tabs[0].url.split('//')[0].includes('extension')) {
        setValidPlace(false);
      }
      setCurrentDomain(thisDomain);

      db.domainAndLink.get({ url: thisDomain }).then((gotDomainData) => {
        if (gotDomainData) {
          console.log(gotDomainData);
          setDomainData(gotDomainData);
        } else {
          console.log('no current data');
        }
        if (
          [
            typeof gotDomainData.floatingWindow,
            typeof gotDomainData.mouseTool,
            typeof gotDomainData.activate,
          ].includes('boolean')
        ) {
          setCustomSettingToggle(true);
        }
      });

      chrome.storage.local.get(
        ['activate', 'floatingWindow', 'mouseTool'],
        (obj) => {
          if (obj.activate) setActivate(true);
          if (obj.mouseTool) setOpenMouseTool(true);
          if (obj.floatingWindow) setOpenFloatingWindow(true);
        }
      );
    });
  }, []);

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

  const handleToggleFloatingWindow = () => {
    if (openFloatingWindow === true) {
      setOpenFloatingWindow(false);
      // chrome.storage.local.set({ "wordListDisplay": false })
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { showWordList: false },
          (response) => {
            console.log(response);
          }
        );
      });
    } else {
      setOpenFloatingWindow(true);
      // chrome.storage.local.set({ "wordListDisplay": true })
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { showWordList: true },
          (response) => {
            console.log(response);
          }
        );
      });
    }
  };

  return (
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
            <IconButton>
              <Edit sx={{ width: '13px', height: '13px' }} />
            </IconButton>
          </Grid>

          {/* <Grid container alignItems="center" justifyContent="center">
            <Chip label="Tech" size="small" />
            <Chip label="news" size="small" />
            <Chip label="SNS" size="small" />
            <Chip label="sports" size="small" />
          </Grid> */}
        </Box>
        <Box>
          <PopupTabs
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
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Popup;
