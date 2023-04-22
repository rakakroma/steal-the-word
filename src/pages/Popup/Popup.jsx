import { CollectionsBookmark, Settings } from '@mui/icons-material';
import {
  Box,
  IconButton,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { Suspense } from 'react';

import { useTranslation } from 'react-i18next';
import { currentVersion } from '../../utilsForAll/allEnv';
import './Popup.css';
import { PopupTabs } from './PopupTabs';
import { useCurrentTabData } from './useCurrentTabData';

// const HoverButton = styled(Button)`
//   height: 30px;
//   width: 100px;
//   font-size: 12px;
//   color: grey;
//   .button-text {
//     transition: color 0.1s ease-in;
//     color: white;
//   }
//   &:hover {
//     .button-text {
//       color: grey;
//     }
//   }
// `;

const LinkButtonsGrid = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Tooltip title={t('settings')} placement="right">
        <IconButton
          LinkComponent={'a'}
          href={`${chrome.runtime.getURL('options.html')}`}
          target="_blank"
          size="small"
        >
          <Settings />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('collection')} placement="left">
        <IconButton
          LinkComponent={'a'}
          href={`${chrome.runtime.getURL('options.html')}#/home`}
          target="_blank"
          size="small"
        >
          <CollectionsBookmark />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

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
          <Grid container alignItems="center" justifyContent="center">
            <Suspense fallback="Loading">
              <LinkButtonsGrid />
            </Suspense>
            {validPlace ? (
              <>
                <img width="16px" height="16px" src={favIconUrl} alt="" />
                <Typography
                  variant="body1"
                  sx={{ pl: '2px', wordBreak: 'break-all' }}
                >
                  {currentDomain}
                </Typography>
              </>
            ) : (
              ''
            )}
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
            textAlign: 'right',
            userSelect: 'none',
            fontSize: '10px',
          }}
        >
          @Steal the Word v{currentVersion}
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Popup;
