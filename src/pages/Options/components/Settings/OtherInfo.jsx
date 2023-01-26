import { GitHub } from '@mui/icons-material';
import { Box, FormLabel, Typography } from '@mui/material';
import React from 'react';
import { ReportForm } from './ReportForm';
import { Trans, useTranslation } from 'react-i18next';

export const OtherInfo = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ my: 'auto' }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {t('version')} : beta 0.1
          </Typography>
          <Typography variant="subtitle1">
            <Trans i18nKey="aboutText" components={{ bold: <strong /> }}>
              Hi, <bold>Steal the Word</bold> is a free software licensed under
              the MIT. This browser extension is currently in beta version, and
              there are some known issues that I have yet to fix, but I hope it
              works well in most use cases. Feel free to report bugs/issues or
              give me some advices through the form below (to here) or by
              opening an issue/ pull request on github.
            </Trans>
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
      <ReportForm />
    </Box>
  );
};
