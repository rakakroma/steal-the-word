import { GitHub } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { currentVersion } from '../../../../utilsForAll/allEnv';

export const OtherInfo = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ my: 'auto' }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {t('version')} : beta {currentVersion}
          </Typography>
          <Typography variant="subtitle1">
            <Trans
              i18nKey="aboutText"
              components={{ bold: <strong /> }}
            ></Trans>
          </Typography>

          <Typography
            component="a"
            target="_blank"
            href="https://github.com/rakakroma/steal-the-word"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              backgroundColor: '#f8f8f8',
            }}
          >
            <GitHub fontSize="small" />
            steal-the-word @rakakroma
          </Typography>
        </Box>
        <Box sx={{ width: '200px', mx: 'auto' }}>
          <img
            src={chrome.runtime.getURL('transparent-thief.png')}
            alt="logo of a thief"
            style={{
              width: '190px',
              height: '200px',
              objectFit: 'cover',
              objectPosition: '113%',
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            By Stable Diffusion 2.1 Demo ({t('And I remove its background')})
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
