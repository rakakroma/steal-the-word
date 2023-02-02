import { CollectionsBookmark, Settings } from '@mui/icons-material';
import {
  Box,
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import './Popup.css';
import { PopupTabs } from './PopupTabs';
import { useCurrentTabData } from './useCurrentTabData';
import { styled } from '@mui/system';

const HoverButton = styled(Button)`
  height: 30px;
  width: 100px;
  font-size: 12px;
  color: grey;
  .button-text {
    transition: color 0.1s ease-in;
    color: white;
  }
  &:hover {
    .button-text {
      color: grey;
    }
  }
`;

const Popup = () => {
  const { currentDomain, favIconUrl, validPlace } = useCurrentTabData();

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
    <ThemeProvider theme={theme}>
      <Box className="App" sx={{ width: '220px' }}>
        <Box sx={{ m: '6px' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <HoverButton
                startIcon={<Settings />}
                LinkComponent={'a'}
                href={`${chrome.runtime.getURL('options.html')}`}
                target="_blank"
                variant="text"
                size="small"
              >
                <div class="button-text">Settings</div>
              </HoverButton>
            </Grid>
            <Grid>
              <HoverButton
                endIcon={<CollectionsBookmark />}
                LinkComponent={'a'}
                href={`${chrome.runtime.getURL('options.html')}#/home`}
                target="_blank"
                variant="text"
                size="small"
              >
                <div class="button-text">Collection</div>
              </HoverButton>
            </Grid>
          </Grid>

          <Grid container alignItems="center" justifyContent="center">
            <img width="16px" height="16px" src={favIconUrl} alt=""></img>
            <Typography
              variant="body1"
              sx={{ pl: '2px', wordBreak: 'break-all' }}
            >
              {validPlace ? currentDomain : 'not valid'}
            </Typography>
          </Grid>
        </Box>

        <Box>
          {currentDomain && (
            <PopupTabs currentDomain={currentDomain} validPlace={validPlace} />
          )}
        </Box>
        <Typography
          sx={{
            pr: 1,
            m: 0,
            color: 'grey',
            // borderTop: '1px solid lightgray',
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '10px',
          }}
        >
          @Steal the Word v0.1
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Popup;
