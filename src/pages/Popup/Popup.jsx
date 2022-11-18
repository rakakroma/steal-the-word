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
  // const [dynamicRendering, setDynamicRendering] = useState(false)
  // const [turnOnOff, setTurnOnOff] = useState(true)
  const [currentDomain, setCurrentDomain] = useState('');
  const [validPlace, setValidPlace] = useState(true);
  // const [showWordList, setShowWordList] = useState(false)
  const [favIconUrl, setFavIconUrl] = useState('');
  const [domainData, setDomainData] = useState(null);

  const [customSettingToggle, setCustomSettingToggle] = useState(false);
  // const [openCurrentSiteFloatingWindow, setOpenCurrentSiteFloatingWindow] = useState(false)
  // const [openCurrentSiteMouseTool, setOpenCurrentSiteMouseTool] = useState(false)
  // const [currentSiteActivateToggle, setCurrentSiteActivateToggle] = useState(false)

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
          //delete this after update all data in db
          // if (!gotDomainData.floatingWindow) {
          //   gotDomainData.floatingWindow = null;
          //   gotDomainData.mouseTool = null;
          //   gotDomainData.activate = null;
          // }
          //
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
        //     if (typeof gotDomainData.floatingWindow === 'boolean') setOpenCurrentSiteFloatingWindow(gotDomainData.floatingWindow)
        //     if (typeof gotDomainData.mouseTool === 'boolean') setOpenCurrentSiteMouseTool(gotDomainData.mouseTool)
        //     if (typeof gotDomainData.activate === 'boolean') setCurrentSiteActivateToggle(gotDomainData.activate)
        //   }
      });

      chrome.storage.local.get(
        ['activate', 'floatingWindow', 'mouseTool'],
        (obj) => {
          if (obj.activate) setActivate(true);
          if (obj.mouseTool) setOpenMouseTool(true);
          if (obj.floatingWindow) setOpenFloatingWindow(true);
          // if no site custom setting
          // setCurrentSiteActivateToggle(obj.activate)
          // setOpenCurrentSiteFloatingWindow(obj.floatingWindow)
          // setOpenCurrentSiteMouseTool(obj.mouseTool)
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

  // const handleRenderOption = () => {
  //   if (!dynamicRendering) {
  //     setDynamicRendering(true);
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       chrome.tabs.sendMessage(tabs[0].id, { dynamicRendering: true, tabInfo: tabs[0] },
  //         (response) => {
  //           console.log(response);
  //         });
  //     });
  //   } else {
  //     setDynamicRendering(false);
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       chrome.tabs.sendMessage(tabs[0].id, { dynamicRendering: false, tabInfo: tabs[0] },
  //         (response) => {
  //           console.log(response);
  //         });
  //     });
  //   }
  // }

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
                href={`${chrome.runtime.getURL('options.html')}#/main`}
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
          <Grid container alignItems="center" justifyContent="center">
            <Chip label="ja" size="small" variant="outlined" />
            <Chip label="en" size="small" />
          </Grid>
          <Grid container alignItems="center" justifyContent="center">
            <Chip label="Tech" size="small" />
            <Chip label="news" size="small" />
            <Chip label="SNS" size="small" />
            <Chip label="sports" size="small" />
          </Grid>
        </Box>
        <Box sx={{}}>
          <PopupTabs
            activate={activate}
            setActivate={setActivate}
            openMouseTool={openMouseTool}
            setOpenMouseTool={setOpenMouseTool}
            openFloatingWindow={openFloatingWindow}
            setOpenFloatingWindow={setOpenFloatingWindow}
            customSettingToggle={customSettingToggle}
            setCustomSettingToggle={setCustomSettingToggle}
            // openCurrentSiteFloatingWindow={openCurrentSiteFloatingWindow}
            // setOpenCurrentSiteFloatingWindow={setOpenCurrentSiteFloatingWindow}
            // openCurrentSiteMouseTool={openCurrentSiteMouseTool}
            // setOpenCurrentSiteMouseTool={setOpenCurrentSiteMouseTool}
            // currentSiteActivateToggle={currentSiteActivateToggle}
            // setCurrentSiteActivateToggle={setCurrentSiteActivateToggle}
            currentDomain={currentDomain}
            domainData={domainData}
            setDomainData={setDomainData}
          />
        </Box>
        {/* <header className="App-header"> */}
        {/* <PopUpToggleButton /> */}
        {/* <Typography variant='h6'>目前網域</Typography>
          <Switch size='small'
            checked={dynamicRendering}
            onChange={handleRenderOption} />
          <Typography variant='subtitle2'>開啟功能</Typography>
          <Switch size='small'
            checked={turnOnOff}
            onChange={handleTurnOnOff} />
          <Typography variant='subtitle2'>顯示本頁詞</Typography>
          <Switch size='small'
            checked={showWordList}
            onChange={handleShowWordList} /> */}
        {/* </header> */}
      </Box>
    </ThemeProvider>
  );
};

export default Popup;
