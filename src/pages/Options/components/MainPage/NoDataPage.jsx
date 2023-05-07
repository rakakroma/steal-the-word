import { Box, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const NoDataPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: '84vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t(`no-word-yet`)}
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('add some word and come back to see the changes')}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {t('no-data-long-before')}{' '}
        <Link href="https://rakakroma.github.io/steal-word-landing-page/">
          Landing Page
        </Link>{' '}
        {t('no-data-long-middle')}{' '}
        <RouterLink to="/home/settings/backup-restore">
          {t('use the demo data in Settings')}
        </RouterLink>
        {t('no-data-long-after')}
      </Typography>
    </Box>
  );
};
